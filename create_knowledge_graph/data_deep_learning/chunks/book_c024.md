L14854: <!-- page 305 -->
L14855: 15.5
L14856: Image translation
L14857: 291
L14858: Figure 15.14 Auxiliary classifier GAN. The generator takes a class label as well
L14859: as the latent vector. The discriminator must both identify if the data point is
L14860: real and predict the class label. This model was trained on ten ImageNet classes.
L14861: Left to right: generated examples of monarch butterflies, goldfinches, daisies,
L14862: redshanks, and gray whales. Adapted from Odena et al. (2017).
L14863: attribute with C categories, the discriminator takes the real/synthesized image as input
L14864: and has C + 1 outputs; the first is passed through a sigmoid function and predicts if the
L14865: sample is generated or real. The remaining outputs are passed through a softmax func-
L14866: tion to predict the probability that the data belongs to each of the C classes. Networks
L14867: trained with this method can synthesize multiple classes from ImageNet (figure 15.14).
L14868: 15.4.3
L14869: InfoGAN
L14870: The conditional GAN and ACGAN both generate samples that have predetermined at-
L14871: tributes. By contrast, InfoGAN (figure 15.13c) attempts to identify important attributes
L14872: automatically. The generator takes a vector consisting of random noise variables z and
L14873: random attribute variables c. The discriminator both predicts whether the image is real
L14874: or synthesized and estimates the attribute variables.
L14875: The insight is that interpretable real-world characteristics should be easiest to predict
L14876: and hence will be represented in the attribute variables c. The attributes in c may be
L14877: discrete (and a binary or multiclass cross-entropy loss would be used) or continuous (and
L14878: a least squares loss would be used). The discrete variables identify categories in the data,
L14879: and the continuous ones identify gradual modes of variation (figure 15.15).
L14880: 15.5
L14881: Image translation
L14882: Although the adversarial discriminator was first used in the context of the GAN for
L14883: generating random samples, it can also be used as a prior that favors realism in tasks
L14884: that translate one data example into another. This is most commonly done with images,
L14885: Draft: please send errata to udlbookmail@gmail.com.
L14888: <!-- page 306 -->
L14889: 292
L14890: 15
L14891: Generative adversarial networks
L14892: Figure 15.15 InfoGAN for MNIST. a) Training examples from the MNIST
L14893: database, which consists of 28×28 pixel images of handwritten digits. b) The
L14894: first attribute c1 is categorical with 10 categories; each column shows samples
L14895: generated with one of these categories.
L14896: The InfoGAN recovers the ten digits.
L14897: The attribute vectors c2 and c3 are continuous. c) Moving from left to right, each
L14898: column represents a different value of c2 while keeping the other latent variables
L14899: constant. This attribute seems to correspond to the orientation of the charac-
L14900: ter. d) The third attribute seems to correspond to the thickness of the stroke.
L14901: Adapted from Chen et al. (2016b).
L14902: where we might want to translate a grayscale image to color, a noisy image to a clean
L14903: one, a blurry image to a sharp one, or a sketch to a photo-realistic image.
L14904: This section discusses three image translation models that use different amounts of
L14905: manual labeling. The Pix2Pix model uses before/after pairs for training. Models with
L14906: adversarial losses use before/after pairs for the main model but also exploit unpaired
L14907: “after” images in the discriminator. The CycleGAN model uses unpaired images.
L14908: 15.5.1
L14909: Pix2Pix
L14910: The Pix2Pix model (figure 15.16) is a network ˆx = g[c, θ] that maps one image c to a
L14911: different style image x using a U-Net (figure 11.10) with parameters θ. A typical use
L14912: case would be colorization, where the input c is grayscale, and the output g[c, θ] is color.
L14913: The output should be similar to the input, and this is encouraged using a content loss
L14914: that penalizes the ℓ1 norm ||x−g[c, θ]||1 between the input c and ground truth output x.
L14915: Appendix B.3.2
L14916: ℓ1 norm
L14917: However, the output image should also look like a realistic conversion of the input.
L14918: This is encouraged by using an adversarial discriminator f[c, x, ϕ], which ingests the
L14919: before and after images c and x. At each step, the discriminator tries to distinguish
L14920: between a real before/after pair and a before/synthesized pair. To the extent that these
L14921: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L14924: <!-- page 307 -->
L14925: 15.5
L14926: Image translation
L14927: 293
L14928: can be distinguished successfully, a feedback signal is provided to modify the U-Net to
L14929: make its output more realistic. Since the content loss ensures that the large-scale image
L14930: structure is correct, the discriminator is mainly needed to ensure that the local texture
L14931: is plausible. To this end, the PatchGAN loss is based on a purely convolutional classifier.
L14932: At the last layer, each hidden unit indicates whether the region within its receptive field
L14933: is real or synthesized. These responses are averaged to provide the final output.
L14934: One way to think of this model is that it is a conditional GAN where the U-Net is the
L14935: generator and is conditioned on an image rather than a label. Notice, though, that the
L14936: U-Net input does not include noise and so is not really a “generator” in the conventional
L14937: sense. Interestingly, the original authors experimented with adding noise z to the U-Net
L14938: in addition to the input image c. However, the network just learned to ignore it.
L14939: 15.5.2
L14940: Adversarial loss
L14941: The discriminator of the Pix2Pix model attempted to distinguish whether before/after
L14942: pairs in an image translation task were plausible. This has the disadvantage that we
L14943: need ground truth before/after pairs to exploit the discriminator loss. Fortunately, there
L14944: is a simpler way to exploit the power of adversarial discriminators in the context of
L14945: supervised learning without the need for additional labeled training data.
L14946: An adversarial loss adds a penalty if a discriminator can distinguish the output of
L14947: a supervised network from a real example from its output domain. Accordingly, the
L14948: supervised model changes its predictions to decrease this penalty. This may be done at
L14949: the scale of the entire output or at the level of patches, as in the Pix2Pix algorithm. This
L14950: helps improve the realism of complex structured outputs. However, it doesn’t necessarily
L14951: lead to a better solution in terms of the original loss function.
L14952: The super-resolution GAN or SRGAN uses this approach (figure 15.17). The main
L14953: model consists of a convolutional network with residual connections that ingests a low-
L14954: resolution image and converts this via upsampling layers to a high-resolution image. The
L14955: network is trained with three losses. The content loss measures the squared difference
L14956: between the output and the true high-resolution image. The VGG loss or perceptual
L14957: loss passes the synthesized and ground truth outputs through the VGG network and
L14958: measures the squared difference between their activations. This encourages the image to
L14959: be semantically similar to the target. Finally, the adversarial loss uses a discriminator
L14960: that attempts to distinguish whether this is a real high-resolution image or an upsampled
L14961: one. This encourages the output to be indistinguishable from real examples.
L14962: 15.5.3
L14963: CycleGAN
L14964: The adversarial loss assumes that we have labeled before/after images for the main
L14965: supervised network. The CycleGAN addresses the situation where we have two sets of
L14966: data with distinct styles but no matching pairs. An example is converting a photo to
L14967: the artistic style of Monet. There exist many photos and many Monet paintings, but no
L14968: correspondence between them. CycleGAN exploits the idea that converting an image in
L14969: Draft: please send errata to udlbookmail@gmail.com.
L14972: <!-- page 308 -->
L14973: 294
L14974: 15
L14975: Generative adversarial networks
L14976: Figure 15.16 Pix2Pix model. a) The model translates an input image to a pre-
L14977: diction in a different style using a U-Net (see figure 11.10). In this case, it maps
L14978: a grayscale image to a plausibly colored version.
L14979: The U-Net is trained with
L14980: two losses. First, the content loss encourages the output image to have a sim-
L14981: ilar structure to the input image. Second, the adversarial loss encourages the
L14982: grayscale/color image pair to be indistinguishable from a real pair in each local
L14983: region of these images. This framework can be adapted to many tasks, including
L14984: b) translating maps to satellite imagery, c) converting sketches of bags to photo-
L14985: realistic examples, d) colorization, and e) converting label maps to photorealistic
L14986: building facades. Adapted from Isola et al. (2017).
L14987: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L14990: <!-- page 309 -->
L14991: 15.5
L14992: Image translation
L14993: 295
L14994: Figure 15.17 Super-resolution generative adversarial network (SRGAN). a) A
L14995: convolutional network with residual connections is trained to increase the reso-
L14996: lution of images by a factor of four. The model has losses that encourage the
L14997: content to be close to the true high-resolution image. However, it also includes
L14998: an adversarial loss, which penalizes results that can be distinguished from real
L14999: high-resolution images. b) Upsampled image using bicubic interpolation. c) Up-
L15000: sampled image using SRGAN. d) Upsampled image using bicubic interpolation.
L15001: e) Upsampled image using SRGAN. Adapted from Ledig et al. (2017).
L15002: Draft: please send errata to udlbookmail@gmail.com.
L15005: <!-- page 310 -->
L15006: 296
L15007: 15
L15008: Generative adversarial networks
L15009: one direction (e.g., photo→Monet) and then back again should recover the original.
L15010: The CycleGAN loss function is a weighted sum of three losses (figure 15.18). The
L15011: content loss encourages the before and after images to be similar and is based on the ℓ1
L15012: Appendix B.3.2
L15013: ℓ1 norm
L15014: norm. The adversarial loss uses a discriminator to encourage the output to be indistin-
L15015: guishable from real examples of the target domain. Finally, the cycle-consistency loss
L15016: encourages the mapping to be reversible. Here, two models are trained together. One
L15017: maps from the first domain to the second, and the other in the opposite direction. The
L15018: cycle-consistency loss will be low if the translated image can be itself translated success-
L15019: fully back to the image in the original domain. The model combines these three losses
L15020: to train networks to translate images from one style to another and back again.
L15021: 15.6
L15022: StyleGAN
L15023: StyleGAN is a more contemporary GAN that partitions the variation in a dataset into
L15024: meaningful components, each of which is controlled by a subset of the latent variables.
L15025: In particular, StyleGAN controls the output image at different scales and separates
L15026: style from noise. For face images, large-scale changes include face shape and head pose,
L15027: medium-scale changes include the shape and details of facial features, and fine-scale
L15028: changes include hair and skin color.
L15029: The style components represent aspects of the
L15030: image that are salient to human beings, and the noise aspects represent unimportant
L15031: variation such as the exact placement of hairs, stubble, freckles, or skin pores.
L15032: The GANs that we have seen until now started from a latent variable z which is
L15033: drawn from a standard base distribution. This was passed through a series of convolu-
L15034: tional layers to produce the output image. However, the latent variable inputs to the
L15035: generator can (i) be introduced at various points in the architecture and (ii) modify the
L15036: current representation at these points in different ways. StyleGAN makes these choices
L15037: judiciously to control scale and to separate style from noise (figure 15.19).
L15038: The main generative branch of StyleGAN starts with a learned constant 4×4 repre-
L15039: sentation with 512 channels. This passes through a series of convolutional layers that
L15040: gradually upsample the representation to generate the image at its final resolution. Two
L15041: sets of random latent variables representing style and noise are introduced at each scale;
L15042: the closer that they are to the output, the finer scale details they represent.
L15043: The latent variables that represent noise are independently sampled Gaussian vec-
L15044: tors z1, z2 . . . and are injected additively after each convolution operation in the main
L15045: generative pipeline. They are the same spatial size as the main representation at the point
L15046: that they are added but are multiplied by learned per-channel scaling factors ψ1, ψ2 . . .
L15047: and so contribute in different amounts to each channel. As the resolution of the network
L15048: increases, this noise contributes at finer scales.
L15049: The latent variables that represent style begin as a 1×1×512 noise tensor, which is
L15050: passed through a seven-layer fully connected network to create an intermediate vari-
L15051: able w. This allows the network to decorrelate aspects of style so that each dimension
L15052: of w can represent an independent real-world factor such as head pose or hair color.
L15053: This variable w is linearly transformed to a 2×1×512 tensor y, which is used to set
L15054: the per-channel mean and variance of the representation across spatial positions in the
L15055: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L15058: <!-- page 311 -->
L15059: 15.6
L15060: StyleGAN
L15061: 297
L15062: Figure 15.18 CycleGAN. Two models are trained simultaneously. The first c′ =
L15063: g[cj, θ] translates from an image c in the first style (horse) to an image c′ in the
L15064: second style (zebra). The second model c = g′[c′, θ] learns the opposite map-
L15065: ping. The cycle consistency loss penalizes both models if they cannot successfully
L15066: convert an image to the other domain and back to the original. In addition, two
L15067: adversarial losses encourage the translated images to look like realistic examples
L15068: of the target domain (shown here for zebra only). Two content losses encourage
L15069: the details and layout of the images before and after each mapping to be similar
L15070: (i.e., the zebra is in the same position and pose that the horse was and against
L15071: the same background and vice versa). Adapted from Zhu et al. (2017).
L15072: Draft: please send errata to udlbookmail@gmail.com.
L15075: <!-- page 312 -->
L15076: 298
L15077: 15
L15078: Generative adversarial networks
L15079: Figure 15.19 StyleGAN. The main pipeline (center row) starts with a constant
L15080: learned representation (gray box). This is passed through a series of convolutional
L15081: layers and gradually upsampled to create the output. Noise (top row) is added
L15082: at different scales by periodically adding Gaussian variables z• with per-channel
L15083: scaling ψ•. The Gaussian style variable z is passed through a fully connected
L15084: network to create intermediate variable w (bottom row). This is used to set the
L15085: mean and variance of each channel at various points in the pipeline.
L15086: main branch after noise addition. This is termed adaptive instance normalization (fig-
L15087: ure 11.14e). A series of vectors y1, y2, . . . are injected in this way at several different
L15088: points in the main branch, so the same style contributes at different scales. Figure 15.20
L15089: shows examples of manipulating the style and noise vectors at different scales.
L15090: 15.7
L15091: Summary
L15092: GANs learn a generator network that transforms random noise into data that is indistin-
L15093: guishable from a training set. To this end, the generator is trained using a discriminator
L15094: network that tries to distinguish real examples from generated samples. The generator
L15095: is then updated so that the data that it creates is identified as being more “real” by the
L15096: discriminator. The original formulation of this idea has the flaw that the training signal
L15097: is weak when it’s easy to determine if the samples are real or generated. This led to the
L15098: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L15101: <!-- page 313 -->
L15102: Notes
L15103: 299
L15104: Figure 15.20 StyleGAN results. First four columns show systematic changes in
L15105: style at various scales. Fifth column shows the effect of increasing noise magni-
L15106: tude. Last two columns show different noise vectors at two different scales.
L15107: Wasserstein GAN, which provides a more consistent training signal.
L15108: We reviewed convolutional GANs for generating images and a series of tricks that
L15109: improve the quality of the generated images, including progressive growing, mini-batch
L15110: discrimination, and truncation. Conditional GAN architectures introduce an auxiliary
L15111: vector that allows control over the output (e.g., the choice of object class). Image trans-
L15112: lation tasks retain this conditional information in the form of an image but dispense with
L15113: the random noise. The GAN discriminator now works as an additional loss term that
L15114: favors “realistic” looking images. Finally, we described StyleGAN, which injects noise
L15115: into the generator strategically to control the style and noise at different scales.
L15116: Notes
L15117: Goodfellow et al. (2014) introduced generative adversarial networks. An early review of progress
L15118: can be found in Goodfellow (2016). More recent overviews include Creswell et al. (2018) and
L15119: Draft: please send errata to udlbookmail@gmail.com.
L15122: <!-- page 314 -->
L15123: 300
L15124: 15
L15125: Generative adversarial networks
L15126: Gui et al. (2021). Park et al. (2021) present a review of GAN models that focuses on computer
L15127: vision applications. Hindupur (2022) maintains a list of named GAN models (numbering 501
L15128: at the time of writing) from ABC-GAN (Susmelj et al., 2017) right through to ZipNet-GAN
L15129: (Zhang et al., 2017b). Odena (2019) lists open problems concerning GANs.
L15130: Data:
L15131: GANs have primarily been developed for image data. Examples include the deep con-
L15132: volutional GAN (Radford et al., 2015), progressive GAN (Karras et al., 2018), and StyleGAN
L15133: (Karras et al., 2019) models presented in this chapter. For this reason, most GANs are based on
L15134: convolutional layers, although more recently, GANs that exploit transformers in the generator
L15135: and discriminator to capture long-range correlations have been developed (e.g., SAGAN, Zhang
L15136: et al., 2019b). However, GANs have also been used to generate molecular graphs (De Cao &
L15137: Kipf, 2018), voice data (Saito et al., 2017; Donahue et al., 2018b; Kaneko & Kameoka, 2017;
L15138: Fang et al., 2018), EEG data (Hartmann et al., 2018), text (Lin et al., 2017a; Fedus et al.,
L15139: 2018), music (Mogren, 2016; Guimaraes et al., 2017; Yu et al., 2017), 3D models (Wu et al.,
L15140: 2016), DNA (Killoran et al., 2017), and video data (Vondrick et al., 2016; Wang et al., 2018a).
L15141: GAN loss functions:
L15142: It was originally claimed that GANs converged to Nash equilibria
L15143: during training. However, more recent evidence suggests that this isn’t always the case (Farnia
L15144: & Ozdaglar, 2020; Jin et al., 2020; Berard et al., 2019). (Arjovsky et al., 2017; Metz et al., 2017;
L15145: Qi, 2020) identified that the original GAN loss function was unstable, and this led to different
L15146: formulations. Mao et al. (2017) introduced the least squares GAN. For some parameter choices,
L15147: this implicitly minimizes the Pearson χ2 divergence.
L15148: Nowozin et al. (2016) argue that the
L15149: Jensen-Shannon divergence is a special case of a larger family of f-divergences and show that
L15150: any f-divergence can be used for training GANs. Jolicoeur-Martineau (2019) introduces the
L15151: relativistic GAN in which the discriminator estimates the probability that a real data example
L15152: is more realistic than a generated one rather than the absolute probability that it is real.
L15153: Zhao et al. (2017a) reformulate the GAN into a general energy-based framework in which the
L15154: discriminator is a function that attributes low energies to real data and higher energies elsewhere.
L15155: As an example, they use an autoencoder and base the energy on reconstruction error.
L15156: Arjovsky & Bottou (2017) analyzed vanishing gradients in GANs, and this led to the Wasserstein
L15157: GAN (Arjovsky et al., 2017), which is based on earth mover’s distance/optimal transport. The
L15158: Wasserstein formulation requires that the Lipschitz constant of the discriminator is less than
L15159: one; the original paper proposed to clip the weights in the discriminator, but subsequent work
L15160: imposed a gradient penalty (Gulrajani et al., 2016) or applied spectral normalization (Miyato
L15161: et al., 2018) to limit the Lipschitz constant. Other variations of the Wasserstein GAN were
L15162: introduced by Wu et al. (2018a), Bellemare et al. (2017b), and Adler & Lunz (2018). Hermann
L15163: (2017) presents an excellent blog post discussing duality and the Wasserstein GAN. For more
L15164: information about optimal transport, consult the book by Peyré et al. (2019).
L15165: Lucic et al.
L15166: (2018) present an empirical comparison of GAN loss functions of the time.
L15167: Tricks for training GANs:
L15168: Many heuristics improve the stability of training GANs and the
L15169: quality of the final results. Marchesi (2017) first used the truncation trick (figure 15.10) to trade
L15170: off the variability of GAN outputs relative to their quality. This was also proposed by Pieters
L15171: & Wiering (2018) and Brock et al. (2019), who added a regularizer that encourages the weight
L15172: matrices in the generator to be orthogonal. This means that truncating the latent variable has
L15173: a closer relationship to truncating the output variance and improves sample quality.
L15174: Other tricks include only using the gradients from the top K most realistic images (Sinha et al.,
L15175: 2020), label smoothing in the discriminator (Salimans et al., 2016), updating the discriminator
L15176: using a history of generated images rather than the ones produced by the latest generator to
L15177: avoid model “oscillation” (Salimans et al., 2016), and adding noise to the discriminator input
L15178: (Arjovsky & Bottou, 2017). Kurach et al. (2019) present an overview of normalization and
L15179: regularization in GANs. Chintala et al. (2020) provide further suggestions for training GANs.
L15180: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L15183: <!-- page 315 -->
L15184: Notes
L15185: 301
L15186: Sample diversity:
L15187: The original GAN paper (Goodfellow et al., 2014) argued that given
L15188: enough capacity, training samples, and computation time, a GAN can learn to minimize the
L15189: Jensen-Shannon divergence between the generated samples and the true distribution. However,
L15190: subsequent work has cast doubt on whether this happens in practice. Arora et al. (2017) sug-
L15191: gest that the finite capacity of the discriminator means that the GAN training objective can
L15192: approach its optimum value even when the variation in the output distribution is limited. Wu
L15193: et al. (2017) approximated the log-likelihoods of the distributions produced by GANs using an-
L15194: nealed importance sampling and found a mismatch between the generated and real distributions.
L15195: Arora & Zhang (2017) ask human observers to identify GAN samples that are (near-)duplicates
L15196: and infer the diversity of images from the frequency of these duplicates. They found that for
L15197: DCGAN, a duplicate occurs with probability >50% with 400 samples; this implies that the
L15198: support size was ∼400, 000, which is smaller than the training set. They also showed that the
L15199: diversity increased as a function of the discriminator size. Bau et al. (2019) take a different
L15200: approach and investigate the parts of the data space that GANs cannot generate.
L15201: Increasing diversity and preventing mode collapse:
L15202: The extreme case of lack of diversity
L15203: is mode collapse, in which the network repeatedly produces the same image (Salimans et al.,
L15204: 2016). This is a particular problem for conditional GANs, where the latent variable is sometimes
L15205: completely ignored, and the output depends only on the conditional information. Mao et al.
L15206: (2019) introduce a regularization term to help prevent mode collapse in conditional GANs, which
L15207: maximizes the ratio of the distance between generated images with respect to the corresponding
L15208: latent variables and hence encourages diversity in the outputs. Other work that aims to reduce
L15209: mode collapse includes VEEGAN (Srivastava et al., 2017), which introduces a reconstruction
L15210: network that maps the generated image back to the original noise and hence discourages many-
L15211: to-one mappings from noise to images.
L15212: Salimans et al. (2016) suggested computing statistics across the mini-batch and using the dis-
L15213: criminator to ensure that these are indistinguishable from the statistics of batches of real images.
L15214: This is known as mini-batch discrimination and is implemented by adding a layer toward the
L15215: end of the discriminator that learns a tensor for each image that captures the statistics of the
L15216: batch. This was simplified by Karras et al. (2018), who computed a standard deviation for each
L15217: feature in each spatial location over the mini-batch. Then they average over spatial locations
L15218: and features to get a single estimate. This is replicated to get a single feature map, which is
L15219: appended to a layer near the end of the discriminator network. Lin et al. (2018) pass concate-
L15220: nated (real or generated) samples to the discriminator and provide a theoretical analysis of how
L15221: presenting multiple samples to the discriminator increases diversity. MAD-GAN (Ghosh et al.,
L15222: 2018) increases the diversity of GAN samples by using multiple generators and requiring the
L15223: single discriminator to identify which generator created the samples, thus providing a signal to
L15224: help push the generators to create different samples from one another.
L15225: Multiple scales:
L15226: Wang et al. (2018b) used multiple discriminators at different scales to help
L15227: ensure that image quality is high in all frequency bands. Other work defined both generators
L15228: and discriminators at different resolutions (Denton et al., 2015; Zhang et al., 2017d; Huang
L15229: et al., 2017c). Karras et al. (2018) introduced the progressive growing method (figure 15.9),
L15230: which is somewhat simpler and faster to train.
L15231: StyleGAN:
L15232: Karras et al. (2019) introduced the StyleGAN framework (section 15.6). In sub-
L15233: sequent work (Karras et al., 2020b), they improved the quality of generated images by (i)
L15234: redesigning the normalization layers in the generator to remove “water droplet” artifacts and
L15235: (ii) reducing artifacts where fine details do not follow the coarse details by changing the pro-
L15236: gressive growing framework. Further improvements include developing methods to train GANs
L15237: with limited data (Karras et al., 2020a) and fixing aliasing artifacts (Karras et al., 2021). A
L15238: large body of work finds and manipulates the latent variables in the StyleGAN to edit images
L15239: (e.g., Abdal et al., 2021; Collins et al., 2020; Härkönen et al., 2020; Patashnik et al., 2021; Shen
L15240: et al., 2020b; Tewari et al., 2020; Wu et al., 2021; Roich et al., 2022).
L15241: Draft: please send errata to udlbookmail@gmail.com.
L15244: <!-- page 316 -->
L15245: 302
L15246: 15
L15247: Generative adversarial networks
L15248: Conditional GANs:
L15249: The conditional GAN was developed by Mirza & Osindero (2014), the
L15250: auxiliary classifier GAN by Odena et al. (2017), and the InfoGAN by Chen et al. (2016b). The
L15251: discriminators of these models usually append the conditional information to the discriminator
L15252: input (Mirza & Osindero, 2014; Denton et al., 2015; Saito et al., 2017) or to an intermediate
L15253: hidden layer in the discriminator (Reed et al., 2016a; Zhang et al., 2017d; Perarnau et al.,
L15254: 2016). However, Miyato & Koyama (2018) experimented with taking the inner product between
L15255: embedded conditional information with a layer of the discriminator, motivated by the role of
L15256: the class information in the underlying probabilistic model. Images generated by GANs have
L15257: variously been conditioned on classes (Odena et al., 2017), input text (Reed et al., 2016a; Zhang
L15258: et al., 2017d), attributes (Yan et al., 2016; Donahue et al., 2018a; Xiao et al., 2018b), bounding
L15259: boxes and keypoints (Reed et al., 2016b), and images (Isola et al., 2017).
L15260: Image translation:
L15261: Isola et al. (2017) developed the Pix2Pix algorithm (figure 15.16), and a
L15262: similar system with higher-resolution results was subsequently developed by Wang et al. (2018b).
L15263: StarGAN (Choi et al., 2018) performs image-to-image translation across multiple domains using
L15264: only a single model. The idea of cycle consistency loss was introduced by Zhou et al. (2016b)
L15265: in DiscoGAN and Zhu et al. (2017) in CycleGAN (figure 15.18).
L15266: Adversarial loss:
L15267: In many image translation tasks, there is no “generator”; these can be
L15268: considered supervised learning tasks with an adversarial loss that encourages realism.
L15269: The
L15270: super-resolution algorithm of Ledig et al. (2017) is a good example of this (figure 15.17). Esser
L15271: et al. (2021) used an autoencoder with an adversarial loss.
L15272: This network takes an image,
L15273: reduces the representation size to create a “bottleneck,” and then reconstructs the image from
L15274: this reduced data space. In practice, the architecture is similar to encoder-decoder networks
L15275: (e.g., figure 10.19). After training, the autoencoder reproduces something that is both close
L15276: to the image and looks highly realistic.
L15277: They vector quantize (discretize) the bottleneck of
L15278: the autoencoder and then learn a probability distribution over the discrete variables using a
L15279: transformer decoder. By sampling from this transformer decoder, they can produce extremely
L15280: large high-quality images.
L15281: Inverting GANs:
L15282: One way to edit real images is to project them to the latent space, manip-
L15283: ulate the latent variable, and then re-project them to image space. This process is known as
L15284: resynthesis. Unfortunately, GANs only map from the latent variable to the observed data, not
L15285: vice versa. This has led to methods to invert GANs (i.e., find the latent variable that corre-
L15286: sponds as closely as possible to an observed image). These methods fall into two classes. The
L15287: first learns a network that maps in the opposite direction (Donahue et al., 2018b; Luo et al.,
L15288: 2017a; Perarnau et al., 2016; Dumoulin et al., 2017; Guan et al., 2020). This is known as an
L15289: encoder. The second approach is to start with some latent variable z and optimize it until it
L15290: reconstructs the image as closely as possible (Creswell & Bharath, 2018; Karras et al., 2020b;
L15291: Abdal et al., 2019; Lipton & Tripathi, 2017). Zhu et al. (2020a) combine both approaches.
L15292: There has been particular interest in inversion for StyleGAN because it produces excellent results
L15293: and can control the image at different scales. Unfortunately, Abdal et al. (2020) showed that
L15294: it is not possible to invert StyleGAN without artifacts and proposed inverting to an extended
L15295: style space, and Richardson et al. (2021) trained an encoder that reliably maps to this space.
L15296: Even after inverting to the extended space, editing images that are out of domain may still not
L15297: work well. Roich et al. (2022) address this issue by fine-tuning the generator of StyleGAN so
L15298: that it reconstructs the image exactly and show that the result can be edited well. They also
L15299: add extra terms that reconstruct nearby points exactly so that the modification is local. This
L15300: technique is known as pivotal tuning. A survey of GAN inversion techniques can be found in
L15301: Xia et al. (2022).
L15302: Editing images with GANs:
L15303: The iGAN (Zhu et al., 2016) allows users to make interactive
L15304: edits by scribbling or warping parts of an existing image. The tool then adjusts the output
L15305: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L15308: <!-- page 317 -->
L15309: Notes
L15310: 303
L15311: image to be both realistic and to fit these new constraints. It does this by finding a latent
L15312: vector that produces an image that is similar to the edited image and obeys the edge map
L15313: of any added lines. It is typical also to add a mask so that only parts of the image close to
L15314: the edits are changed. EditGAN (Ling et al., 2021) jointly models images and their semantic
L15315: segmentation masks and allows edits to that mask.
L15316: Problems
L15317: Problem 15.1 What will the loss be in equation 15.9 when Pr(x∗) = Pr(x)?
L15318: Problem 15.2∗Write an equation relating the loss L in equation 15.8 to the Jensen-Shannon
L15319: distance DJS [Pr(x)∗|| Pr(x)] in equation 15.9.
L15320: Problem 15.3 Consider computing the earth mover’s distance using linear programming in the
L15321: primal form. The discrete distributions Pr(x=i) and q(x=j) are defined on x = 1, 2, 3, 4 and:
L15322: b =
L15323: 
L15324: Pr(x=1), Pr(x=2), Pr(x=3), Pr(x=4), q(x=1), q(x=2), q(x=3), q(x=4)
L15325: T .
L15326: (15.18)
L15327: Write out the contents of the 8×16 matrix A. You may assume that the contents of P have
L15328: been vectorized into p column-first.
L15329: Problem 15.4∗Calculate (i) the KL divergence, (ii) the reverse KL divergence,(iii) the Jensen-
L15330: Shannon divergence, and (iv) the Wasserstein distance between the distributions:
L15331: Pr(z) =
L15332: 
L15333: 
L15334: 
L15335: 
L15336: 
L15337: 0
L15338: z < 0
L15339: 1
L15340: 0 ≤z ≤1
L15341: 0
L15342: z > 1
L15343: ,
L15344: and
L15345: Pr(z) =
L15346: 
L15347: 
L15348: 
L15349: 
L15350: 
L15351: 0
L15352: z < a
L15353: 1
L15354: a ≤z ≤a + 1
L15355: 0
L15356: z > a
L15357: .
L15358: (15.19)
L15359: for the range a ∈[−3, 3]. To get a formula for the Wasserstein distance for this special case,
L15360: consider the total “earth” (i.e., probability mass) that must be moved and multiply this by the
L15361: distance it must move.
L15362: Problem 15.5 The KL distance and Wasserstein distances between univariate Gaussian distri-
L15363: butions are given by:
L15364: Dkl = log
L15365: σ2
L15366: σ1
L15367: 
L15368: + σ2
L15369: 1 + (µ1 −µ2)2
L15370: 2σ2
L15371: 2
L15372: −1
L15373: 2,
L15374: (15.20)
L15375: and
L15376: Dw = (µ1 −µ2)2 + σ1 + σ2 −2√σ1σ2,
L15377: (15.21)
L15378: respectively. Plot these distances as a function of µ1 −µ2 for the case when σ1 = σ2 = 1.
L15379: Problem 15.6 Consider a latent variable z ∼Norm[0, I] with dimension 100. Consider truncat-
L15380: ing the values of this variable to (i) τ = 2.0, (ii) τ = 1.0, (iii) τ = 0.5, (iv) τ = 0.04 standard
L15381: deviations. What proportion of the original probability distribution is disregarded in each case?
L15382: Draft: please send errata to udlbookmail@gmail.com.
L15385: <!-- page 318 -->
L15386: Chapter 16
L15387: Normalizing flows
L15388: Chapter 15 introduced generative adversarial networks (GANs). These are generative
L15389: models that pass a latent variable through a deep network to create a new sample. GANs
L15390: are trained using the principle that the samples should be indistinguishable from real
L15391: data. However, they don’t define a distribution over data examples. Hence, assessing
L15392: the probability that a new example belongs to the same dataset isn’t straightforward.
L15393: In this chapter, we describe normalizing flows. These learn a probability model by
L15394: transforming a simple distribution into a more complicated one using a deep network.
L15395: Normalizing flows can both sample from this distribution and evaluate the probability
L15396: of new examples. However, they require specialized architecture: each layer must be
L15397: invertible. In other words, it must be able to transform data in both directions.
L15398: 16.1
L15399: 1D example
L15400: Normalizing flows are probabilistic generative models: they fit a probability distribution
L15401: to training data (figure 14.2b). Consider modeling a 1D distribution Pr(x). Normalizing
L15402: flows start with a simple tractable base distribution Pr(z) over a latent variable z and
L15403: apply a function x = f[z, ϕ], where the parameters ϕ are chosen so that Pr(x) has the
L15404: desired distribution (figure 16.1). Generating a new example x∗is easy; we draw z∗from
L15405: the base density and pass this through the function so that x∗= f[z∗, ϕ].
L15406: 16.1.1
L15407: Measuring probability
L15408: Measuring the probability of a data point x is more challenging. Consider applying a
L15409: function f[z, ϕ] to random variable z with known density Pr(z). The probability density
L15410: will decrease in areas that are stretched by the function and increase in areas that are
L15411: compressed so that the area under the new distribution remains one. The degree to
L15412: which a function f[z, ϕ] stretches or compresses its input depends on the magnitude of
L15413: its gradient. If a small change to the input causes a larger change in the output, it
L15414: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L15417: <!-- page 319 -->
L15418: 16.1
L15419: 1D example
L15420: 305
L15421: Figure 16.1 Transforming probability distributions.
L15422: a) The base density is a
L15423: standard normal defined on a latent variable z. b) This variable is transformed
L15424: by a function x = f[z, ϕ] to a new variable x, which c) has a new distribution. To
L15425: sample from this model, we draw values z from the base density (green and brown
L15426: arrows in panel (a) show two examples). We pass these through the function f[z, ϕ]
L15427: as shown by dotted arrows in panel (b) to generate the values of x, which are
L15428: indicated as arrows in panel (c).
L15429: Figure 16.2 Transforming distributions. The base density (cyan, bottom) passes
L15430: through a function (blue curve, top right) to create the model density (orange,
L15431: left). Consider dividing the base density into equal intervals (gray vertical lines).
L15432: The probability mass between adjacent lines must remain the same after transfor-
L15433: mation. The cyan-shaded region passes through a part of the function where the
L15434: gradient is larger than one, so this region is stretched. Consequently, the height
L15435: of the orange-shaded region must be lower so that it retains the same area as the
L15436: cyan-shaded region. In other places (e.g., z = −2), the gradient is less than one,
L15437: and the model density increases relative to the base density.
L15438: Draft: please send errata to udlbookmail@gmail.com.
