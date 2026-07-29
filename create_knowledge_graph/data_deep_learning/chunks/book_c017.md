L10415: <!-- page 215 -->
L10416: Notes
L10417: 201
L10418: Figure 11.13 Visualizing neural network loss surfaces. Each plot shows the loss
L10419: surface in two random directions in parameter space around the minimum found
L10420: by SGD for an image classification task on the CIFAR-10 dataset. These direc-
L10421: tions are normalized to facilitate side-by-side comparison. a) Residual net with 56
L10422: layers. b) Results from the same network without skip connections. The surface
L10423: is smoother with the skip connections. This facilitates learning and makes the
L10424: final network performance more robust to minor errors in the parameters, so it
L10425: will likely generalize better. Adapted from Li et al. (2018b).
L10426: parameters early in the network changes quickly and unpredictably relative to the update
L10427: step size. Residual connections add the processed representation back to their own input.
L10428: Now each layer contributes directly to the output as well as indirectly, so propagating
L10429: gradients through many layers is not mandatory, and the loss surface is smoother.
L10430: Residual networks don’t suffer from vanishing gradients but introduce an exponential
L10431: increase in the variance of the activations during forward propagation and corresponding
L10432: problems with exploding gradients. This is usually handled by adding batch normaliza-
L10433: tion, which compensates for the empirical mean and variance of the batch and then
L10434: shifts and rescales using learned parameters. If these parameters are initialized judi-
L10435: ciously, very deep networks can be trained. There is evidence that both residual links
L10436: and batch normalization make the loss surface smoother, which permits larger learning
L10437: rates. Moreover, the variability in the batch statistics adds a source of regularization.
L10438: Residual blocks have been incorporated into convolutional networks.
L10439: They allow
L10440: deeper networks to be trained with commensurate increases in image classification per-
L10441: formance.
L10442: Variations of residual networks include the DenseNet architecture, which
L10443: concatenates outputs of all prior layers to feed into the current layer, and U-Nets, which
L10444: incorporate residual connections into encoder-decoder models.
L10445: Notes
L10446: Residual connections:
L10447: Residual connections were introduced by He et al. (2016a), who built
L10448: a network with 152 layers, which was eight times larger than VGG (figure 10.17), and achieved
L10449: state-of-the-art performance on the ImageNet classification task. Each residual block consisted
L10450: Draft: please send errata to udlbookmail@gmail.com.
L10453: <!-- page 216 -->
L10454: 202
L10455: 11
L10456: Residual networks
L10457: of a convolutional layer followed by batch normalization, a ReLU activation, a second convolu-
L10458: tional layer, and second batch normalization. A second ReLU function was applied after this
L10459: block was added back to the main representation. This architecture was termed ResNet v1.
L10460: He et al. (2016b) investigated different variations of residual architectures, in which either (i)
L10461: processing could also be applied along the skip connection or (ii) after the two branches had
L10462: recombined. They concluded neither was necessary, leading to the architecture in figure 11.7,
L10463: which is sometimes termed a pre-activation residual block and is the backbone of ResNet v2.
L10464: They trained a network with 200 layers that improved further on the ImageNet classification
L10465: task (see figure 11.8). Since this time, new methods for regularization, optimization, and data
L10466: augmentation have been developed, and Wightman et al. (2021) exploit these to present a more
L10467: modern training pipeline for the ResNet architecture.
L10468: Why residual connections help:
L10469: Residual networks certainly allow deeper networks to be
L10470: trained. Presumably, this is related to reducing shattered gradients (Balduzzi et al., 2017) at
L10471: the start of training and the smoother loss surface near the minima as depicted in figure 11.13
L10472: (Li et al., 2018b). Residual connections alone (i.e., without batch normalization) increase the
L10473: trainable depth of a network by roughly a factor of two (Sankararaman et al., 2020). With batch
L10474: normalization, very deep networks can be trained, but it is unclear that depth is critical for
L10475: performance. Zagoruyko & Komodakis (2016) showed that wide residual networks with only 16
L10476: layers outperformed all residual networks of the time for image classification. Orhan & Pitkow
L10477: (2017) propose a different explanation for why residual connections improve learning in terms
L10478: of eliminating singularities (places on the loss surface where the Hessian is degenerate).
L10479: Related architectures:
L10480: Residual connections are a special case of highway networks (Srivas-
L10481: tava et al., 2015) which also split the computation into two branches and additively recombine.
L10482: Highway networks use a gating function that weights the inputs to the two branches in a way
L10483: that depends on the data itself, whereas residual networks send the data down both branches in
L10484: a straightforward manner. Xie et al. (2017) introduced the ResNeXt architecture, which places
L10485: a residual connection around multiple parallel convolutional branches.
L10486: Residual networks as ensembles:
L10487: Veit et al. (2016) characterized residual networks as en-
L10488: sembles of shorter networks and depicted the “unraveled network” interpretation (figure 11.4b).
L10489: They provide evidence that this interpretation is valid by showing that deleting layers in a
L10490: trained network (and hence a subset of paths) only has a modest effect on performance. Con-
L10491: versely, removing a layer in a purely sequential network like VGG is catastrophic. They also
L10492: looked at the gradient magnitudes along paths of different lengths and showed that the gradient
L10493: vanishes in longer paths. In a residual network consisting of 54 blocks, almost all of the gradient
L10494: updates during training were from paths of length 5 to 17 blocks long, even though these only
L10495: constitute 0.45% of the total paths. It seems that adding more blocks effectively adds more
L10496: parallel shorter paths rather than creating a network that is truly deeper.
L10497: Regularization for residual networks:
L10498: L2 regularization of the weights has a fundamentally
L10499: different effect in vanilla networks and residual networks without BatchNorm. In the former, it
L10500: encourages the output of the layer to be a constant function determined by the biases. In the
L10501: latter, it encourages the residual block to compute the identity plus a constant determined by
L10502: the biases.
L10503: Several regularization methods have been developed that are targeted specifically at residual
L10504: architectures.
L10505: ResDrop (Yamada et al., 2016), stochastic depth (Huang et al., 2016), and
L10506: RandomDrop (Yamada et al., 2019) all regularize residual networks by randomly dropping
L10507: residual blocks during the training process. In the latter case, the propensity for dropping a block
L10508: is determined by a Bernoulli variable, whose parameter is linearly decreased during training. At
L10509: test time, the residual blocks are added back in with their expected probability. These methods
L10510: are effectively versions of dropout, in which all the hidden units in a block are simultaneously
L10511: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L10514: <!-- page 217 -->
L10515: Notes
L10516: 203
L10517: dropped in concert. In the multiple paths view of residual networks (figure 11.4b), they simply
L10518: remove some of the paths at each training step. Wu et al. (2018b) developed BlockDrop, which
L10519: analyzes an existing network and decides which residual blocks to use at runtime with the goal
L10520: of improving the eﬀiciency of inference.
L10521: Other regularization methods have been developed for networks with multiple paths inside
L10522: the residual block. Shake-shake (Gastaldi, 2017a,b) randomly re-weights the paths during the
L10523: forward and backward passes. In the forward pass, this can be viewed as synthesizing random
L10524: data, and in the backward pass, as injecting another form of noise into the training method.
L10525: ShakeDrop (Yamada et al., 2019) draws a Bernoulli variable that decides whether each block
L10526: will be subject to Shake-Shake or behave like a standard residual unit on this training step.
L10527: Batch normalization:
L10528: Batch normalization was introduced by Ioffe & Szegedy (2015) outside
L10529: of the context of residual networks. They showed empirically that it allowed higher learning
L10530: rates, increased convergence speed, and made sigmoid activation functions more practical (since
L10531: the distribution of outputs is controlled, so examples are less likely to fall in the saturated
L10532: extremes of the sigmoid). Balduzzi et al. (2017) investigated the activation of hidden units in
L10533: later layers of deep networks with ReLU functions at initialization. They showed that many such
L10534: hidden units were always active or always inactive regardless of the input but that BatchNorm
L10535: reduced this tendency.
L10536: Although batch normalization helps stabilize the forward propagation of signals through a
L10537: network, Yang et al. (2019) showed that it causes gradient explosion in ReLU networks without
L10538: skip connections, with each layer increasing the magnitude of the gradients by
L10539: p
L10540: π/(π −1) ≈
L10541: 1.21. This argument is summarized by Luther (2020). Since a residual network can be seen
L10542: as a combination of paths of different lengths (figure 11.4), this effect must also be present in
L10543: residual networks. Presumably, however, the benefit of removing the 2K increases in magnitude
L10544: in the forward pass of a network with K layers outweighs the harm done by increasing the
L10545: gradients by 1.21K in the backward pass, so overall BatchNorm makes training more stable.
L10546: Variations of batch normalization:
L10547: Several variants of BatchNorm have been proposed
L10548: (figure 11.14).
L10549: BatchNorm normalizes each channel separately based on statistics gathered
L10550: across the batch. Ghost batch normalization or GhostNorm (Hoffer et al., 2017) uses only part
L10551: of the batch to compute the normalization statistics, which makes them noisier and increases
L10552: the amount of regularization when the batch size is very large (figure 11.14b).
L10553: When the batch size is very small or the fluctuations within a batch are very large (as is often the
L10554: case in natural language processing), the statistics in BatchNorm may become unreliable. Ioffe
L10555: (2017) proposed batch renormalization, which keeps a running average of the batch statistics
L10556: and modifies the normalization of any batch to ensure that it is more representative. Another
L10557: problem is that batch normalization is unsuitable for use in recurrent neural networks (networks
L10558: for processing sequences, in which the previous output is fed back as an additional input as we
L10559: move through the sequence, see figure 12.19). Here, the statistics must be stored at each step in
L10560: the sequence, and it’s unclear what to do if a test sequence is longer than the training sequences.
L10561: A third problem is that batch normalization needs access to the whole batch. However, this
L10562: may not be easily available when training is distributed across several machines.
L10563: Layer normalization or LayerNorm (Ba et al., 2016) avoids using batch statistics by normalizing
L10564: each data example separately, using statistics gathered across the channels and spatial position
L10565: (figure 11.14c).
L10566: However, there is still a separate learned scale γ and offset δ per channel.
L10567: Group normalization or GroupNorm (Wu & He, 2018) is similar to LayerNorm but divides the
L10568: channels into groups and computes the statistics for each group separately across the within-
L10569: group channels and the spatial positions (figure 11.14d). Again, there are still separate scale and
L10570: offset parameters per channel. Instance normalization or InstanceNorm (Ulyanov et al., 2016)
L10571: takes this to the extreme where the number of groups is the same as the number of channels,
L10572: so each channel is normalized separately (figure 11.14e), using statistics gathered across spatial
L10573: Draft: please send errata to udlbookmail@gmail.com.
L10576: <!-- page 218 -->
L10577: 204
L10578: 11
L10579: Residual networks
L10580: Figure 11.14 Normalization schemes.
L10581: BatchNorm modifies each channel sepa-
L10582: rately but adjusts each batch member in the same way based on statistics gathered
L10583: across the batch and spatial position. Ghost batch normalization computes these
L10584: statistics from only part of the batch to make them more variable. LayerNorm
L10585: computes statistics for each batch member separately, based on statistics gath-
L10586: ered across the channels and spatial position. It retains a separate learned scaling
L10587: factor for each channel. GroupNorm normalizes within each group of channels
L10588: and also retains a separate scale and offset parameter for each channel. Instan-
L10589: ceNorm normalizes within each channel separately, computing the statistics only
L10590: across spatial position. Adapted from Wu & He (2018).
L10591: position alone. Salimans & Kingma (2016) investigated normalizing the network weights rather
L10592: than the activations, but this has been less empirically successful. Teye et al. (2018) introduced
L10593: Monte Carlo batch normalization, which can provide meaningful estimates of uncertainty in the
L10594: predictions of neural networks. A recent comparison of the properties of different normalization
L10595: schemes can be found in Lubana et al. (2021).
L10596: Why BatchNorm helps:
L10597: BatchNorm helps control the initial gradients in a residual network
L10598: (figure 11.6c).
L10599: However, the mechanism by which BatchNorm improves performance is not
L10600: well understood. The stated goal of Ioffe & Szegedy (2015) was to reduce problems caused
L10601: by internal covariate shift, which is the change in the distribution of inputs to a layer caused
L10602: by updating preceding layers during the backpropagation update. However, Santurkar et al.
L10603: (2018) provided evidence against this view by artificially inducing covariate shift and showing
L10604: that networks with and without BatchNorm performed equally well.
L10605: Motivated by this, they searched for another explanation for why BatchNorm should improve
L10606: performance. They showed empirically for the VGG network that adding batch normalization
L10607: decreases the variation in both the loss and its gradient as we move in the gradient direction.
L10608: In other words, the loss surface is both smoother and changes more slowly, which is why larger
L10609: learning rates are possible.
L10610: They also provide theoretical proofs for both these phenomena
L10611: and show that for any parameter initialization, the distance to the nearest optimum is less for
L10612: networks with batch normalization. Bjorck et al. (2018) also argue that BatchNorm improves
L10613: the properties of the loss landscape and allows larger learning rates.
L10614: Other explanations of why BatchNorm improves performance include decreasing the importance
L10615: of tuning the learning rate (Ioffe & Szegedy, 2015; Arora et al., 2018).
L10616: Indeed Li & Arora
L10617: (2019) show that using an exponentially increasing learning rate schedule is possible with batch
L10618: normalization. Ultimately, this is because batch normalization makes the network invariant to
L10619: the scales of the weight matrices (see Huszár, 2019, for an intuitive visualization).
L10620: Hoffer et al. (2017) identified that BatchNorm has a regularizing effect due to statistical fluc-
L10621: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L10624: <!-- page 219 -->
L10625: Notes
L10626: 205
L10627: tuations from the random composition of the batch. They proposed using a ghost batch size,
L10628: in which the mean and standard deviation statistics are computed from a subset of the batch.
L10629: Large batches can now be used without losing the regularizing effect of the extra noise in smaller
L10630: batch sizes. Luo et al. (2018) investigate the regularization effects of batch normalization.
L10631: Alternatives to batch normalization:
L10632: Although BatchNorm is widely used, it is not strictly
L10633: necessary to train deep residual nets; there are other ways of making the loss surface tractable.
L10634: Balduzzi et al. (2017) proposed the rescaling by
L10635: p
L10636: 1/2 in figure 11.6b; they argued that it
L10637: prevents gradient explosion but does not resolve the problem of shattered gradients.
L10638: Other work has investigated rescaling the function’s output in the residual block before adding
L10639: it back to the input. For example, De & Smith (2020) introduce SkipInit, in which a learnable
L10640: scalar multiplier is placed at the end of each residual branch. This helps if this multiplier is
L10641: initialized to less than
L10642: p
L10643: 1/K, where K is the number of residual blocks. In practice, they
L10644: suggest initializing this to zero. Similarly, Hayou et al. (2021) introduce Stable ResNet, which
L10645: rescales the output of the function in the kth residual block (before addition to the main branch)
L10646: by a constant λk. They prove that in the limit of infinite width, the expected gradient norm of
L10647: the weights in the first layer is lower bounded by the sum of squares of the scalings λk. They
L10648: investigate setting these to a constant
L10649: p
L10650: 1/K, where K is the number of residual blocks and
L10651: show that it is possible to train networks with up to 1000 blocks.
L10652: Zhang et al. (2019a) introduce FixUp, in which every layer is initialized using He normalization,
L10653: but the last linear/convolutional layer of every residual block is set to zero. Now the initial
L10654: forward pass is stable (since each residual block contributes nothing), and the gradients do not
L10655: explode in the backward pass (for the same reason). They also rescale the branches so that the
L10656: magnitude of the total expected change in the parameters is constant regardless of the number
L10657: of residual blocks. These methods allow training of deep residual networks but don’t usually
L10658: achieve the same test performance as when using BatchNorm. This is probably because they
L10659: do not benefit from the regularization induced by the noisy batch statistics. De & Smith (2020)
L10660: modify their method to induce regularization via dropout, which helps close this gap.
L10661: DenseNet and U-Net:
L10662: DenseNet was first introduced by Huang et al. (2017b), U-Net was
L10663: developed by Ronneberger et al. (2015), and stacked hourglass networks by Newell et al. (2016).
L10664: Of these architectures, U-Net has been the most extensively adapted. Çiçek et al. (2016) in-
L10665: troduced 3D U-Net, and Milletari et al. (2016) introduced V-Net, both of which extend U-Net
L10666: to process 3D data. Zhou et al. (2018) combine the ideas of DenseNet and U-Net in an archi-
L10667: tecture that downsamples and re-upsamples the image but also repeatedly uses intermediate
L10668: representations. U-Nets are commonly used in medical image segmentation (see Siddique et al.,
L10669: 2021, for a review). However, they have been applied to other areas, including depth estimation
L10670: (Garg et al., 2016), semantic segmentation (Iglovikov & Shvets, 2018), inpainting (Zeng et al.,
L10671: 2019), pansharpening (Yao et al., 2018), and image-to-image translation (Isola et al., 2017).
L10672: U-Nets are also a key component in diffusion models (chapter 18).
L10673: Problems
L10674: Problem 11.1 Derive equation 11.5 from the network definition in equation 11.4.
L10675: Problem 11.2 Unraveling the four-block network in figure 11.4a produces one path of length
L10676: zero, four paths of length one, six paths of length two, four paths of length three, and one path
L10677: of length four. How many paths of each length would there be with (i) three residual blocks
L10678: and (ii) five residual blocks? Deduce the rule for K residual blocks.
L10679: Problem 11.3 Show that the derivative of the network in equation 11.5 with respect to the first
L10680: layer f1[x] is given by equation 11.6.
L10681: Draft: please send errata to udlbookmail@gmail.com.
L10684: <!-- page 220 -->
L10685: 206
L10686: 11
L10687: Residual networks
L10688: Figure 11.15 Computational graph for batch normalization (see problem 11.5).
L10689: Problem 11.4∗Explain why the values in the two branches of the residual blocks in figure 11.6a
L10690: are uncorrelated. Show that the variance of the sum of uncorrelated variables is the sum of
L10691: their individual variances.
L10692: Problem 11.5∗The forward pass for batch normalization given a batch of scalar values {zi}I
L10693: i=1
L10694: consists of the following operations (figure 11.15):
L10695: f1 = E[zi]
L10696: f2i = zi −f1
L10697: f3i = f 2
L10698: 2i
L10699: f4 = E[f3i]
L10700: f5 =
L10701: p
L10702: f4 + ϵ
L10703: f6 = 1/f5
L10704: f7i = f2i × f6
L10705: z′
L10706: i = f7i × γ + δ,
L10707: (11.10)
L10708: where E[zi] =
L10709: 1
L10710: I
L10711: P
L10712: i zi. Write Python code to implement the forward pass. Now derive the
L10713: algorithm for the backward pass. Work backward through the computational graph computing
L10714: the derivatives to generate a set of operations that computes ∂z′
L10715: i/∂zi for every element in the
L10716: batch. Write Python code to implement the backward pass.
L10717: Problem 11.6 Consider a fully connected neural network with one input, one output, and ten
L10718: hidden layers, each of which contains twenty hidden units. How many parameters does this
L10719: network have? How many parameters will it have if we place a batch normalization operation
L10720: between each linear transformation and ReLU?
L10721: Problem 11.7∗Consider applying an L2 regularization penalty to the weights in the convolu-
L10722: tional layers in figure 11.7a, but not to the scaling parameters of the subsequent BatchNorm
L10723: layers. What do you expect will happen as training proceeds?
L10724: Problem 11.8 Consider a convolutional residual block that contains a batch normalization oper-
L10725: ation, followed by a ReLU activation function, and then a 3×3 convolutional layer. If the input
L10726: and output both have 512 channels, how many parameters are needed to define this block? Now
L10727: consider a bottleneck residual block that contains three batch normalization/ReLU/convolution
L10728: sequences. The first uses a 1×1 convolution to reduce the number of channels from 512 to 128.
L10729: The second uses a 3×3 convolution with the same number of input and output channels. The
L10730: third uses a 1×1 convolution to increase the number of channels from 128 to 512 (see fig-
L10731: ure 11.7b). How many parameters are needed to define this block?
L10732: Problem 11.9 The U-Net is completely convolutional and can be run with any sized image after
L10733: training. Why do we not train with a collection of arbitrarily-sized images?
L10734: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L10737: <!-- page 221 -->
L10738: Chapter 12
L10739: Transformers
L10740: Chapter 10 introduced convolutional networks, which are specialized for processing data
L10741: that lie on a regular grid. They are particularly suited to processing images, which have
L10742: a very large number of input variables, precluding the use of fully connected networks.
L10743: Each layer of a convolutional network employs parameter sharing so that local image
L10744: patches are processed similarly at every position in the image.
L10745: This chapter introduces transformers. These were initially targeted at natural lan-
L10746: guage processing (NLP) problems, where the network input is a series of high-dimensional
L10747: embeddings representing words or word fragments. Language datasets share some of the
L10748: characteristics of image data. The number of input variables can be very large, and the
L10749: statistics are similar at every position; it’s not sensible to re-learn the meaning of the
L10750: word dog at every possible position in a body of text. However, language datasets have
L10751: the complication that text sequences vary in length, and unlike images, there is no easy
L10752: way to resize them.
L10753: 12.1
L10754: Processing text data
L10755: To motivate the transformer, consider the following passage:
L10756: The restaurant refused to serve me a ham sandwich because it only cooks vegetarian
L10757: food. In the end, they just gave me two slices of bread. Their ambiance was just as good
L10758: as the food and service.
L10759: The goal is to design a network to process this text into a representation suitable for
L10760: downstream tasks. For example, it might be used to classify the review as positive or
L10761: negative or to answer questions such as “Does the restaurant serve steak?”.
L10762: We can make three immediate observations. First, the encoded input can be surpris-
L10763: ingly large. In this case, each of the 37 words might be represented by an embedding
L10764: vector of length 1024, so the encoded input would be of length 37 × 1024 = 37888 even
L10765: for this small passage. A more realistically sized body of text might have hundreds or
L10766: even thousands of words, so fully connected neural networks are impractical.
L10767: Draft: please send errata to udlbookmail@gmail.com.
L10770: <!-- page 222 -->
L10771: 208
L10772: 12
L10773: Transformers
L10774: Second, one of the defining characteristics of NLP problems is that each input (one or
L10775: more sentences) is of a different length; hence, it’s not even obvious how to apply a fully
L10776: connected network. These observations suggest that the network should share parameters
L10777: across words at different input positions, similarly to how convolutional networks share
L10778: parameters across different image positions.
L10779: Third, language is ambiguous; it is unclear from the syntax alone that the pronoun it
L10780: refers to the restaurant and not to the ham sandwich. To understand the text, the word
L10781: it should somehow be connected to the word restaurant. In the parlance of transformers,
L10782: the former word should pay attention to the latter. This implies that there must be
L10783: connections between the words and that the strength of these connections will depend
L10784: on the words themselves. Moreover, these connections need to extend across large text
L10785: spans. For example, the word their in the last sentence also refers to the restaurant.
L10786: 12.2
L10787: Dot-product self-attention
L10788: The previous section argued that a model for processing text will (i) use parameter
L10789: sharing to cope with long input passages of differing lengths and (ii) contain connections
L10790: between word representations that depend on the words themselves. The transformer
L10791: acquires both properties by using dot-product self-attention.
L10792: A standard neural network layer f[x], takes a D × 1 input x and applies a linear
L10793: transformation followed by an activation function like a ReLU, so:
L10794: f[x] = ReLU[β + Ωx],
L10795: (12.1)
L10796: where β contains the biases, and Ωcontains the weights.
L10797: A self-attention block sa[•] takes N inputs x1, . . . , xN, each of dimension D × 1, and
L10798: returns N outputs, each of which is also of size D ×1. In the context of NLP, each input
L10799: represents a word or word fragment. First, a set of values are computed for each input:
L10800: vm = βv + Ωvxm,
L10801: (12.2)
L10802: where βv ∈RD×1 and Ωv ∈RD×D represent biases and weights, respectively.
L10803: Then the nth output san[x1, . . . , xN] is a weighted sum of all the values v1, . . . , vN:
L10804: san[x1, . . . , xN] =
L10805: N
L10806: X
L10807: m=1
L10808: a[xm, xn]vm.
L10809: (12.3)
L10810: The scalar weight a[xm, xn] is the attention that the nth output pays to input xm. The N
L10811: weights a[•, xn] are non-negative and sum to one. Hence, self-attention can be thought
L10812: of as routing the values in different proportions to create each output (figure 12.1).
L10813: The following sections examine dot-product self-attention in more detail. First, we
L10814: consider the computation of the values and their subsequent weighting (equation 12.3).
L10815: Then we describe how to compute the attention weights a[xm, xn] themselves.
L10816: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L10819: <!-- page 223 -->
L10820: 12.2
L10821: Dot-product self-attention
L10822: 209
L10823: Figure 12.1 Self-attention as routing.
L10824: The self-attention mechanism takes N
L10825: inputs x1, . . . , xN ∈RD (here N = 3 and D = 4) and processes each separately
L10826: to compute N value vectors. The nth output san[x1, . . . xN] (written as san[x•]
L10827: for short) is then computed as a weighted sum of the N value vectors, where the
L10828: weights are positive and sum to one. a) Output sa1[x•] is computed as a[x1, x1] =
L10829: 0.1 times the first value vector, a[x2, x1] = 0.3 times the second value vector,
L10830: and a[x3, x1] = 0.6 times the third value vector. b) Output sa2[x•] is computed
L10831: in the same way, but this time with weights of 0.5, 0.2, and 0.3. c) The weighting
L10832: for output sa3[x•] is different again. Each output can hence be thought of as a
L10833: different routing of the N values.
L10834: 12.2.1
L10835: Computing and weighting values
L10836: Equation 12.2 shows that the same weights Ωv ∈RD×D and biases βv ∈RD are applied
L10837: to each input x• ∈RD. This computation scales linearly with the sequence length N,
L10838: so it needs fewer parameters than a fully connected network relating all DN inputs to
L10839: all DN values. In fact, the value computation can be viewed as a sparse matrix operation
L10840: with shared parameters that relates these DN quantities (figure 12.2b).
L10841: The attention weights a[xm, xn] combine the values from different inputs.
L10842: They
L10843: are also sparse since there is only one weight for each ordered pair of inputs (xm, xn),
L10844: regardless of the size of these inputs (figure 12.2c). It follows that the number of attention
L10845: weights has a quadratic dependence on the sequence length N, but is independent of the
L10846: length D of each input.
L10847: 12.2.2
L10848: Computing attention weights
L10849: In the previous section, we saw that the outputs result from two chained linear transfor-
L10850: mations; the value vectors βv + Ωvxm are computed independently for each input xm,
L10851: and these vectors are combined linearly by the attention weights a[xm, xn]. However,
L10852: the overall self-attention computation is nonlinear. As we’ll see shortly, the attention
L10853: weights are themselves nonlinear functions of the input. This is an example of a hyper-
L10854: network, where one network branch computes the weights of another. To compute the
L10855: Draft: please send errata to udlbookmail@gmail.com.
L10858: <!-- page 224 -->
L10859: 210
L10860: 12
L10861: Transformers
L10862: Figure 12.2 Self-attention for N =3 inputs xn, each with dimension D=4. a) Each
L10863: input xm is operated on independently by the same weights Ωv (same color equals
L10864: same weight) and biases βv (not shown) to form the values βv + Ωvxm. Each
L10865: output is a linear combination of the values, with the attention weight a[xm, xn]
L10866: defining the contribution of the mth value to the nth output. b) Matrix showing
L10867: block sparsity of linear transformation Ωv between inputs and values. c) Matrix
L10868: showing sparsity of attention weights relating values and outputs.
L10869: attention, we apply two more linear transformations to the inputs:
L10870: qn
L10871: =
L10872: βq + Ωqxn
L10873: km
L10874: =
L10875: βk + Ωkxm,
L10876: (12.4)
L10877: where {qn} and {km} are termed queries and keys, respectively. Then we compute dot
L10878: Appendix B.3.4
L10879: Dot product
L10880: products between the queries and keys and pass the results through a softmax function:
L10881: a[xm, xn]
L10882: =
L10883: softmaxm
L10884: 
L10885: kT
L10886: • qn
L10887: 
L10888: =
L10889: exp
L10890: 
L10891: kT
L10892: mqn
L10893: 
L10894: PN
L10895: m′=1 exp
L10896: 
L10897: kT
L10898: m′qn
L10899: ,
L10900: (12.5)
L10901: so for each xn, they are positive and sum to one (figure 12.3). For obvious reasons, this
L10902: is known as dot-product self-attention.
L10903: The names “queries” and “keys” were inherited from the field of information retrieval
L10904: and have the following interpretation: the dot product operation returns a measure of
L10905: similarity between its inputs, so the weights a[x•, xn] depend on the relative similarities
L10906: between the nth query and all of the keys. The softmax function means that the key
L10907: vectors “compete” with one another to contribute to the final result. The queries and
L10908: keys must have the same dimensions. However, these can differ from the dimension of
L10909: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L10912: <!-- page 225 -->
L10913: 12.2
L10914: Dot-product self-attention
L10915: 211
L10916: Figure 12.3 Computing attention weights. a) Query vectors qn = βq + Ωqxn
L10917: and key vectors kn = βk + Ωkxn are computed for each input xn. b) The dot
L10918: products between each query and the three keys are passed through a softmax
L10919: function to form non-negative attentions that sum to one. c) These route the
L10920: value vectors (figure 12.1) via the sparse matrix from figure 12.2c.
L10921: the values, which is usually the same size as the input, so the representation doesn’t
L10922: Problems 12.1–12.2
L10923: change size.
L10924: 12.2.3
L10925: Self-attention summary
L10926: The nth output is a weighted sum of the same linear transformation v• = βv + Ωvx•
L10927: applied to all of the inputs, where these attention weights are positive and sum to one.
L10928: The weights depend on a measure of similarity between input xn and the other inputs.
L10929: There is no activation function, but the mechanism is nonlinear due to the dot-product
L10930: and a softmax operation used to compute the attention weights.
L10931: Note that this mechanism fulfills the initial requirements. First, there is a single
L10932: shared set of parameters ϕ = {βv, Ωv, βq, Ωq, βk, Ωk}.
L10933: This is independent of the
L10934: Draft: please send errata to udlbookmail@gmail.com.
L10937: <!-- page 226 -->
L10938: 212
L10939: 12
L10940: Transformers
L10941: Figure 12.4 Self-attention in matrix form.
L10942: Self-attention can be implemented
L10943: eﬀiciently if we store the N input vectors xn in the columns of the D×N matrix X.
L10944: The input X is operated on separately by the query matrix Q, key matrix K, and
L10945: value matrix V. The dot products are then computed using matrix multiplication,
L10946: and a softmax operation is applied independently to each column of the resulting
L10947: matrix to calculate the attentions. Finally, the values are post-multiplied by the
L10948: attentions to create an output of the same size as the input.
L10949: number of inputs N, so the network can be applied to different sequence lengths. Second,
L10950: there are connections between the inputs (words), and the strength of these connections
L10951: depends on the inputs themselves via the attention weights.
L10952: 12.2.4
L10953: Matrix form
L10954: The above computation can be written in a compact form if the N inputs xn form the
L10955: columns of the D × N matrix X. The values, queries, and keys can be computed as:
L10956: V[X]
L10957: =
L10958: βv1T + ΩvX
L10959: Q[X]
L10960: =
L10961: βq1T + ΩqX
L10962: K[X]
L10963: =
L10964: βk1T + ΩkX,
L10965: (12.6)
L10966: where 1 is an N × 1 vector containing ones. The self-attention computation is then:
L10967: Sa[X] = V[X] · Softmax
L10968: h
L10969: K[X]T Q[X]
L10970: i
L10971: ,
L10972: (12.7)
L10973: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L10976: <!-- page 227 -->
L10977: 12.3
L10978: Extensions to dot-product self-attention
L10979: 213
L10980: Figure 12.5 Positional encodings.
L10981: The
L10982: self-attention architecture is equivariant
L10983: to permutations of the inputs.
L10984: To en-
L10985: sure that inputs at different positions are
L10986: treated differently, a positional encoding
L10987: matrix Π can be added to the data ma-
L10988: trix. Each column is different, so the po-
L10989: sitions can be distinguished. Here, the
L10990: position encodings use a predefined pro-
L10991: cedural sinusoidal pattern (which can be
L10992: extended to larger values of N if neces-
L10993: sary). However, in other cases, they are
L10994: learned.
L10995: where the function Softmax[•] takes a matrix and performs the softmax operation
L10996: independently on each of its columns (figure 12.4). In this formulation, we have explicitly
L10997: Notebook 12.1
L10998: Self-attention
L10999: included the dependence of the values, queries, and keys on the input X to emphasize
L11000: that self-attention computes a kind of triple product based on the inputs. However, from
L11001: now on, we will drop this dependence and just write:
L11002: Sa[X] = V · Softmax
L11003: h
L11004: KT Q
L11005: i
L11006: .
L11007: (12.8)
L11008: 12.3
L11009: Extensions to dot-product self-attention
L11010: In the previous section, we described self-attention. Here, we introduce three extensions
L11011: that are almost always used in practice.
L11012: 12.3.1
L11013: Positional encoding
L11014: Observant readers will have noticed that the self-attention mechanism overlooks impor-
L11015: Problem 12.3
L11016: tant information: the computation does not take into account the order of the inputs xn.
L11017: More precisely, it is equivariant with respect to input permutations. However, order is
L11018: important when the inputs correspond to the words in a sentence. The sentence The
L11019: woman ate the raccoon has a different meaning than The raccoon ate the woman. There
L11020: are two main approaches to incorporating position information.
L11021: Absolute positional encodings:
L11022: A matrix Π is added to the input X that encodes
L11023: positional information (figure 12.5). Each column of Π is unique and hence contains
L11024: information about the absolute position in the input sequence.
L11025: This matrix can be
L11026: chosen by hand or learned. It may be added to the network inputs or at every network
L11027: layer. Sometimes it is added to X in the computation of the queries and keys but not
L11028: to the values.
L11029: Draft: please send errata to udlbookmail@gmail.com.
L11032: <!-- page 228 -->
L11033: 214
L11034: 12
L11035: Transformers
L11036: Relative positional encodings:
L11037: The input to a self-attention mechanism may be an
L11038: entire sentence, many sentences, or just a fragment of a sentence, and the absolute
L11039: position of a word is much less important than the relative position between two words.
L11040: Of course, this can be recovered if the system knows the absolute position of both,
L11041: but relative positional encodings encode this information directly. Each element of the
L11042: attention matrix corresponds to a particular offset between key position a and query
L11043: position b. Relative positional encodings learn a parameter πa,b for each offset and use
L11044: this to modify the attention matrix by adding these values, multiplying by them, or
L11045: using them to alter the attention matrix in some other way.
L11046: 12.3.2
L11047: Scaled dot-product self-attention
L11048: The dot products in the attention computation can have large magnitudes and move
L11049: the arguments to the softmax function into a region where the largest value completely
L11050: dominates. Small changes to the inputs to the softmax function now have little effect on
L11051: Problem 12.4
L11052: the output (i.e., the gradients are very small), making the model diﬀicult to train. To
L11053: prevent this, the dot products are scaled by the square root of the dimension Dq of the
L11054: queries and keys (i.e., the number of rows in Ωq and Ωk, which must be the same):
L11055: Sa[X] = V · Softmax
L11056: "
L11057: KT Q
L11058: √
L11059: Dq
L11060: #
L11061: .
L11062: (12.9)
L11063: This is known as scaled dot-product self-attention.
L11064: 12.3.3
L11065: Multiple heads
L11066: Multiple self-attention mechanisms are usually applied in parallel, and this is known as
L11067: multi-head self-attention. Now H different sets of values, keys, and queries are computed:
L11068: Vh
L11069: =
L11070: βvh1T + ΩvhX
L11071: Qh
L11072: =
L11073: βqh1T + ΩqhX
L11074: Kh
L11075: =
L11076: βkh1T + ΩkhX.
L11077: (12.10)
L11078: The hth self-attention mechanism or head can be written as:
L11079: Sah[X] = Vh · Softmax
L11080: "
L11081: KT
L11082: h Qh
L11083: √
L11084: Dq
L11085: #
L11086: ,
L11087: (12.11)
L11088: where we have different parameters {βvh, Ωvh}, {βqh, Ωqh}, and {βkh, Ωkh} for each
L11089: head. Typically, if the dimension of the inputs xm is D and there are H heads, the values,
L11090: queries, and keys will all be of size D/H, as this allows for an eﬀicient implementation.
L11091: Problem 12.5
L11092: The outputs of these self-attention mechanisms are vertically concatenated, and another
L11093: linear transform Ωc is applied to combine them (figure 12.6):
L11094: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L11097: <!-- page 229 -->
L11098: 12.4
L11099: Transformer layers
L11100: 215
L11101: Figure 12.6 Multi-head self-attention.
L11102: Self-attention occurs in parallel across
L11103: multiple “heads.” Each has its own queries, keys, and values. Here two heads are
L11104: depicted, in the cyan and orange boxes, respectively. The outputs are vertically
L11105: concatenated, and another linear transformation Ωc is used to recombine them.
L11106: MhSa[X] = Ωc
L11107: h
L11108: Sa1[X]T , Sa2[X]T , . . . , SaH[X]T iT
L11109: .
L11110: (12.12)
L11111: Multiple heads seem to be necessary to make self-attention work well.
L11112: It has been
L11113: Notebook 12.2
L11114: Multi-head
L11115: self-attention
L11116: speculated that they make the self-attention network more robust to bad initializations.
L11117: 12.4
L11118: Transformer layers
L11119: Self-attention is just one part of a larger transformer layer. This consists of a multi-
L11120: head self-attention unit (which allows the word representations to interact with each
L11121: Draft: please send errata to udlbookmail@gmail.com.
