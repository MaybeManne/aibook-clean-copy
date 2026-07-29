L17836: <!-- page 359 -->
L17837: Notes
L17838: 345
L17839: 2018; Sultan et al., 2018), graphs (Kipf & Welling, 2016; Simonovsky & Komodakis, 2018),
L17840: robotics (Hernández et al., 2018; Inoue et al., 2018; Park et al., 2018), reinforcement learning
L17841: (Heess et al., 2015; Van Hoof et al., 2016), 3D scenes (Eslami et al., 2016, 2018; Rezende Jimenez
L17842: et al., 2016), and handwriting (Chung et al., 2015).
L17843: Applications include resynthesis and interpolation (White, 2016; Bowman et al., 2015), collab-
L17844: orative filtering (Liang et al., 2018), and compression (Gregor et al., 2016). Gómez-Bombarelli
L17845: et al. (2018) use the VAE to construct a continuous representation of chemical structures that
L17846: can then be optimized for desirable properties. Ravanbakhsh et al. (2017) simulate astronomical
L17847: observations for calibrating measurements.
L17848: Relation to other models:
L17849: The autoencoder (Rumelhart et al., 1985; Hinton & Salakhutdi-
L17850: nov, 2006) passes data through an encoder to a bottleneck layer and then reconstructs it using
L17851: a decoder. The bottleneck is similar to latent variables in the VAE, but the motivation differs.
L17852: Here, the goal is not to learn a probability distribution but to create a low-dimensional repre-
L17853: sentation that captures the essence of the data. Autoencoders also have various applications,
L17854: including denoising (Vincent et al., 2008) and anomaly detection (Zong et al., 2018).
L17855: If the encoder and decoder are linear transformations, the autoencoder is just principal compo-
L17856: nent analysis (PCA). Hence, the nonlinear autoencoder is a generalization of PCA. There are
L17857: also probabilistic forms of PCA. Probabilistic PCA (Tipping & Bishop, 1999) adds spherical
L17858: Gaussian noise to the reconstruction to create a probability model, and factor analysis adds
L17859: diagonal Gaussian noise (see Rubin & Thayer, 1982). If we make the encoder and decoder of
L17860: these probabilistic variants nonlinear, we return to the variational autoencoder.
L17861: Architectural variations:
L17862: The conditional VAE (Sohn et al., 2015) passes class information c
L17863: into both the encoder and decoder. The result is that the latent space does not need to encode
L17864: the class information. For example, when MNIST data are conditioned on the digit label, the
L17865: latent variables might encode the orientation and width of the digit rather than the digit category
L17866: itself. Sønderby et al. (2016a) introduced ladder variational autoencoders, which recursively
L17867: correct the generative distribution with a data-dependent approximate likelihood term.
L17868: Modifying likelihood:
L17869: Other work investigates more sophisticated likelihood models Pr(x|z).
L17870: The PixelVAE (Gulrajani et al., 2016) used an autoregressive model over the output variables.
L17871: Dorta et al. (2018) modeled the covariance of the decoder output as well as the mean. Lamb
L17872: et al. (2016) improved the quality of reconstruction by adding extra regularization terms that
L17873: encourage the reconstruction to be similar to the original image in the space of activations
L17874: of a layer of an image classification model. This model encourages semantic information to
L17875: be retained and was used to generate the results in figure 17.13. Larsen et al. (2016) use an
L17876: adversarial loss for reconstruction, which also improves results.
L17877: Latent space, prior, and posterior:
L17878: Many different forms for the variational approximation
L17879: to the posterior have been investigated, including normalizing flows (Rezende & Mohamed,
L17880: 2015; Kingma et al., 2016), directed graphical models (Maaløe et al., 2016), undirected models
L17881: (Vahdat et al., 2020), and recursive models for temporal data (Gregor et al., 2016, 2019).
L17882: Other authors have investigated using a discrete latent space (Van Den Oord et al., 2017; Razavi
L17883: et al., 2019b; Rolfe, 2017; Vahdat et al., 2018a,b). For example, Razavi et al. (2019b) use a
L17884: vector quantized latent space and model the prior with an autoregressive model (equation 12.15).
L17885: This is slow to sample from but can describe very complex distributions.
L17886: Draft: please send errata to udlbookmail@gmail.com.
L17889: <!-- page 360 -->
L17890: 346
L17891: 17
L17892: Variational autoencoders
L17893: Jiang et al. (2016) use a mixture of Gaussians for the posterior, allowing clustering. This is a
L17894: hierarchical latent variable model that adds a discrete latent variable to improve the flexibility
L17895: of the posterior. Other authors (Salimans et al., 2015; Ranganath et al., 2016; Maaløe et al.,
L17896: 2016; Vahdat & Kautz, 2020) have experimented with hierarchical models that use continuous
L17897: variables. These have a close connection with diffusion models (chapter 18).
L17898: Combination with other models:
L17899: Gulrajani et al. (2016) combined VAEs with an autore-
L17900: gressive model to produce more realistic images. Chung et al. (2015) combine the VAE with
L17901: recurrent neural networks to model time-varying measurements.
L17902: As discussed above, adversarial losses have been used to inform the likelihood term directly.
L17903: However, other models have combined ideas from generative adversarial networks (GANs) with
L17904: VAEs in different ways.
L17905: Makhzani et al. (2015) use an adversarial loss in the latent space;
L17906: the idea is that the discriminator will ensure that the aggregated posterior distribution q(z)
L17907: is indistinguishable from the prior distribution Pr(z). Tolstikhin et al. (2018) generalize this
L17908: to a broader family of distances between the prior and aggregated posterior. Dumoulin et al.
L17909: (2017) introduced adversarially learned inference which uses an adversarial loss to distinguish
L17910: two pairs of latent/observed data points. In one case, the latent variable is drawn from the
L17911: latent posterior distribution and, in the other, from the prior.
L17912: Other hybrids of VAEs and
L17913: GANs were proposed by Larsen et al. (2016), Brock et al. (2016), and Hsu et al. (2017a).
L17914: Posterior collapse:
L17915: One potential problem in training is posterior collapse, in which the
L17916: encoder always predicts the prior distribution. This was identified by Bowman et al. (2015) and
L17917: can be mitigated by gradually increasing the term that encourages the KL distance between the
L17918: posterior and the prior to be small during training. Several other methods have been proposed
L17919: to prevent posterior collapse (Razavi et al., 2019a; Lucas et al., 2019b,a), and this is also part
L17920: of the motivation for using a discrete latent space (Van Den Oord et al., 2017).
L17921: Blurry reconstructions:
L17922: Zhao et al. (2017c) provide evidence that the blurry reconstructions
L17923: are partly due to Gaussian noise and also because of the sub-optimal posterior distributions
L17924: induced by the variational approximation.
L17925: It is perhaps not coincidental that some of the
L17926: best synthesis results have come from using a discrete latent space modeled by a sophisticated
L17927: autoregressive model (Razavi et al., 2019b) or from using hierarchical latent spaces (Vahdat &
L17928: Kautz, 2020; see figure 17.12d). Figure 17.12a-c used a VAE that was trained on the CELEBA
L17929: database (Liu et al., 2015). Figure 17.12d uses a hierarchical VAE that was trained on the
L17930: CELEBA HQ dataset (Karras et al., 2018).
L17931: Other problems:
L17932: Chen et al. (2017) noted that when more complex likelihood terms are used,
L17933: such as the PixelCNN (Van den Oord et al., 2016c), the output can cease to depend on the
L17934: latent variables at all. They term this the information preference problem. This was addressed
L17935: by Zhao et al. (2017b) in the InfoVAE, which added an extra term that maximized the mutual
L17936: information between the latent and observed distributions.
L17937: Another problem with the VAE is that there can be “holes” in the latent space that do not
L17938: correspond to any realistic sample. Xu et al. (2020) introduce the constrained posterior VAE,
L17939: which helps prevent these vacant regions in latent space by adding a regularization term. This
L17940: allows for better interpolation from real samples.
L17941: Disentangling latent representation:
L17942: Methods to “disentangle” the latent representation
L17943: include the beta VAE (Higgins et al., 2017) and others (e.g., Kim & Mnih, 2018; Kumar et al.,
L17944: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L17947: <!-- page 361 -->
L17948: Notes
L17949: 347
L17950: Figure 17.15 Expectation maximization
L17951: (EM) algorithm. The EM algorithm al-
L17952: ternately adjusts the auxiliary parame-
L17953: ters θ (moves between colored curves)
L17954: and model parameters ϕ (moves along
L17955: colored curves) until the a maximum
L17956: is
L17957: reached.
L17958: These
L17959: adjustments
L17960: are
L17961: known as the E-step and the M-step,
L17962: respectively.
L17963: Because the E-Step uses
L17964: the
L17965: posterior
L17966: distribution
L17967: Pr(h|x, ϕ)
L17968: for q(h|x, θ), the bound is tight, and
L17969: the colored curve touches the black like-
L17970: lihood curve after each E-Step.
L17971: 2018).
L17972: Chen et al. (2018d) further decomposed the ELBO to show the existence of a term
L17973: measuring the total correlation between the latent variables (i.e., the distance between the
L17974: aggregate posterior and the product of its marginals).
L17975: They use this to motivate the total
L17976: correlation VAE, which attempts to minimize this quantity.
L17977: The Factor VAE (Kim & Mnih,
L17978: 2018) uses a different approach to minimize the total correlation. Mathieu et al. (2019) discuss
L17979: the factors that are important in disentangling representations.
L17980: Reparameterization trick:
L17981: Consider computing an expectation of some function, where the
L17982: probability distribution with which the expectation is taken depends on some parameters. The
L17983: reparameterization trick computes the derivative of this expectation with respect to these pa-
L17984: rameters.
L17985: This chapter introduced this as a method to differentiate through the sampling
L17986: procedure approximating the expectation; there are alternative approaches (see problem 17.5),
L17987: but the reparameterization trick gives an estimator that (usually) has low variance. This issue
L17988: is discussed in Rezende et al. (2014), Kingma et al. (2015), and Roeder et al. (2017).
L17989: Lower bound and the EM algorithm:
L17990: VAE training is based on optimizing the evidence
L17991: lower bound (sometimes also referred to as the ELBO, variational lower bound, or negative
L17992: variational free energy). Hoffman & Johnson (2016) and Lücke et al. (2020) re-express this
L17993: lower bound in several ways that elucidate its properties.
L17994: Other work has aimed to make
L17995: this bound tighter (Burda et al., 2016; Li & Turner, 2016; Bornschein et al., 2016; Masrani
L17996: et al., 2019). For example, Burda et al. (2016) use a modified bound based on using multiple
L17997: importance-weighted samples from the approximate posterior to form the objective function.
L17998: The ELBO is tight when the distribution q(z|θ) matches the posterior Pr(z|x, ϕ).
L17999: This is
L18000: the basis of the expectation maximization (EM) algorithm (Dempster et al., 1977). Here, we
L18001: alternately (i) choose θ so that q(z|θ) equals the posterior Pr(z|x, ϕ) and (ii) change ϕ to
L18002: Problem 17.7
L18003: maximize the lower bound (figure 17.15). This is viable for models like the mixture of Gaussians,
L18004: where we can compute the posterior distribution in closed form. Unfortunately, this is not the
L18005: case for the nonlinear latent variable model, so this method cannot be used.
L18006: Problems
L18007: Problem 17.1 How many parameters are needed to create a 1D mixture of Gaussians with n = 5
L18008: Draft: please send errata to udlbookmail@gmail.com.
L18011: <!-- page 362 -->
L18012: 348
L18013: 17
L18014: Variational autoencoders
L18015: components (equation 17.4)? State the possible range of values that each parameter could take.
L18016: Problem 17.2 A function is concave if its second derivative is less than or equal to zero every-
L18017: where. Show that this is true for the function g[x] = log[x].
L18018: Problem 17.3 For convex functions, Jensen’s inequality works the other way around.
L18019: g
L18020: 
L18021: E[y]
L18022: 
L18023: ≤E
L18024: 
L18025: g[y]
L18026: 
L18027: .
L18028: (17.31)
L18029: A function is convex if its second derivative is greater than or equal to zero everywhere. Show
L18030: that the function g[x] = x2n is convex for arbitrary n ∈[1, 2, 3, . . .]. Use this result with Jensen’s
L18031: inequality to show that the square of the mean E[x] of a distribution Pr(x) must be less than
L18032: or equal to its second moment E[x2].
L18033: Problem 17.4∗Show that the ELBO, as expressed in equation 17.18, can alternatively be de-
L18034: rived from the KL divergence between the variational distribution q(z|x) and the true posterior
L18035: distribution Pr(z|x, ϕ):
L18036: DKL
L18037: h
L18038: q(z|x)
L18046: Pr(z|x, ϕ)
L18047: i
L18048: =
L18049: Z
L18050: q(z|x) log
L18051: 
L18052: q(z|x)
L18053: Pr(z|x, ϕ)
L18054: 
L18055: dz.
L18056: (17.32)
L18057: Start by using Bayes’ rule (equation 17.19).
L18058: Problem 17.5 The reparameterization trick computes the derivative of an expectation of a
L18059: function f[x]:
L18060: ∂
L18061: ∂ϕEP r(x|ϕ)
L18062: 
L18063: f[x]
L18064: 
L18065: ,
L18066: (17.33)
L18067: with respect to the parameters ϕ of the distribution Pr(x|ϕ) that the expectation is over. Show
L18068: that this derivative can also be computed as:
L18069: ∂
L18070: ∂ϕEP r(x|ϕ)
L18071: 
L18072: f[x]
L18073: 
L18074: =
L18075: EP r(x|ϕ)
L18076: 
L18077: f[x] ∂
L18078: ∂ϕ log
L18079: 
L18080: Pr(x|ϕ)
L18081: 
L18082: ≈
L18083: 1
L18084: I
L18085: I
L18086: X
L18087: i=1
L18088: f[xi] ∂
L18089: ∂ϕ log
L18090: 
L18091: Pr(xi|ϕ)
L18092: 
L18093: .
L18094: (17.34)
L18095: This method is known as the REINFORCE algorithm or score function estimator.
L18096: Problem 17.6 Why is it better to use spherical linear interpolation rather than regular linear
L18097: interpolation when moving between points in the latent space? Hint: consider figure 8.13.
L18098: Problem 17.7∗Derive the EM algorithm for fitting the 1D mixture of Gaussians model with N
L18099: components. To do this, you need to (i) find an expression for the posterior distribution Pr(z|x)
L18100: over the latent variable z ∈{1, 2, . . . , N} for a data point x and (ii) find an expression that
L18101: updates the evidence lower bound given the posterior distributions for all of the data points.
L18102: You will need to use Lagrange multipliers to ensure that the weights λ1, . . . , λN of the Gaussians
L18103: sum to one.
L18104: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L18107: <!-- page 363 -->
L18108: Chapter 18
L18109: Diffusion models
L18110: Chapter 15 described generative adversarial models, which produce plausible-looking
L18111: samples but do not define a probability distribution over the data. Chapter 16 discussed
L18112: normalizing flows. These do define such a probability distribution but must place archi-
L18113: tectural constraints on the network; each layer must be invertible, and the determinant
L18114: of its Jacobian must be easy to calculate. Chapter 17 introduced variational autoen-
L18115: coders, which also have a solid probabilistic foundation but where the computation of
L18116: the likelihood is intractable and must be approximated by a lower bound.
L18117: This chapter introduces diffusion models. Like normalizing flows, these are proba-
L18118: bilistic models that define a nonlinear mapping from latent variables to the observed data
L18119: where both quantities have the same dimension. Like variational autoencoders, they ap-
L18120: proximate the data likelihood using a lower bound based on an encoder that maps to
L18121: the latent variable. However, in diffusion models, this encoder is predetermined; the
L18122: goal is to learn a decoder that is the inverse of this process and can be used to produce
L18123: samples. Diffusion models are easy to train and can produce very high-quality samples
L18124: that exceed the realism of those produced by GANs. The reader should be familiar with
L18125: variational autoencoders (chapter 17) before reading this chapter.
L18126: 18.1
L18127: Overview
L18128: A diffusion model consists of an encoder and a decoder.
L18129: The encoder takes a data
L18130: sample x and maps it through a series of intermediate latent variables z1 . . . zT . The
L18131: decoder reverses this process; it starts with zT and maps back through zT −1, . . . , z1 until
L18132: it finally (re-)creates a data point x. In both encoder and decoder, the mappings are
L18133: stochastic rather than deterministic.
L18134: The encoder is prespecified; it gradually blends the input with samples of white noise
L18135: (figure 18.1). With enough steps, the conditional distribution q(zT |x) and marginal dis-
L18136: tribution q(zT ) of the final latent variable both become the standard normal distribution.
L18137: Since this process is prespecified, all the learned parameters are in the decoder.
L18138: In the decoder, a series of networks are trained to map backward between each
L18139: Draft: please send errata to udlbookmail@gmail.com.
L18142: <!-- page 364 -->
L18143: 350
L18144: 18
L18145: Diffusion models
L18146: Figure 18.1 Diffusion models. The encoder (forward, or diffusion process) maps
L18147: the input x through a series of latent variables z1 . . . zT . This process is pre-
L18148: specified and gradually mixes the data with noise until only noise remains. The
L18149: decoder (reverse process) is learned and passes the data back through the la-
L18150: tent variables, removing noise at each stage. After training, new examples are
L18151: generated by sampling noise vectors zT and passing them through the decoder.
L18152: adjacent pair of latent variables zt and zt−1. The loss function encourages each network
L18153: to invert the corresponding encoder step. The result is that noise is gradually removed
L18154: from the representation until a realistic-looking data example remains. To generate a
L18155: new data example x, we draw a sample from q(zT ) and pass it through the decoder.
L18156: In section 18.2, we consider the encoder in detail. Its properties are non-obvious
L18157: but are critical for the learning algorithm.
L18158: In section 18.3, we discuss the decoder.
L18159: Section 18.4 derives the training algorithm, and section 18.5 reformulates it to be more
L18160: practical.
L18161: Section 18.6 discusses implementation details, including how to make the
L18162: generation conditional on text prompts.
L18163: 18.2
L18164: Encoder (forward process)
L18165: The diffusion or forward process1 (figure 18.2) maps a data example x through a series
L18166: of intermediate variables z1, z2, . . . , zT with the same size as x according to:
L18167: z1
L18168: =
L18169: p
L18170: 1 −β1 · x +
L18171: p
L18172: β1 · ϵ1
L18173: (18.1)
L18174: zt
L18175: =
L18176: p
L18177: 1 −βt · zt−1 +
L18178: p
L18179: βt · ϵt
L18180: ∀t ∈2, . . . , T,
L18181: where ϵt is noise drawn from a standard normal distribution. The first term attenuates
L18182: the data plus any noise added so far, and the second adds more noise. The hyperparam-
L18183: eters βt ∈[0, 1] determine how quickly the noise is blended and are collectively known
L18184: as the noise schedule. The forward process can equivalently be written as:
L18185: 1Note, this is the opposite nomenclature to normalizing flows, where the inverse mapping moves
L18186: from the data to the latent variable, and the forward mapping moves back again.
L18187: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L18190: <!-- page 365 -->
L18191: 18.2
L18192: Encoder (forward process)
L18193: 351
L18194: Figure 18.2 Forward process. a) We consider one-dimensional data x with T =
L18195: 100 latent variables z1, . . . , z100 and β = 0.03 at all steps.
L18196: Three values of x
L18197: (gray, cyan, and orange) are initialized (top row).
L18198: These are propagated
L18199: through z1, . . . , z100.
L18200: At each step, the variable is updated by attenuating its
L18201: value by √1 −β and adding noise with mean zero and variance β (equation 18.1).
L18202: Accordingly, the three examples noisily propagate through the variables with
L18203: a tendency to move toward zero.
L18204: b) The conditional probabilities Pr(z1|x)
L18205: and Pr(zt|zt−1) are normal distributions with a mean that is slightly closer to
L18206: zero than the current point and a fixed variance βt (equation 18.2).
L18207: q(z1|x)
L18208: =
L18209: Normz1
L18210: hp
L18211: 1 −β1x, β1I
L18212: i
L18213: (18.2)
L18214: q(zt|zt−1)
L18215: =
L18216: Normzt
L18217: hp
L18218: 1 −βtzt−1, βtI
L18219: i
L18220: ∀t ∈{2, . . . , T}.
L18221: This is a Markov chain because the probability of zt is determined entirely by the value of
L18222: the immediately preceding variable zt−1. With suﬀicient steps T, all traces of the original
L18223: data are removed, and q(zT |x) = q(zT ) becomes a standard normal distribution.2
L18224: Problem 18.1
L18225: The joint distribution of all of the latent variables z1, z2, . . . , zT given input x is:
L18226: q(z1...T |x) = q(z1|x)
L18227: T
L18228: Y
L18229: t=2
L18230: q(zt|zt−1).
L18231: (18.3)
L18232: 2We use q(zt|zt−1) rather than Pr(zt|zt−1) to match the notation in the description of the VAE
L18233: encoder in the previous chapter.
L18234: Draft: please send errata to udlbookmail@gmail.com.
L18237: <!-- page 366 -->
L18238: 352
L18239: 18
L18240: Diffusion models
L18241: Figure 18.3 Diffusion kernel. a) The point x∗= 2.0 is propagated through the
L18242: latent variables using equation 18.1 (five paths shown in gray).
L18243: The diffusion
L18244: kernel q(zt|x∗) is the probability distribution over variable zt given that we started
L18245: from x∗. It can be computed in closed-form and is a normal distribution whose
L18246: mean moves toward zero and whose variance increases as t increases. Heatmap
L18247: shows q(zt|x∗) for each variable. Cyan lines show ±2 standard deviations from
L18248: the mean. b) The diffusion kernel q(zt|x∗) is shown explicitly for t = 20, 40, 80. In
L18249: practice, the diffusion kernel allows us to sample a latent variable zt corresponding
L18250: to a given x∗without computing the intermediate variables z1, . . . , zt−1. When t
L18251: becomes very large, the diffusion kernel becomes a standard normal.
L18252: Figure 18.4 Marginal distributions. a) Given an initial density Pr(x) (top row),
L18253: the diffusion process gradually blurs the distribution as it passes through the
L18254: latent variables zt and moves it toward a standard normal distribution. Each
L18255: subsequent horizontal line of heatmap represents a marginal distribution q(zt).
L18256: b) The top graph shows the initial distribution Pr(x). The other two graphs
L18257: show the marginal distributions q(z20) and q(z60), respectively.
L18258: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L18261: <!-- page 367 -->
L18262: 18.2
L18263: Encoder (forward process)
L18264: 353
L18265: 18.2.1
L18266: Diffusion kernel q(zt|x)
L18267: To train the decoder to invert this process, we use multiple samples zt at time t for the
L18268: same example x. However, generating these sequentially using equation 18.1 is time-
L18269: consuming when t is large. Fortunately, there is a closed-form expression for q(zt|x),
L18270: which allows us to directly draw samples zt given initial data point x without computing
L18271: the intermediate variables z1 . . . zt−1. This is known as the diffusion kernel (figure 18.3).
L18272: To derive an expression for q(zt|x), consider the first two steps of the forward process:
L18273: z1
L18274: =
L18275: p
L18276: 1 −β1 · x +
L18277: p
L18278: β1 · ϵ1
L18279: z2
L18280: =
L18281: p
L18282: 1 −β2 · z1 +
L18283: p
L18284: β2 · ϵ2.
L18285: (18.4)
L18286: Substituting the first equation into the second, we get:
L18287: z2
L18288: =
L18289: p
L18290: 1 −β2
L18291: p
L18292: 1 −β1 · x +
L18293: p
L18294: β1 · ϵ1
L18295: 
L18296: +
L18297: p
L18298: β2 · ϵ2
L18299: (18.5)
L18300: =
L18301: p
L18302: 1 −β2
L18303: p
L18304: 1 −β1 · x +
L18305: p
L18306: 1 −(1 −β1) · ϵ1
L18307: 
L18308: +
L18309: p
L18310: β2 · ϵ2
L18311: =
L18312: p
L18313: (1 −β2)(1 −β1) · x +
L18314: p
L18315: 1 −β2 −(1 −β2)(1 −β1) · ϵ1 +
L18316: p
L18317: β2 · ϵ2.
L18318: The last two terms are independent samples from mean-zero normal distributions with
L18319: variances 1 −β2 −(1 −β2)(1 −β1) and β2, respectively. The mean of this sum is zero,
L18320: Problem 18.2
L18321: and its variance is the sum of the component variances (see problem 18.2), so:
L18322: z2
L18323: =
L18324: p
L18325: (1 −β2)(1 −β1) · x +
L18326: p
L18327: 1 −(1 −β2)(1 −β1) · ϵ,
L18328: (18.6)
L18329: where ϵ is also a sample from a standard normal distribution.
L18330: If we continue this process by substituting this equation into the expression for z3
L18331: and so on, we can show that:
L18332: Problem 18.3
L18333: zt = √αt · x +
L18334: √
L18335: 1 −αt · ϵ,
L18336: (18.7)
L18337: where αt = Qt
L18338: s=1 1 −βs. We can equivalently write this in probabilistic form:
L18339: q(zt|x) = Normzt
L18340: h√αt · x, (1 −αt)I
L18341: i
L18342: .
L18343: (18.8)
L18344: For any starting data point x, variable zt is normally distributed with a known mean
L18345: and variance. Consequently, if we don’t care about the history of the evolution through
L18346: the intermediate variables z1 . . . zt−1, it is easy to generate samples from q(zt|x).
L18347: 18.2.2
L18348: Marginal distributions q(zt)
L18349: The marginal distribution q(zt) is the probability of observing a value of zt given the
L18350: distribution of possible starting points x and the possible diffusion paths for each starting
L18351: Draft: please send errata to udlbookmail@gmail.com.
L18354: <!-- page 368 -->
L18355: 354
L18356: 18
L18357: Diffusion models
L18358: point (figure 18.4). It can be computed by considering the joint distribution q(x, z1...t)
L18359: Appendix C.1.2
L18360: Marginalization
L18361: and marginalizing over all the variables except zt:
L18362: q(zt)
L18363: =
L18364: Z Z
L18365: q(z1...t, x)dz1...t−1dx
L18366: =
L18367: Z Z
L18368: q(z1...t|x)Pr(x)dz1...t−1dx,
L18369: (18.9)
L18370: where q(z1...t|x) was defined in equation 18.3.
L18371: However, since we now have an expression for the diffusion kernel q(zt|x) that “skips”
L18372: the intervening variables, we can equivalently write:
L18373: q(zt) =
L18374: Z
L18375: q(zt|x)Pr(x)dx.
L18376: (18.10)
L18377: Hence, if we repeatedly sample from the data distribution Pr(x) and superimpose the
L18378: diffusion kernel q(zt|x) on each sample, the result is the marginal distribution q(zt) (fig-
L18379: Notebook 18.1
L18380: Diffusion encoder
L18381: ure 18.4). However, the marginal distribution cannot be written in closed form because
L18382: we don’t know the original data distribution Pr(x).
L18383: 18.2.3
L18384: Conditional distribution q(zt−1|zt)
L18385: We defined the conditional probability q(zt|zt−1) as the mixing process (equation 18.2).
L18386: Appendix C.1.4
L18387: Bayes’ rule
L18388: To reverse this process, we apply Bayes’ rule:
L18389: q(zt−1|zt) = q(zt|zt−1)q(zt−1)
L18390: q(zt)
L18391: .
L18392: (18.11)
L18393: This is intractable since we cannot compute the marginal distribution q(zt−1).
L18394: For this simple 1D example, it’s possible to evaluate q(zt−1|zt) numerically (fig-
L18395: ure 18.5). In general, their form is complex, but in many cases, they are well-approximated
L18396: by a normal distribution. This is important because when we build the decoder, we will
L18397: approximate the reverse process using a normal distribution.
L18398: 18.2.4
L18399: Conditional diffusion distribution q(zt−1|zt, x)
L18400: There is one final distribution related to the encoder to consider. We noted above that
L18401: we could not find the conditional distribution q(zt−1|zt) because we do not know the
L18402: marginal distribution q(zt−1). However, if we know the starting variable x, then we
L18403: do know the distribution q(zt−1|x) at the time before. This is just the diffusion kernel
L18404: (figure 18.3), and it is normally distributed.
L18405: Hence, it is possible to compute the conditional diffusion distribution q(zt−1|zt, x)
L18406: in closed form (figure 18.6). This distribution is used to train the decoder. It is the
L18407: distribution over zt−1 when we know the current latent variable zt and the training
L18408: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L18411: <!-- page 369 -->
L18412: 18.2
L18413: Encoder (forward process)
L18414: 355
L18415: Figure 18.5 Conditional distribution q(zt−1|zt). a) The marginal densities q(zt)
L18416: with three points z∗
L18417: t highlighted. b) The probability q(zt−1|z∗
L18418: t ) (cyan curves) is
L18419: computed via Bayes’ rule and is proportional to q(z∗
L18420: t |zt−1)q(zt−1). In general, it
L18421: is not normally distributed (top graph), although often the normal is a good ap-
L18422: proximation (bottom two graphs). The first likelihood term q(z∗
L18423: t |zt−1) is normal
L18424: in zt−1 (equation 18.2) with a mean that is slightly further from zero than z∗
L18425: t
L18426: (brown curves). The second term is the marginal density q(zt−1) (gray curves).
L18427: Figure 18.6 Conditional distribution q(zt−1|zt, x). a) Diffusion kernel for x∗=
L18428: −2.1 with three points z∗
L18429: t highlighted. b) The probability q(zt−1|z∗
L18430: t , x∗) is com-
L18431: puted via Bayes’ rule and is proportional to q(z∗
L18432: t |zt−1)q(zt−1|x∗). This is nor-
L18433: mally distributed and can be computed in closed form.
L18434: The first likelihood
L18435: term q(z∗
L18436: t |zt−1) is normal in zt (equation 18.2) with a mean that is slightly
L18437: further from zero than z∗
L18438: t (brown curves).
L18439: The second term is the diffusion
L18440: kernel q(zt−1|x∗) (gray curves).
L18441: Draft: please send errata to udlbookmail@gmail.com.
L18444: <!-- page 370 -->
L18445: 356
L18446: 18
L18447: Diffusion models
L18448: data example x (which, of course, we do when training). To compute an expression
L18449: for q(zt−1|zt, x) we start with Bayes’ rule:
L18450: q(zt−1|zt, x)
L18451: =
L18452: q(zt|zt−1, x)q(zt−1|x)
L18453: q(zt|x)
L18454: (18.12)
L18455: ∝
L18456: q(zt|zt−1)q(zt−1|x)
L18457: =
L18458: Normzt
L18459: hp
L18460: 1 −βt · zt−1, βtI
L18461: i
L18462: Normzt−1
L18463: h√αt−1 · x, (1 −αt−1)I
L18464: i
L18465: ∝
L18466: Normzt−1
L18467: 
L18468: 1
L18469: √1 −βt
L18470: zt,
L18471: βt
L18472: 1 −βt
L18473: I
L18474: 
L18475: Normzt−1
L18476: h√αt−1 · x, (1 −αt−1)I
L18477: i
L18478: where between the first two lines, we have used the fact that q(zt|zt−1, x) = q(zt|zt−1)
L18479: because the diffusion process is Markov, and all information about zt is captured by zt−1.
L18480: Between lines three and four, we use the Gaussian change of variables identity:
L18481: Appendix C.3.4
L18482: Gaussian change
L18483: of variables
L18484: Normv [Aw, B] ∝Normw
L18485: h AT B−1A
L18486: −1AT B−1v,
L18487:  AT B−1A
L18488: −1i
L18489: ,
L18490: (18.13)
L18491: to rewrite the first distribution in terms of zt−1. We then use a second Gaussian identity:
L18492: Problems 18.4–18.5
L18493: Normw[a, A] · Normw[b, B]
L18494: ∝
L18495: (18.14)
L18496: Normw
L18497: h A−1 + B−1−1(A−1a + B−1b),
L18498:  A−1 + B−1−1i
L18499: ,
L18500: to combine the two normal distributions in zt−1, which gives:
L18501: Problem 18.6
L18502: q(zt−1|zt, x) = Normzt−1
L18503: (1 −αt−1)
L18504: 1 −αt
L18505: p
L18506: 1 −βtzt +
L18507: √αt−1βt
L18508: 1 −αt
L18509: x, βt(1 −αt−1)
L18510: 1 −αt
L18511: I
L18512: 
L18513: .(18.15)
L18514: Note that the constants of proportionality in equations 18.12, 18.13, and 18.14 must
L18515: cancel out since the final result is already a correctly normalized probability distribution.
L18516: 18.3
L18517: Decoder model (reverse process)
L18518: When we learn a diffusion model, we learn the reverse process. In other words, we learn a
L18519: series of probabilistic mappings back from latent variable zT to zT −1, from zT −1 to zT −2,
L18520: and so on, until we reach the data x. The true reverse distributions q(zt−1|zt) of the
L18521: diffusion process are complex multi-modal distributions (figure 18.5) that depend on the
L18522: data distribution Pr(x). We approximate these as normal distributions:
L18523: Pr(zT )
L18524: =
L18525: NormzT [0, I]
L18526: Pr(zt−1|zt, ϕt)
L18527: =
L18528: Normzt−1
L18529: h
L18530: ft[zt, ϕt], σ2
L18531: t I
L18532: i
L18533: Pr(x|z1, ϕ1)
L18534: =
L18535: Normx
L18536: h
L18537: f1[z1, ϕ1], σ2
L18538: 1I
L18539: i
L18540: ,
L18541: (18.16)
L18542: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L18545: <!-- page 371 -->
L18546: 18.4
L18547: Training
L18548: 357
L18549: where ft[zt, ϕt] is a neural network that computes the mean of the normal distribution in
L18550: the estimated mapping from zt to the preceding latent variable zt−1. The terms {σ2
L18551: t } are
L18552: predetermined. If the hyperparameters βt in the diffusion process are close to zero (and
L18553: the number of time steps T is large), then this normal approximation will be reasonable.
L18554: We generate new examples from Pr(x) using ancestral sampling.
L18555: We start by
L18556: drawing zT from Pr(zT ). Then we sample zT −1 from Pr(zT −1|zT , ϕT ), sample zT −2
L18557: from Pr(zT −2|zT −1, ϕT −1) and so on until we finally generate x from Pr(x|z1, ϕ1).
L18558: 18.4
L18559: Training
L18560: The joint distribution of the observed variable x and the latent variables {zt} is:
L18561: Pr(x, z1...T |ϕ1...T ) = Pr(x|z1, ϕ1)
L18562: T
L18563: Y
L18564: t=2
L18565: Pr(zt−1|zt, ϕt) · Pr(zT ).
L18566: (18.17)
L18567: The likelihood of the observed data Pr(x|ϕ1...T ) is found by marginalizing over the latent
L18568: Appendix C.1.2
L18569: Marginalization
L18570: variables:
L18571: Pr(x|ϕ1...T ) =
L18572: Z
L18573: Pr(x, z1...T |ϕ1...T )dz1...T .
L18574: (18.18)
L18575: To train the model, we maximize the log-likelihood of the training data {xi} with
L18576: respect to the parameters ϕ:
L18577: ˆϕ1...T = argmax
L18578: ϕ1...T
L18579: " I
L18580: X
L18581: i=1
L18582: log
L18583: h
L18584: Pr(xi|ϕ1...T )
L18585: i#
L18586: .
L18587: (18.19)
L18588: We can’t maximize this directly because the marginalization in equation 18.18 is in-
L18589: tractable. Hence, we use Jensen’s inequality to define a lower bound on the likelihood
L18590: and optimize the parameters ϕ1...T with respect to this bound exactly as we did for the
L18591: VAE (see section 17.3.1).
L18592: 18.4.1
L18593: Evidence lower bound (ELBO)
L18594: To derive the lower bound, we multiply and divide the log-likelihood by the encoder
L18595: distribution q(z1...T |x) and apply Jensen’s inequality (see section 17.3.2):
L18596: log [Pr(x|ϕ1...T )]
L18597: =
L18598: log
L18599: Z
L18600: Pr(x, z1...T |ϕ1...T )dz1...T
L18601: 
L18602: =
L18603: log
L18604: Z
L18605: q(z1...T |x)Pr(x, z1...T |ϕ1...T )
L18606: q(z1...T |x)
L18607: dz1...T
L18608: 
L18609: ≥
L18610: Z
L18611: q(z1...T |x) log
L18612: Pr(x, z1...T |ϕ1...T )
L18613: q(z1...T |x)
L18614: 
L18615: dz1...T .
L18616: (18.20)
L18617: Draft: please send errata to udlbookmail@gmail.com.
L18620: <!-- page 372 -->
L18621: 358
L18622: 18
L18623: Diffusion models
L18624: This gives us the evidence lower bound (ELBO):
L18625: ELBO
L18626: 
L18627: ϕ1...T
L18628: 
L18629: =
L18630: Z
L18631: q(z1...T |x) log
L18632: Pr(x, z1...T |ϕ1...T )
L18633: q(z1...T |x)
L18634: 
L18635: dz1...T .
L18636: (18.21)
L18637: In the VAE, the encoder q(z|x) approximates the posterior distribution over the latent
L18638: variables to make the bound tight, and the decoder maximizes this bound (figure 17.10).
L18639: In diffusion models, the decoder must do all the work since the encoder has no parameters.
L18640: It makes the bound tighter by both (i) changing its parameters so that the static encoder
L18641: does approximate the posterior Pr(z1...T |x, ϕ1...T ) and (ii) optimizing its own parameters
L18642: with respect to that bound (see figure 17.6).
L18643: 18.4.2
L18644: Simplifying the ELBO
L18645: We now manipulate the log term from the ELBO into the final form that we will op-
L18646: timize. We first substitute in the definitions for the numerator and denominator from
L18647: equations 18.17 and 18.3, respectively:
L18648: log
L18649: Pr(x, z1...T |ϕ1...T )
L18650: q(z1...T |x)
L18651: 
L18652: = log
L18653: "
L18654: Pr(x|z1, ϕ1) QT
L18655: t=2 Pr(zt−1|zt, ϕt) · Pr(zT )
L18656: q(z1|x) QT
L18657: t=2 q(zt|zt−1)
L18658: #
L18659: (18.22)
L18660: = log
L18661: Pr(x|z1, ϕ1)
L18662: q(z1|x)
L18663: 
L18664: +log
L18665: "QT
L18666: t=2 Pr(zt−1|zt, ϕt)
L18667: QT
L18668: t=2 q(zt|zt−1)
L18669: #
L18670: +log
L18671: h
L18672: Pr(zT )
L18673: i
L18674: .
L18675: Then we expand the denominator of the second term:
L18676: q(zt|zt−1) = q(zt|zt−1, x) = q(zt−1|zt, x)q(zt|x)
L18677: q(zt−1|x)
L18678: ,
L18679: (18.23)
L18680: where the first equality follows because all of the information about variable zt is en-
L18681: compassed in zt−1, so the extra conditioning on the data x is irrelevant. The second
L18682: Appendix C.1.4
L18683: Bayes’ rule
L18684: equality is a straightforward application of Bayes’ rule.
L18685: Substituting in this result gives:
L18686: log
L18687: Pr(x, z1...T |ϕ1...T )
L18688: q(z1...T |x)
L18689: 
L18690: = log
L18691: Pr(x|z1, ϕ1)
L18692: q(z1|x)
L18693: 
L18694: + log
L18695: "QT
L18696: t=2 Pr(zt−1|zt, ϕt) · q(zt−1|x)
L18697: QT
L18698: t=2 q(zt−1|zt, x) · q(zt|x)
L18699: #
L18700: + log
L18701: h
L18702: Pr(zT )
L18703: i
L18704: = log [Pr(x|z1, ϕ1)] + log
L18705: "QT
L18706: t=2 Pr(zt−1|zt, ϕt)
L18707: QT
L18708: t=2 q(zt−1|zt, x)
L18709: #
L18710: + log
L18711:  Pr(zT )
L18712: q(zT |x)
L18713: 
L18714: ≈log [Pr(x|z1, ϕ1)] +
L18715: T
L18716: X
L18717: t=2
L18718: log
L18719: Pr(zt−1|zt, ϕt)
L18720: q(zt−1|zt, x)
L18721: 
L18722: ,
L18723: (18.24)
L18724: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L18727: <!-- page 373 -->
L18728: 18.4
L18729: Training
L18730: 359
L18731: where all but two of the terms in the product of the ratios q(zt−1|x)/q(zt|x) cancel out
L18732: between lines two and three leaving only q(z1|x) and q(zT |x). The last term in the
L18733: third line is approximately log[1] = 0 since the result of the forward process q(zT |x) is a
L18734: standard normal distribution, and so is equal to the prior Pr(zT ).
L18735: The simplified ELBO is hence:
L18736: ELBO
L18737: 
L18738: ϕ1...T
L18739: 
L18740: (18.25)
L18741: =
L18742: Z
L18743: q(z1...T |x) log
L18744: Pr(x, z1...T |ϕ1...T )
L18745: q(z1...T |x)
L18746: 
L18747: dz1...T
L18748: ≈
L18749: Z
L18750: q(z1...T |x)
L18752: log [Pr(x|z1, ϕ1)] +
L18753: T
L18754: X
L18755: t=2
L18756: log
L18757: Pr(zt−1|zt, ϕt)
L18758: q(zt−1|zt, x)
L18759: !
L18760: dz1...T
L18761: = Eq(z1|x)
L18762: h
L18763: log [Pr(x|z1, ϕ1)]
L18764: i
L18765: −
L18766: T
L18767: X
L18768: t=2
L18769: Eq(zt,t−1|x)
L18770: 
L18771: DKL
L18772: h
L18773: q(zt−1|zt, x)
L18778: Pr(zt−1|zt, ϕt)
L18779: i
L18780: ,
L18781: where we have marginalized over the irrelevant variables in q(z1...T |x) between lines two
L18782: Problem 18.7
L18783: Appendix C.5.1
L18784: KL divergence
L18785: and three and used the definition of KL divergence (see problem 18.7).
L18786: 18.4.3
L18787: Analyzing the ELBO
L18788: The first probability term in the ELBO was defined in equation 18.16:
L18789: Pr(x|z1, ϕ1) = Normx
L18790: h
L18791: f1[z1, ϕ1], σ2
L18792: 1I
L18793: i
L18794: ,
L18795: (18.26)
L18796: and is equivalent to the reconstruction term in the VAE. The ELBO will be larger if
L18797: the model prediction matches the observed data. As for the VAE, we will approximate
L18798: the expectation over the log of this quantity using a Monte Carlo estimate (see equa-
L18799: tions 17.22–17.23), in which we estimate the expectation with a sample from q(z1|x).
L18800: The KL divergence terms in the ELBO measure the distance between Pr(zt−1|zt, ϕt)
L18801: and q(zt−1|zt, x), which were defined in equations 18.16 and 18.15, respectively:
L18802: Pr(zt−1|zt, ϕt)
L18803: =
L18804: Normzt−1
L18805: h
L18806: ft[zt, ϕt], σ2
L18807: t I
L18808: i
L18809: (18.27)
L18810: q(zt−1|zt, x)
L18811: =
L18812: Normzt−1
L18813: (1 −αt−1)
L18814: 1 −αt
L18815: p
L18816: 1 −βtzt +
L18817: √αt−1βt
L18818: 1 −αt
L18819: x, βt(1 −αt−1)
L18820: 1 −αt
L18821: I
L18822: 
L18823: .
L18824: The KL divergence between two normal distributions has a closed-form expression. More-
L18825: Appendix C.5.4
L18826: KL divergence
L18827: between normal
L18828: distributions
L18829: over, many of the terms in this expression do not depend on ϕ (see problem 18.8), and
L18830: Problem 18.8
L18831: the expression simplifies to the squared difference between the means plus a constant C:
L18832: DKL
L18833: h
L18834: q(zt−1|zt, x)
L18839: Pr(zt−1|zt, ϕt)
L18840: i
L18841: =
L18842: (18.28)
L18843: 1
L18844: 2σ2
L18845: t
L18850: (1 −αt−1)
L18851: 1 −αt
L18852: p
L18853: 1 −βtzt +
L18854: √αt−1βt
L18855: 1 −αt
L18856: x −ft[zt, ϕt]
L18861: 2
L18862: + C.
L18863: Draft: please send errata to udlbookmail@gmail.com.
L18866: <!-- page 374 -->
L18867: 360
L18868: 18
L18869: Diffusion models
L18870: Figure 18.7 Fitted Model.
L18871: a) Individual samples can be generated by sam-
L18872: pling from the standard normal distribution Pr(zT ) (bottom row) and then sam-
L18873: pling zT −1 from Pr(zT −1|zT ) = NormzT −1[fT [zT , ϕT ], σ2
L18874: T I] and so on until we
L18875: reach x (five paths shown). The estimated marginal densities (heatmap) are the
L18876: aggregation of these samples and are similar to the true marginal densities (fig-
L18877: ure 18.4). b) The estimated distribution Pr(zt−1|zt) (brown curve) is a reasonable
L18878: approximation to the true posterior of the diffusion model q(zt−1|zt) (cyan curve)
L18879: from figure 18.5. The marginal distributions Pr(zt) and q(zt) of the estimated
L18880: and true models (dark blue and gray curves, respectively) are also similar.
L18881: 18.4.4
L18882: Diffusion loss function
L18883: To fit the model, we maximize the ELBO with respect to the parameters ϕ1...T . We
L18884: recast this as a minimization by multiplying with minus one and approximating the
L18885: expectations with samples to give the loss function:
L18886: L[ϕ1...T ]
L18887: =
L18888: I
L18889: X
L18890: i=1
L18891: 
L18892: reconstruction term
L18893: z
L18894: }|
L18895: {
L18896: −log
L18897: h
L18898: Normxi
L18899: 
L18900: f1[zi1, ϕ1], σ2
L18901: 1I
L18902: i
L18903: (18.29)
L18904: +
L18905: T
L18906: X
L18907: t=2
L18908: 1
L18909: 2σ2
L18910: t
L18915: 1 −αt−1
L18916: 1 −αt
L18917: p
L18918: 1 −βtzit +
L18919: √αt−1βt
L18920: 1 −αt
L18921: xi
L18922: |
L18923: {z
L18924: }
L18925: target, mean of q(zt−1|zt, x)
L18926: −
L18927: ft[zit, ϕt]
L18928: |
L18929: {z
L18930: }
L18931: predicted zt−1
L18936: 2
L18937: ,
L18938: where xi is the ith data point, and zit is the associated latent variable at diffusion step t.
L18939: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
