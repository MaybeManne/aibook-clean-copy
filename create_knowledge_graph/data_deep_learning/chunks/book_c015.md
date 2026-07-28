L09416: <!-- page 193 -->
L09417: 10.6
L09418: Summary
L09419: 179
L09420: Figure 10.19 Semantic segmentation network of Noh et al. (2015). The input is a
L09421: 224×224 image, which is passed through a version of the VGG network and even-
L09422: tually transformed into a representation of size 4096 using a fully connected layer.
L09423: This contains information about the entire image. This is then reformed into a
L09424: representation of size 7×7 using another fully connected layer, and the image is
L09425: upsampled and deconvolved (transposed convolutions without upsampling) in a
L09426: mirror image of the VGG network. The output is a 224×224×21 representation
L09427: that gives the output probabilities for the 21 classes at each position.
L09428: by a series of max unpooling layers (see figure 10.12b) and deconvolution layers. These
L09429: are transposed convolutions (see figure 10.13) but in 2D and without the upsampling.
L09430: Finally, there is a 1×1 convolution to create 21 channels representing the possible classes
L09431: and a softmax operation at each spatial position to map the activations to class proba-
L09432: bilities. The downsampling side of the network is sometimes referred to as an encoder,
L09433: and the upsampling side as a decoder, so networks of this type are sometimes called
L09434: encoder-decoder networks or hourglass networks due to their shape.
L09435: The final segmentation is generated using a heuristic method that greedily searches
L09436: for the class that is most represented and infers its region, taking into account the
L09437: probabilities but also encouraging connectedness. Then the next most-represented class
L09438: is added where it dominates at the remaining unlabeled pixels. This continues until there
L09439: is insuﬀicient evidence to add more (figure 10.20).
L09440: 10.6
L09441: Summary
L09442: In convolutional layers, each hidden unit is computed by taking a weighted sum of the
L09443: nearby inputs, adding a bias, and applying an activation function. The weights and
L09444: the bias are the same at every spatial position, so there are far fewer parameters than
L09445: in a fully connected network, and the number of parameters doesn’t increase with the
L09446: input image size. To ensure that information is not lost, this operation is repeated with
L09447: Draft: please send errata to udlbookmail@gmail.com.
L09450: <!-- page 194 -->
L09451: 180
L09452: 10
L09453: Convolutional networks
L09454: Figure 10.20 Semantic segmentation results. The final result is created from the
L09455: 21 probability maps by greedily selecting the best class and using a heuristic
L09456: method to find a sensible binary map based on the probabilities and their spatial
L09457: proximity. If there is enough evidence, subsequent classes are added, and their
L09458: segmentation maps are combined. Adapted from Noh et al. (2015).
L09459: different weights and biases to create multiple channels at each spatial position.
L09460: Typical convolutional networks consist of convolutional layers interspersed with layers
L09461: that downsample by a factor of two. As a data example passes through the network, the
L09462: spatial dimensions usually decrease by factors of two, and the channels increase by factors
L09463: of two. At the end of the network, there are typically one or more fully connected layers
L09464: that integrate information from across the entire input and create the desired output. If
L09465: the output is an image, a mirrored “decoder” upsamples back to the original size.
L09466: The translational equivariance of convolutional layers imposes a useful inductive bias
L09467: that increases performance for image-based tasks relative to fully connected networks.
L09468: We described image classification, object detection, and semantic segmentation networks.
L09469: Image classification performance was shown to improve as the network became deeper.
L09470: However, subsequent experiments showed that increasing the network depth indefinitely
L09471: doesn’t continue to help; after a certain depth, the system becomes diﬀicult to train.
L09472: This is the motivation for residual connections, which are the topic of the next chapter.
L09473: Notes
L09474: Dumoulin & Visin (2016) present an overview of the mathematics of convolutions that expands
L09475: on the brief treatment in this chapter.
L09476: Convolutional networks:
L09477: Early convolutional networks were developed by Fukushima &
L09478: Miyake (1982), LeCun et al. (1989a), and LeCun et al. (1989b). Initial applications included
L09479: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L09482: <!-- page 195 -->
L09483: Notes
L09484: 181
L09485: handwriting recognition (LeCun et al., 1989a; Martin, 1993), face recognition (Lawrence et al.,
L09486: 1997), phoneme recognition (Waibel et al., 1989), spoken word recognition (Bottou et al., 1990),
L09487: and signature verification (Bromley et al., 1993). However, convolutional networks were popu-
L09488: larized by LeCun et al. (1998), who built a system called LeNet for classifying 28×28 grayscale
L09489: images of handwritten digits. This is immediately recognizable as a precursor of modern net-
L09490: works; it uses a series of convolutional layers, followed by fully connected layers, sigmoid activa-
L09491: tions rather than ReLUs, and average pooling rather than max pooling. AlexNet (Krizhevsky
L09492: et al., 2012) is widely considered the starting point for modern deep convolutional networks.
L09493: ImageNet Challenge:
L09494: Deng et al. (2009) collated the ImageNet database and the associated
L09495: classification challenge drove progress in deep learning for several years after AlexNet. Notable
L09496: subsequent winners of this challenge include the network-in-network architecture (Lin et al.,
L09497: 2014), which alternated convolutions with fully connected layers that operated independently
L09498: on all of the channels at each position (i.e., 1×1 convolutions). Zeiler & Fergus (2014) and
L09499: Simonyan & Zisserman (2014) trained larger and deeper architectures that were fundamentally
L09500: similar to AlexNet. Szegedy et al. (2017) developed an architecture called GoogLeNet, which
L09501: introduced inception blocks. These use several parallel paths with different filter sizes, which
L09502: are then recombined. This effectively allowed the system to learn the filter size.
L09503: The trend was for performance to improve with increasing depth. However, it ultimately became
L09504: diﬀicult to train deeper networks without modifications; these include residual connections
L09505: and normalization layers, both of which are described in the next chapter.
L09506: Progress in the
L09507: ImageNet challenges is summarized in Russakovsky et al. (2015). A more general survey of
L09508: image classification using convolutional networks can be found in Rawat & Wang (2017). The
L09509: improvement of image classification networks over time is visualized in figure 10.21.
L09510: Types of convolutional layers:
L09511: Atrous or dilated convolutions were introduced by Chen
L09512: et al. (2018c) and Yu & Koltun (2015). Transposed convolutions were introduced by Long et al.
L09513: (2015). Odena et al. (2016) pointed out that they can lead to checkerboard artifacts and should
L09514: be used with caution. Lin et al. (2014) is an early example of convolution with 1×1 filters.
L09515: Many variants of the standard convolutional layer aim to reduce the number of parameters.
L09516: These include depthwise or channel-separate convolution (Howard et al., 2017; Tran et al., 2018),
L09517: in which a different filter convolves each channel separately to create a new set of channels. For
L09518: a kernel size of K × K with C input channels and C output channels, this requires K × K × C
L09519: parameters rather than the K × K × C × C parameters in a regular convolutional layer. A
L09520: related approach is grouped convolutions (Xie et al., 2017), where each convolution kernel is
L09521: only applied to a subset of the channels with a commensurate reduction in the parameters. In
L09522: fact, grouped convolutions were used in AlexNet for computational reasons; the whole network
L09523: could not run on a single GPU, so some channels were processed on one GPU and some on
L09524: another, with limited interaction points. Separable convolutions treat each kernel as an outer
L09525: product of 1D vectors; they use C + K + K parameters for each of the C channels. Partial
L09526: convolutions (Liu et al., 2018a) are used when inpainting missing pixels and account for the
L09527: partial masking of the input. Gated convolutions learn the mask from the previous layer (Yu
L09528: et al., 2019; Chang et al., 2019b). Hu et al. (2018b) propose squeeze-and-excitation networks
L09529: which re-weight the channels using information pooled across all spatial positions.
L09530: Downsampling and upsampling:
L09531: Average pooling dates back to at least LeCun et al. (1989a)
L09532: and max pooling to Zhou & Chellappa (1988). Scherer et al. (2010) compared these methods
L09533: and concluded that max pooling was superior. The max unpooling method was introduced by
L09534: Zeiler et al. (2011) and Zeiler & Fergus (2014). Max pooling can be thought of as applying
L09535: Draft: please send errata to udlbookmail@gmail.com.
L09538: <!-- page 196 -->
L09539: 182
L09540: 10
L09541: Convolutional networks
L09542: Figure 10.21 ImageNet performance. Each circle represents a different published
L09543: model.
L09544: Blue circles represent models that were state-of-the-art.
L09545: Models dis-
L09546: cussed in this book are also highlighted. The AlexNet and VGG networks were
L09547: remarkable for their time but are now far from state of the art. ResNet-200 and
L09548: DenseNet are discussed in chapter 11. ImageGPT, ViT, SWIN, and DaViT are
L09549: discussed in chapter 12. Adapted from https://paperswithcode.com/sota/image-
L09550: classification-on-imagenet.
L09551: an L∞norm to the hidden units that are to be pooled. This led to applying other Lk norms
L09552: Appendix B.3.2
L09553: Vector norms
L09554: (Springenberg et al., 2015; Sainath et al., 2013), although these require more computation and
L09555: are not widely used. Zhang (2019) introduced max-blur-pooling, in which a low-pass filter is
L09556: applied before downsampling to prevent aliasing, and showed that this improves generalization
L09557: over translation of the inputs and protects against adversarial attacks (see section 20.4.6).
L09558: Shi et al. (2016) introduced PixelShuffle, which used convolutional filters with a stride of 1/s
L09559: to scale up 1D signals by a factor of s.
L09560: Only the weights that lie exactly on positions are
L09561: used to create the outputs, and the ones that fall between positions are discarded. This can
L09562: be implemented by multiplying the number of channels in the kernel by a factor of s, where
L09563: the sth output position is computed from just the sth subset of channels. This can be trivially
L09564: extended to 2D convolution, which requires s2 channels.
L09565: Convolution in 1D and 3D:
L09566: Convolutional networks are usually applied to images but have
L09567: also been applied to 1D data in applications that include speech recognition (Abdel-Hamid
L09568: et al., 2012), sentence classification (Zhang et al., 2015; Conneau et al., 2017), electrocardiogram
L09569: classification (Kiranyaz et al., 2015), and bearing fault diagnosis (Eren et al., 2019). A survey
L09570: of 1D convolutional networks can be found in Kiranyaz et al. (2021). Convolutional networks
L09571: have also been applied to 3D data, including video (Ji et al., 2012; Saha et al., 2016; Tran et al.,
L09572: 2015) and volumetric measurements (Wu et al., 2015b; Maturana & Scherer, 2015).
L09573: Invariance and equivariance:
L09574: Part of the motivation for convolutional layers is that they
L09575: are approximately equivariant with respect to translation, and part of the motivation for max
L09576: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L09579: <!-- page 197 -->
L09580: Notes
L09581: 183
L09582: pooling is to induce invariance to small translations.
L09583: Zhang (2019) considers the degree to
L09584: which convolutional networks really have these properties and proposes the max-blur-pooling
L09585: modification that demonstrably improves them. There is considerable interest in making net-
L09586: works equivariant or invariant to other types of transformations, such as reflections, rotations,
L09587: and scaling. Sifre & Mallat (2013) constructed a system based on wavelets that induced both
L09588: translational and rotational invariance in image patches and applied this to texture classifica-
L09589: tion. Kanazawa et al. (2014) developed locally scale-invariant convolutional neural networks.
L09590: Cohen & Welling (2016) exploited group theory to construct group CNNs, which are equivariant
L09591: to larger families of transformations, including reflections and rotations. Esteves et al. (2018)
L09592: introduced polar transformer networks, which are invariant to translations and equivariant to
L09593: rotation and scale. Worrall et al. (2017) developed harmonic networks, the first example of a
L09594: group CNN that was equivariant to continuous rotations.
L09595: Initialization and regularization:
L09596: Convolutional networks are typically initialized using
L09597: Xavier initialization (Glorot & Bengio, 2010) or He initialization (He et al., 2015), as described
L09598: in section 7.5. However, the ConvolutionOrthogonal initializer (Xiao et al., 2018a) is special-
L09599: Problem 10.19
L09600: ized for convolutional networks.
L09601: Networks of up to 10,000 layers can be trained using this
L09602: initialization without the need for residual connections.
L09603: Dropout is effective for fully connected networks but less so for convolutional layers (Park &
L09604: Kwak, 2016). This may be because neighboring image pixels are highly correlated, so if a hidden
L09605: unit drops out, the same information is passed on via adjacent positions. This is the motivation
L09606: for spatial dropout and cutout. In spatial dropout (Tompson et al., 2015), entire feature maps
L09607: are discarded instead of individual pixels. This circumvents the problem of neighboring pixels
L09608: carrying the same information. Similarly, DeVries & Taylor (2017b) propose cutout, in which a
L09609: square patch of each input image is masked at training time. Wu & Gu (2015) modified max
L09610: pooling for dropout layers using a method that involves sampling from a probability distribution
L09611: over the constituent elements rather than always taking the maximum.
L09612: Adaptive Kernels:
L09613: The inception block (Szegedy et al., 2017) applies convolutional filters of
L09614: different sizes in parallel and, as such, provides a crude mechanism by which the network can
L09615: learn the appropriate filter size. Other work has investigated learning the scale of convolutions
L09616: as part of the training process (e.g., Pintea et al., 2021; Romero et al., 2021) or the stride of
L09617: downsampling layers (Riad et al., 2022).
L09618: In some systems, the kernel size is changed adaptively based on the data. This is sometimes in
L09619: the context of guided convolution, where one input is used to help guide the computation from
L09620: another input. For example, an RGB image might be used to help upsample a low-resolution
L09621: depth map. Jia et al. (2016) directly predicted the filter weights themselves using a different
L09622: network branch.
L09623: Xiong et al. (2020b) change the kernel size adaptively.
L09624: Su et al. (2019a)
L09625: moderate weights of fixed kernels by a function learned from another modality.
L09626: Dai et al.
L09627: (2017) learn offsets of weights so that they do not have to be applied in a regular grid.
L09628: Object detection and semantic segmentation:
L09629: Object detection methods can be divided
L09630: into proposal-based and proposal-free schemes.
L09631: In the former case, processing occurs in two
L09632: stages.
L09633: A convolutional network ingests the whole image and proposes regions that might
L09634: contain objects. These proposal regions are then resized, and a second network analyzes them
L09635: to establish whether there is an object there and what it is. An early example of this approach
L09636: was R-CNN (Girshick et al., 2014). This was subsequently extended to allow end-to-end training
L09637: (Girshick, 2015) and to reduce the cost of the region proposals (Ren et al., 2015). Subsequent
L09638: work on feature pyramid networks improved both performance and speed by combining features
L09639: Draft: please send errata to udlbookmail@gmail.com.
L09642: <!-- page 198 -->
L09643: 184
L09644: 10
L09645: Convolutional networks
L09646: across multiple scales (Lin et al., 2017b). In contrast, proposal-free schemes perform all the
L09647: processing in a single pass. YOLO (Redmon et al., 2016), which was described in section 10.5.2,
L09648: is the most celebrated example of a proposal-free scheme. The most recent iteration of this
L09649: framework at the time of writing is YOLOv7 (Wang et al., 2022a). A recent review of object
L09650: detection can be found in Zou et al. (2023).
L09651: The semantic segmentation network described in section 10.5.3 was developed by Noh et al.
L09652: (2015). Many subsequent approaches have been variations of U-Net (Ronneberger et al., 2015),
L09653: which is described in section 11.5.3. Recent surveys of semantic segmentation can be found in
L09654: Minaee et al. (2021) and Ulku & Akagündüz (2022).
L09655: Visualizing Convolutional Networks:
L09656: The dramatic success of convolutional networks led
L09657: to a series of efforts to visualize the information they extract from the image (see Qin et al., 2018,
L09658: for a review). Erhan et al. (2009) visualized the optimal stimulus that activated a hidden unit
L09659: by starting with an image containing noise and then optimizing the input to make the hidden
L09660: unit most active using gradient ascent. Zeiler & Fergus (2014) trained a network to reconstruct
L09661: the input and then set all the hidden units to zero except the one they were interested in;
L09662: the reconstruction then provides information about what drives the hidden unit. Mahendran
L09663: & Vedaldi (2015) visualized an entire layer of a network. Their network inversion technique
L09664: aimed to find an image that resulted in the activations at that layer but also incorporates prior
L09665: knowledge that encourages this image to have similar statistics to natural images.
L09666: Finally, Bau et al. (2017) introduced network dissection. Here, a series of images with known
L09667: pixel labels capturing color, texture, and object type are passed through the network, and the
L09668: correlation of a hidden unit with each property is measured. This method has the advantage
L09669: that it only uses the forward pass of the network and does not require optimization. These
L09670: methods did provide some partial insight into how the network processes images. For example,
L09671: Bau et al. (2017) showed that earlier layers correlate more with texture and color and later
L09672: layers with the object type. However, it is fair to say that fully understanding the processing
L09673: of networks containing millions of parameters is currently not possible.
L09674: Problems
L09675: Problem 10.1∗Show that the operation in equation 10.3 is equivariant with respect to transla-
L09676: tion.
L09677: Problem 10.2 Equation 10.3 defines 1D convolution with a kernel size of three, stride of one,
L09678: and dilation one. Write out the equivalent equation for the 1D convolution with a kernel size
L09679: of three and a stride of two as pictured in figure 10.3a–b.
L09680: Problem 10.3 Write out the equation for the 1D dilated convolution with a kernel size of three
L09681: and a dilation rate of two, as pictured in figure 10.3d.
L09682: Problem 10.4 Write out the equation for a 1D convolution with kernel size of seven, a dilation
L09683: rate of three, and a stride of three.
L09684: Problem 10.5 Draw weight matrices in the style of figure 10.4d for (i) the strided convolution
L09685: in figure 10.3a–b, (ii) the convolution with kernel size 5 in figure 10.3c, and (iii) the dilated
L09686: convolution in figure 10.3d.
L09687: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L09690: <!-- page 199 -->
L09691: Notes
L09692: 185
L09693: Problem 10.6∗Draw a 12×6 weight matrix in the style of figure 10.4d relating inputs x1, . . . , x6
L09694: to outputs h1, . . . , h12 in the multi-channel convolution as depicted in figures 10.5a–b.
L09695: Problem 10.7∗Draw a 6×12 weight matrix in the style of figure 10.4d relating inputs h1, . . . , h12
L09696: to outputs h′
L09697: 1, . . . , h′
L09698: 6 in the multi-channel convolution in figure 10.5c.
L09699: Problem 10.8 Consider a 1D convolutional network where the input has three channels. The
L09700: first hidden layer is computed using a kernel size of three and has four channels. The second
L09701: hidden layer is computed using a kernel size of five and has ten channels. How many biases and
L09702: how many weights are needed for each of these two convolutional layers?
L09703: Problem 10.9 A network consists of three 1D convolutional layers. At each layer, a zero-padded
L09704: convolution with kernel size three, stride one, and dilation one is applied. What size is the
L09705: receptive field of the hidden units in the third layer?
L09706: Problem 10.10 A network consists of three 1D convolutional layers.
L09707: At each layer, a zero-
L09708: padded convolution with kernel size seven, stride one, and dilation one is applied. What size is
L09709: the receptive field of hidden units in the third layer?
L09710: Problem 10.11 Consider a convolutional network with 1D input x. The first hidden layer H1 is
L09711: computed using a convolution with kernel size five, stride two, and a dilation rate of one. The
L09712: second hidden layer H2 is computed using a convolution with kernel size three, stride one, and
L09713: a dilation rate of one. The third hidden layer H3 is computed using a convolution with kernel
L09714: size five, stride one, and a dilation rate of two. What are the receptive field sizes at each hidden
L09715: layer?
L09716: Problem 10.12 The 1D convolutional network in figure 10.7 was trained using stochastic gradient
L09717: descent with a learning rate of 0.01 and a batch size of 100 on a training dataset of 4,000 examples
L09718: for 100,000 steps. How many epochs was the network trained for?
L09719: Problem 10.13 Draw a weight matrix in the style of figure 10.4d that shows the relationship
L09720: between the 24 inputs and the 24 outputs in figure 10.9.
L09721: Problem 10.14 Consider a 2D convolutional layer with kernel size 5×5 that takes 3 input
L09722: channels and returns 10 output channels. How many convolutional weights are there? How
L09723: many biases?
L09724: Problem 10.15 Draw a weight matrix in the style of figure 10.4d that samples every other
L09725: variable in a 1D input (i.e., the 1D analog of figure 10.11a). Show that the weight matrix for
L09726: 1D convolution with kernel size three and stride two is equivalent to composing the matrices
L09727: for 1D convolution with kernel size three and stride one and this sampling matrix.
L09728: Problem 10.16∗Consider the AlexNet network (figure 10.16). How many parameters are used
L09729: in each convolutional and fully connected layer? What is the total number of parameters?
L09730: Problem 10.17 What is the receptive field size at each of the first three layers of AlexNet (i.e.,
L09731: the first three orange blocks in figure 10.16)?
L09732: Problem 10.18 How many weights and biases are there at each convolutional layer and fully
L09733: connected layer in the VGG architecture (figure 10.17)?
L09734: Problem 10.19∗Consider two hidden layers of size 224×224 with C1 and C2 channels, respec-
L09735: tively, connected by a 3×3 convolutional layer. Describe how to initialize the weights using He
L09736: initialization.
L09737: Draft: please send errata to udlbookmail@gmail.com.
L09740: <!-- page 200 -->
L09741: Chapter 11
L09742: Residual networks
L09743: The previous chapter described how image classification performance improved as the
L09744: depth of convolutional networks was extended from eight layers (AlexNet) to nineteen
L09745: layers (VGG). This led to experimentation with even deeper networks. However, per-
L09746: formance decreased again when many more layers were added.
L09747: This chapter introduces residual blocks. Here, each network layer computes an addi-
L09748: tive change to the current representation instead of transforming it directly. This allows
L09749: deeper networks to be trained but causes an exponential increase in the activation mag-
L09750: nitudes at initialization. Residual blocks employ batch normalization to compensate for
L09751: this, which re-centers and rescales the activations at each layer.
L09752: Residual blocks with batch normalization allow much deeper networks to be trained,
L09753: and these networks improve performance across a variety of tasks. Architectures that
L09754: combine residual blocks to tackle image classification, medical image segmentation, and
L09755: human pose estimation are described.
L09756: 11.1
L09757: Sequential processing
L09758: Every network we have seen so far processes the data sequentially; each layer receives
L09759: the previous layer’s output and passes the result to the next (figure 11.1). For example,
L09760: a three-layer network is defined by:
L09761: h1
L09762: =
L09763: f1[x, ϕ1]
L09764: h2
L09765: =
L09766: f2[h1, ϕ2]
L09767: h3
L09768: =
L09769: f3[h2, ϕ3]
L09770: y
L09771: =
L09772: f4[h3, ϕ4],
L09773: (11.1)
L09774: where h1, h2, and h3 denote the intermediate hidden layers, x is the network input, y
L09775: is the output, and the functions fk[•, ϕk] perform the processing.
L09776: In a standard neural network, each layer consists of a linear transformation followed
L09777: by an activation function, and the parameters ϕk comprise the weights and biases of the
L09778: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L09781: <!-- page 201 -->
L09782: 11.1
L09783: Sequential processing
L09784: 187
L09785: Figure 11.1 Sequential processing. Standard neural networks pass the output of
L09786: each layer directly into the next layer.
L09787: linear transformation. In a convolutional network, each layer consists of a set of convolu-
L09788: tions followed by an activation function, and the parameters comprise the convolutional
L09789: kernels and biases.
L09790: Since the processing is sequential, we can equivalently think of this network as a
L09791: series of nested functions:
L09792: y = f4
L09793: 
L09794: f3
L09795: h
L09796: f2
L09797: 
L09798: f1[x, ϕ1], ϕ2
L09799: 
L09800: , ϕ3
L09801: i
L09802: , ϕ4
L09803: 
L09804: .
L09805: (11.2)
L09806: 11.1.1
L09807: Limitations of sequential processing
L09808: In principle, we can add as many layers as we want, and in the previous chapter, we saw
L09809: that adding more layers to a convolutional network does improve performance; the VGG
L09810: network (figure 10.17), which has nineteen layers, outperforms AlexNet (figure 10.16),
L09811: which has eight layers. However, image classification performance decreases again as
L09812: further layers are added (figure 11.2). This is surprising since models generally perform
L09813: better as more capacity is added (figure 8.10). Indeed, the decrease is present for both the
L09814: training set and the test set, which implies that the problem is training deeper networks
L09815: rather than the inability of deeper networks to generalize.
L09816: This phenomenon is not completely understood. One conjecture is that right after
L09817: initialization, the loss gradients change unpredictably when we modify parameters in
L09818: early network layers. With appropriate initialization of the weights (see section 7.5), the
L09819: gradient of the loss with respect to these parameters will be reasonable (i.e., no exploding
L09820: or vanishing gradients). However, the derivative assumes an infinitesimal change in the
L09821: parameter, whereas optimization algorithms use a finite step size. Any reasonable choice
L09822: Notebook 11.1
L09823: Shattered
L09824: gradients
L09825: of step size may move to a place with a completely different and unrelated gradient; the
L09826: loss surface looks like an enormous range of tiny mountains rather than a single smooth
L09827: structure that is easy to descend. Consequently, the algorithm doesn’t make progress in
L09828: the way that it does when the loss function gradient changes more slowly.
L09829: This conjecture is supported by empirical observations of gradients in networks with
L09830: a single input and output. For a shallow network, the gradient of the output with re-
L09831: spect to the input changes slowly as we change the input (figure 11.3a). However, for a
L09832: Appendix B.2.1
L09833: Autocorrelation
L09834: function
L09835: deep network, a tiny change in the input results in a completely different gradient (fig-
L09836: ure 11.3b). This is captured by the autocorrelation function of the gradient (figure 11.3c).
L09837: Nearby gradients are correlated for shallow networks, but this correlation quickly drops
L09838: to zero for deep networks. This is termed the shattered gradients phenomenon.
L09839: Draft: please send errata to udlbookmail@gmail.com.
L09842: <!-- page 202 -->
L09843: 188
L09844: 11
L09845: Residual networks
L09846: Figure 11.2 Decrease in performance when adding more convolutional layers. a) A
L09847: 20-layer convolutional network outperforms a 56-layer neural network for image
L09848: classification on the test set of the CIFAR-10 dataset (Krizhevsky & Hinton,
L09849: 2009). b) This is also true for the training set, which suggests that the problem
L09850: relates to training the original network rather than a failure to generalize to new
L09851: data. Adapted from He et al. (2016a).
L09852: Figure 11.3 Shattered gradients. a) Consider a shallow network with 200 hidden
L09853: units and Glorot initialization (He initialization without the factor of two) for
L09854: both the weights and biases. The gradient ∂y/∂x of the scalar network output y
L09855: with respect to the scalar input x changes relatively slowly as we change the in-
L09856: put x. b) For a deep network with 24 layers and 200 hidden units per layer, this
L09857: gradient changes very quickly and unpredictably. c) The autocorrelation function
L09858: of the gradient shows that nearby gradients become unrelated (have autocorrela-
L09859: tion close to zero) for deep networks. This shattered gradients phenomenon may
L09860: explain why it is hard to train deep networks. Gradient descent algorithms rely
L09861: on the loss surface being relatively smooth, so the gradients should be related
L09862: before and after each update step. Adapted from Balduzzi et al. (2017).
L09863: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L09866: <!-- page 203 -->
L09867: 11.2
L09868: Residual connections and residual blocks
L09869: 189
L09870: Shattered gradients presumably arise because changes in early network layers modify
L09871: the output in an increasingly complex way as the network becomes deeper. The derivative
L09872: of the output y with respect to the first layer f1 of the network in equation 11.1 is:
L09873: Appendix B.5
L09874: Matrix calculus
L09875: ∂y
L09876: ∂f1
L09877: = ∂f2
L09878: ∂f1
L09879: ∂f3
L09880: ∂f2
L09881: ∂f4
L09882: ∂f3
L09883: .
L09884: (11.3)
L09885: When we change the parameters that determine f1, all of the derivatives in this sequence
L09886: are evaluated at slightly different locations since layers f2, f3, and f4 are themselves
L09887: computed from f1. Consequently, the updated gradient at each training example may
L09888: be completely different, and the loss function becomes badly behaved.1
L09889: 11.2
L09890: Residual connections and residual blocks
L09891: Residual or skip connections are branches in the computational path, whereby the input
L09892: to each network layer f[•] is added back to the output (figure 11.4a). By analogy to
L09893: equation 11.1, the residual network is defined as:
L09894: h1
L09895: =
L09896: x + f1[x, ϕ1]
L09897: h2
L09898: =
L09899: h1 + f2[h1, ϕ2]
L09900: h3
L09901: =
L09902: h2 + f3[h2, ϕ3]
L09903: y
L09904: =
L09905: h3 + f4[h3, ϕ4],
L09906: (11.4)
L09907: where the first term on the right-hand side of each line is the residual connection. Each
L09908: function fk learns an additive change to the current representation. It follows that their
L09909: outputs must be the same size as their inputs. Each additive combination of the input
L09910: and the processed output is known as a residual block or residual layer.
L09911: Once more, we can write this as a single function by substituting in the expressions
L09912: Problem 11.1
L09913: for the intermediate quantities hk:
L09914: y = x + f1[x]
L09915: (11.5)
L09916: + f2
L09917: 
L09918: x + f1[x]
L09919: 
L09920: + f3
L09921: h
L09922: x + f1[x] + f2
L09923: 
L09924: x + f1[x]
L09925: i
L09926: + f4
L09927: 
L09928: x + f1[x] + f2
L09929: 
L09930: x + f1[x]
L09931: 
L09932: + f3
L09933: h
L09934: x + f1[x] + f2
L09935: 
L09936: x + f1[x]
L09937: i
L09938: ,
L09939: where we have omitted the parameters ϕ• for clarity. We can think of this equation as
L09940: “unraveling” the network (figure 11.4b). We see that the final network output is a sum
L09941: of the input and four smaller networks, corresponding to each line of the equation; one
L09942: 1In equations 11.3 and 11.6, we overload notation to define fk as the output of the function fk[•].
L09943: Draft: please send errata to udlbookmail@gmail.com.
L09946: <!-- page 204 -->
L09947: 190
L09948: 11
L09949: Residual networks
L09950: Figure 11.4 Residual connections. a) The output of each function fk[x, ϕk] is
L09951: added back to its input, which is passed via a parallel computational path called
L09952: a residual or skip connection. Hence, the function computes an additive change
L09953: to the representation. b) Upon expanding (unraveling) the network equations, we
L09954: find that the output is the sum of the input plus four smaller networks (depicted
L09955: in white, orange, gray, and cyan, respectively, and corresponding to terms in
L09956: equation 11.5); we can think of this as an ensemble of networks.
L09957: Moreover,
L09958: the output from the cyan network is itself a transformation f4[•, ϕ4] of another
L09959: ensemble, and so on. Alternatively, we can consider the network as a combination
L09960: of 16 different paths through the computational graph. One example is the dashed
L09961: path from input x to output y, which is the same in panels (a) and (b).
L09962: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L09965: <!-- page 205 -->
L09966: 11.2
L09967: Residual connections and residual blocks
L09968: 191
L09969: Figure 11.5 Order of operations in resid-
L09970: ual blocks. a) The usual order of linear
L09971: transformation or convolution followed
L09972: by a ReLU nonlinearity means that each
L09973: residual block can only add non-negative
L09974: quantities.
L09975: b) With the reverse order,
L09976: both positive and negative quantities can
L09977: be added. However, we must add a linear
L09978: transformation at the start of the net-
L09979: work in case the input is all negative. c)
L09980: In practice, it’s common for a residual
L09981: block to contain several network layers.
L09982: interpretation is that residual connections turn the original network into an ensemble of
L09983: these smaller networks whose outputs are summed to compute the result.
L09984: A complementary way of thinking about this residual network is that it creates sixteen
L09985: paths with differing numbers of transformations between input and output. For example,
L09986: Problem 11.2
L09987: the first function f1[x] occurs in eight of these sixteen paths, including as a direct additive
L09988: term (i.e., a path length of one), and the analogous derivative to equation 11.3 is:
L09989: Problem 11.3
L09990: ∂y
L09991: ∂f1
L09992: = I + ∂f2
L09993: ∂f1
L09994: +
L09995: ∂f3
L09996: ∂f1
L09997: + ∂f2
L09998: ∂f1
L09999: ∂f3
L10000: ∂f2
L10001: 
L10002: +
L10003: ∂f4
L10004: ∂f1
L10005: + ∂f2
L10006: ∂f1
L10007: ∂f4
L10008: ∂f2
L10009: + ∂f3
L10010: ∂f1
L10011: ∂f4
L10012: ∂f3
L10013: + ∂f2
L10014: ∂f1
L10015: ∂f3
L10016: ∂f2
L10017: ∂f4
L10018: ∂f3
L10019: 
L10020: , (11.6)
L10021: where there is one term for each of the eight paths. The identity term on the right-
L10022: hand side shows that changes in the parameters ϕ1 in the first layer f1[x, ϕ1] contribute
L10023: directly to changes in the network output y. They also contribute indirectly through
L10024: the other chains of derivatives of varying lengths. In general, gradients through shorter
L10025: Notebook 11.2
L10026: Residual
L10027: networks
L10028: paths will be better behaved. Since both the identity term and various short chains of
L10029: derivatives will contribute to the derivative for each layer, networks with residual links
L10030: suffer less from shattered gradients.
L10031: 11.2.1
L10032: Order of operations in residual blocks
L10033: Until now, we have implied that the additive functions f[x] could be any valid network
L10034: layer (e.g., fully connected or convolutional). This is technically true, but the order of
L10035: operations in these functions is important. They must contain a nonlinear activation
L10036: function like a ReLU, or the entire network will be linear. However, in a typical network
L10037: layer (figure 11.5a), the ReLU function is at the end, so the output is non-negative. If
L10038: we adopt this convention, then each residual block can only increase the input values.
L10039: Hence, it is typical to change the order of operations so that the activation function is
L10040: applied first, followed by the linear transformation (figure 11.5b). Sometimes there may
L10041: be several layers of processing within the residual block (figure 11.5c), but these usually
L10042: terminate with a linear transformation. Finally, we note that when we start these blocks
L10043: with a ReLU operation, they will do nothing if the initial network input is negative since
L10044: the ReLU will clip the entire signal to zero. Hence, it’s typical to start the network with
L10045: a linear transformation rather than a residual block, as in figure 11.5b.
L10046: Draft: please send errata to udlbookmail@gmail.com.
