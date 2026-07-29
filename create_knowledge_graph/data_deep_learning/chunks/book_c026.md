L16365: <!-- page 333 -->
L16366: 16.5
L16367: Applications
L16368: 319
L16369: Figure 16.11 Modeling densities. a) Toy 2D data samples. b) Modeled density
L16370: using iResNet. c–d) Second example. Adapted from Behrmann et al. (2019)
L16371: networks are not probabilistic, and both variational autoencoders and diffusion models
L16372: can only return a lower bound on the likelihood.2 Figure 16.11 depicts the estimated
L16373: probability distributions in two toy problems using i-ResNet. One application of density
L16374: estimation is anomaly detection; the data distribution of a clean dataset is described
L16375: using a normalizing flow model.
L16376: New examples with low probability are flagged as
L16377: outliers. However, caution must be used as there may exist outliers with high probability
L16378: that don’t fall in the typical set (see figure 8.13).
L16379: 16.5.2
L16380: Synthesis
L16381: Generative flows, or GLOW, is a normalizing flow model that can create high-fidelity
L16382: images (figure 16.12) and uses many of the ideas from this chapter. It is easiest under-
L16383: stood in the normalizing direction. GLOW starts with a 256 × 256 × 3 tensor containing
L16384: an RGB image. It uses coupling layers, in which the channels are partitioned into two
L16385: halves. The second half is subject to a different aﬀine transform at each spatial position,
L16386: where the parameters of the aﬀine transformation are computed by a 2D convolutional
L16387: neural network run on the other half of the channels. The coupling layers are alternated
L16388: with 1 × 1 convolutions, parameterized as LU decompositions which mix the channels.
L16389: Periodically, the resolution is halved by combining each 2 × 2 patch into one position
L16390: with four times as many channels. GLOW is a multi-scale flow, and some of the channels
L16391: are periodically removed to become part of the latent vector z. Images are discrete (due
L16392: to the quantization of RGB values), so noise is added to the inputs to prevent the training
L16393: likelihood increasing without bound. This is known as dequantization.
L16394: To sample more realistic images, the GLOW model samples from the base density
L16395: raised to a positive power. This chooses examples that are closer to the center of the
L16396: density rather than from the tails.
L16397: This is similar to the truncation trick in GANs
L16398: 2The lower bound on the likelihood for diffusion models can actually exceed the exact computation
L16399: in normalizing flows, but data generation is much slower (see chapter 18).
L16400: Draft: please send errata to udlbookmail@gmail.com.
L16403: <!-- page 334 -->
L16404: 320
L16405: 16
L16406: Normalizing flows
L16407: Figure 16.12 Samples from GLOW trained on the CelebA HQ dataset (Karras
L16408: et al., 2018). The samples are of reasonable quality, although GANs and diffusion
L16409: models produce superior results. Adapted from Kingma & Dhariwal (2018).
L16410: Figure 16.13 Interpolation using GLOW model. The left and right images are real
L16411: people. The intermediate images were computed by projecting the real images to
L16412: the latent space, interpolating, and then projecting the interpolated points back
L16413: to image space. Adapted from Kingma & Dhariwal (2018).
L16414: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L16417: <!-- page 335 -->
L16418: 16.6
L16419: Summary
L16420: 321
L16421: (figure 15.10). Notably, the samples are not as good as those from GANs or diffusion
L16422: models. It is unknown whether this is due to a fundamental restriction associated with
L16423: invertible layers or merely because less research effort has been invested in this goal.
L16424: Figure 16.13 shows an example of interpolation using GLOW. Two latent vectors are
L16425: computed by transforming two real images in the normalizing direction. Intermediate
L16426: points between these latent vectors are computed by linear interpolation, and these are
L16427: projected back to image space using the network in the generative direction. The result
L16428: is a set of images that interpolate realistically between the two real ones.
L16429: 16.5.3
L16430: Approximating other density models
L16431: Normalizing flows can also learn to generate samples that approximate an existing density
L16432: which is easy to evaluate but diﬀicult to sample from. In this context, we denote the
L16433: normalizing flow Pr(x|ϕ) as the student and the target density q(x) as the teacher.
L16434: To make progress, we generate samples xi = f[zi, ϕ] from the student.
L16435: Since we
L16436: generated these samples ourselves, we know their corresponding latent variables zi, and
L16437: we can calculate their likelihood in the student model without inversion. Thus, we can
L16438: use a model like a masked-autoregressive flow where inversion is slow. We define a loss
L16439: function based on the reverse KL divergence that encourages the student and teacher
L16440: likelihood to be identical and use this to train the student model (figure 16.14):
L16441: Problem 16.11
L16442: ˆϕ = argmin
L16443: ϕ
L16444: "
L16445: KL
L16446: "
L16447: 1
L16448: I
L16449: I
L16450: X
L16451: i=1
L16452: δ
L16453: 
L16454: x −f[zi, ϕ]
L16455: 
L16464: q(x)
L16465: ##
L16466: .
L16467: (16.25)
L16468: This approach contrasts with the typical use of normalizing flows to build a proba-
L16469: bility model Pr(xi, ϕ) of data that came from an unknown distribution with samples xi
L16470: using maximum likelihood, which relies on the cross-entropy term from the forward KL
L16471: divergence (section 5.7):
L16472: ˆϕ = argmin
L16473: ϕ
L16474: "
L16475: KL
L16476: "
L16477: 1
L16478: I
L16479: I
L16480: X
L16481: i=1
L16482: δ[x −xi]
L16492: Pr(xi, ϕ)
L16493: ##
L16494: .
L16495: (16.26)
L16496: Normalizing flows can model the posterior in VAEs using this trick (see chapter 17).
L16497: 16.6
L16498: Summary
L16499: Normalizing flows transform a base distribution (usually a normal distribution) to create
L16500: a new density.
L16501: They have the advantage that they can both evaluate the likelihood
L16502: of samples exactly and generate new samples.
L16503: However, they have the architectural
L16504: constraint that each layer must be invertible; we need the forward transformation to
L16505: generate samples and the backward transformation to evaluate the likelihoods.
L16506: It’s also important that the Jacobian can be estimated eﬀiciently to evaluate the
L16507: likelihood; this must be done repeatedly to learn the density. However, invertible layers
L16508: Draft: please send errata to udlbookmail@gmail.com.
L16511: <!-- page 336 -->
L16512: 322
L16513: 16
L16514: Normalizing flows
L16515: Figure 16.14 Approximating density models. a) Training data. b) Usually, we
L16516: modify the flow model parameters to minimize the KL divergence from the train-
L16517: ing data to the flow model.
L16518: This is equivalent to maximum likelihood fitting
L16519: (section 5.7). c) Alternatively, we can modify the flow parameters ϕ to minimize
L16520: the KL divergence from the flow samples xi = f[zi, ϕ] to d) a target density.
L16521: are still useful in their own right even when the Jacobian cannot be estimated eﬀiciently;
L16522: they reduce the memory requirements of training a K-layer network from O[K] to O[1].
L16523: This chapter reviewed invertible network layers or flows. We considered linear flows
L16524: and elementwise flows, which are simple but insuﬀiciently expressive. Then we described
L16525: more complex flows, such as coupling, autoregressive, and residual flows. Finally, we
L16526: showed how normalizing flows can be used to estimate likelihoods, generate and inter-
L16527: polate between images, and approximate other distributions.
L16528: Notes
L16529: Normalizing flows were first introduced by Rezende & Mohamed (2015) but had intellectual
L16530: antecedents in the work of Tabak & Vanden-Eijnden (2010), Tabak & Turner (2013), and
L16531: Rippel & Adams (2013). Reviews of normalizing flows can be found in Kobyzev et al. (2020)
L16532: and Papamakarios et al. (2021). Kobyzev et al. (2020) presented a quantitative comparison of
L16533: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L16536: <!-- page 337 -->
L16537: Notes
L16538: 323
L16539: many normalizing flow approaches. They concluded that the Flow++ model (a coupling flow
L16540: with a novel elementwise transformation and other innovations) performed best at the time.
L16541: Invertible network layers:
L16542: Invertible layers decrease the memory requirements of the back-
L16543: propagation algorithm; the activations in the forward pass no longer need to be stored since
L16544: they can be recomputed in the backward pass. In addition to the regular network layers and
L16545: residual layers (Gomez et al., 2017; Jacobsen et al., 2018) discussed in this chapter, invertible
L16546: layers have been developed for graph neural networks (Li et al., 2021a), recurrent neural net-
L16547: works (MacKay et al., 2018), masked convolutions (Song et al., 2019), U-Nets (Brügger et al.,
L16548: 2019; Etmann et al., 2020), and transformers (Mangalam et al., 2022).
L16549: Radial and planar flows:
L16550: The original normalizing flows paper (Rezende & Mohamed, 2015)
L16551: used planar flows (which contract or expand the distribution along certain dimensions) and
L16552: radial flows (which expand or contract around a certain point). Inverses for these flows can’t
L16553: be computed easily, but they are useful for approximating distributions where sampling is slow
L16554: or where the likelihood can only be evaluated up to an unknown scaling factor (figure 16.14).
L16555: Applications:
L16556: Applications include image generation (Ho et al., 2019; Kingma & Dhariwal,
L16557: 2018), noise modeling (Abdelhamed et al., 2019), video generation (Kumar et al., 2019b), au-
L16558: dio generation (Esling et al., 2019; Kim et al., 2018; Prenger et al., 2019), graph generation
L16559: (Madhawa et al., 2019), image classification (Kim et al., 2021; Mackowiak et al., 2021), im-
L16560: age steganography (Lu et al., 2021), super-resolution (Yu et al., 2020; Wolf et al., 2021; Liang
L16561: et al., 2021), style transfer (An et al., 2021), motion style transfer (Wen et al., 2021), 3D shape
L16562: modeling (Paschalidou et al., 2021), compression (Zhang et al., 2021b), sRGB to RAW image
L16563: conversion (Xing et al., 2021), denoising (Liu et al., 2021b), anomaly detection (Yu et al., 2021),
L16564: image-to-image translation (Ardizzone et al., 2020), synthesizing cell microscopy images under
L16565: different molecular interventions (Yang et al., 2021), and light transport simulation (Müller
L16566: et al., 2019b). For applications using image data, noise must be added before learning since the
L16567: inputs are quantized and hence discrete (see Theis et al., 2016).
L16568: Rezende & Mohamed (2015) used normalizing flows to model the posterior in VAEs. Abdal
L16569: et al. (2021) used normalizing flows to model the distribution of attributes in the latent space of
L16570: StyleGAN and then used these distributions to change specified attributes in real images. Wolf
L16571: et al. (2021) use normalizing flows to learn the conditional image of a noisy input image given a
L16572: clean one and hence simulate noisy data that can be used to train denoising or super-resolution
L16573: models.
L16574: Normalizing flows have also found diverse uses in physics (Kanwar et al., 2020; Köhler et al.,
L16575: 2020; Noé et al., 2019; Wirnsberger et al., 2020; Wong et al., 2020), natural language processing
L16576: (Tran et al., 2019; Ziegler & Rush, 2019; Zhou et al., 2019; He et al., 2018; Jin et al., 2019), and
L16577: reinforcement learning (Schroecker et al., 2019; Haarnoja et al., 2018a; Mazoure et al., 2020;
L16578: Ward et al., 2019; Touati et al., 2020).
L16579: Linear flows:
L16580: Diagonal linear flows can represent normalization transformations like Batch-
L16581: Norm (Dinh et al., 2016) and ActNorm (Kingma & Dhariwal, 2018). Tomczak & Welling (2016)
L16582: investigated combining triangular matrices and using orthogonal transformations parameterized
L16583: by the Householder transform. Kingma & Dhariwal (2018) proposed the LU parameterization
L16584: described in section 16.5.2. Hoogeboom et al. (2019b) proposed using the QR decomposition
L16585: instead, which does not require predetermined permutation matrices.
L16586: Convolutions are lin-
L16587: ear transformations (figure 10.4) that are widely used in deep learning, but their inverse and
L16588: determinant are not straightforward to compute. Kingma & Dhariwal (2018) used 1×1 con-
L16589: volutions, which is effectively a full linear transformation applied separately at each position.
L16590: Zheng et al. (2017) introduced ConvFlow, which was restricted to 1D convolutions. Hoogeboom
L16591: et al. (2019b) provided more general solutions for modeling 2D convolutions either by stacking
L16592: together masked autoregressive convolutions or by operating in the Fourier domain.
L16593: Draft: please send errata to udlbookmail@gmail.com.
L16596: <!-- page 338 -->
L16597: 324
L16598: 16
L16599: Normalizing flows
L16600: Elementwise flows and coupling functions:
L16601: Elementwise flows transform each variable
L16602: independently using the same function (but with different parameters for each variable). The
L16603: same flows can be used to form the coupling functions in coupling and autoregressive flows, in
L16604: which case their parameters depend on the preceding variables. To be invertible, these functions
L16605: must be monotone.
L16606: An additive coupling function (Dinh et al., 2015) just adds an offset to the variable. Aﬀine
L16607: coupling functions scale the variable and add an offset and were used by Dinh et al. (2015),
L16608: Dinh et al. (2016), Kingma & Dhariwal (2018), Kingma et al. (2016), and Papamakarios et al.
L16609: (2017). Ziegler & Rush (2019) propose the nonlinear squared flow, which is an invertible ratio
L16610: of polynomials with five parameters.
L16611: Continuous mixture CDFs (Ho et al., 2019) apply a
L16612: monotone transformation based on the cumulative density function (CDF) of a mixture of K
L16613: logistics, post-composed by an inverse logistic sigmoid, scaled, and offset.
L16614: The piecewise linear coupling function (figure 16.5) was developed by Müller et al. (2019b).
L16615: Since then, systems based on cubic splines (Durkan et al., 2019a) and rational quadratic splines
L16616: (Durkan et al., 2019b) have been proposed. Huang et al. (2018a) introduced neural autoregres-
L16617: sive flows, in which the function is represented by a neural network that produces a monotonic
L16618: function. A suﬀicient condition is that the weights are all positive and the activation functions
L16619: are monotone. It is hard to train a network with the constraint that the weights are positive, so
L16620: this led to unconstrained monotone neural networks (Wehenkel & Louppe, 2019), which model
L16621: strictly positive functions and then integrate them numerically to get a monotone function.
L16622: Jaini et al. (2019) construct positive functions that can be integrated in closed form based on a
L16623: classic result that all positive single-variable polynomials are the sum of squares of polynomials.
L16624: Finally, Dinh et al. (2019) investigated piecewise monotonic coupling functions.
L16625: Coupling flows:
L16626: Dinh et al. (2015) introduced coupling flows in which the dimensions were
L16627: split in half (figure 16.6). Dinh et al. (2016) introduced RealNVP, which partitioned the image
L16628: input by taking alternating pixels or blocks of channels. Das et al. (2019) proposed selecting
L16629: features for the propagated part based on the magnitude of the derivatives. Dinh et al. (2016)
L16630: interpreted multi-scale flows (in which dimensions are gradually introduced) as coupling flows in
L16631: which the parameters ϕ have no dependence on the other half of the data. Kruse et al. (2021)
L16632: introduce a hierarchical formulation of coupling flows in which each partition is recursively
L16633: divided into two. GLOW (figures 16.12–16.13) was designed by Kingma & Dhariwal (2018) and
L16634: uses coupling flows, as do NICE (Dinh et al., 2015), RealNVP (Dinh et al., 2016), FloWaveNet
L16635: (Kim et al., 2018), WaveGlOW (Prenger et al., 2019), and Flow++ (Ho et al., 2019).
L16636: Autoregressive flows:
L16637: Kingma et al. (2016) used autoregressive models for normalizing flows.
L16638: Germain et al. (2015) developed a general method for masking previous variables. This was
L16639: exploited by Papamakarios et al. (2017) to compute all of the outputs in the forward direction
L16640: simultaneously in masked autoregressive flows. Kingma et al. (2016) introduced the inverse
L16641: autoregressive flow. Parallel WaveNet (Van den Oord et al., 2018) distilled WaveNet (Van den
L16642: Oord et al., 2016a), which is a different type of generative model for audio, into an inverse
L16643: autoregressive flow so that sampling would be fast (see figure 16.14c–d).
L16644: Residual flows:
L16645: Residual flows are based on residual networks (He et al., 2016a). RevNets
L16646: (Gomez et al., 2017) and iRevNets (Jacobsen et al., 2018) divide the input into two sections
L16647: (figure 16.8), each of which passes through a residual network. These networks are invertible,
L16648: but the determinant of the Jacobian cannot be computed easily. The residual connection can
L16649: be interpreted as the discretization of an ordinary differential equation, and this perspective led
L16650: to different invertible architectures (Chang et al., 2018, 2019a). However, the Jacobian of these
L16651: networks could still not be computed eﬀiciently. Behrmann et al. (2019) noted that the network
L16652: can be inverted using fixed point iterations if its Lipschitz constant is less than one. This led to
L16653: iResNet, in which the log determinant of the Jacobian can be estimated using Hutchinson’s trace
L16654: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L16657: <!-- page 339 -->
L16658: Notes
L16659: 325
L16660: estimator (Hutchinson, 1989). Chen et al. (2019) removed the bias induced by the truncation
L16661: of the power series in equation 16.22 by using the Russian Roulette estimator.
L16662: Infinitesimal flows:
L16663: If residual networks can be viewed as a discretization of an ordinary
L16664: differential equation (ODE), then the next logical step is to represent the change in the variables
L16665: directly by an ODE. The neural ODE was explored by Chen et al. (2018e) and exploits standard
L16666: methods for forward and backward propagation in ODEs. The Jacobian is no longer required
L16667: to compute the likelihood; this is represented by a different ODE in which the change in log
L16668: probability is related to the trace of the derivative of the forward propagation.
L16669: Grathwohl
L16670: et al. (2019) used the Hutchinson estimator to estimate the trace and simplified this further.
L16671: Finlay et al. (2020) added regularization terms to the loss function that make training easier,
L16672: and Dupont et al. (2019) augmented the representation to allow the neural ODE to represent
L16673: a broader class of diffeomorphisms. Tzen & Raginsky (2019) and Peluchetti & Favaro (2020)
L16674: replaced the ODEs with stochastic differential equations.
L16675: Universality:
L16676: The universality property refers to the ability of a normalizing flow to model
L16677: any probability distribution arbitrarily well. Some flows (e.g., planar, elementwise) do not have
L16678: this property. Autoregressive flows can be shown to have the universality property when the
L16679: coupling function is a neural monotone network (Huang et al., 2018a), based on monotone
L16680: polynomials (Jaini et al., 2020) or based on splines (Kobyzev et al., 2020). For dimension D,
L16681: a series of D coupling flows can form an autoregressive flow. To understand why, note that
L16682: the partitioning into two parts h1 and h2 means that at any given layer h2 depends only on
L16683: the previous variables (figure 16.6). Hence, if we increase the size of h1 by one at every layer,
L16684: we can reproduce an autoregressive flow, and the result is universal. It is not known whether
L16685: coupling flows can be universal with fewer than D layers. However, they work well in practice
L16686: (e.g., GLOW) without the need for this induced autoregressive structure.
L16687: Other work:
L16688: Active areas of research in normalizing flows include the investigation of discrete
L16689: flows (Hoogeboom et al., 2019a; Tran et al., 2019), normalizing flows on non-Euclidean manifolds
L16690: (Gemici et al., 2016; Wang & Wang, 2019), and equivariant flows (Köhler et al., 2020; Rezende
L16691: et al., 2019) which aim to create densities that are invariant to families of transformations.
L16692: Problems
L16693: Problem 16.1 Consider transforming a uniform base density defined on z ∈[0, 1] using the
L16694: function x = f[z] = z2. Find an expression for the transformed distribution Pr(x).
L16695: Problem 16.2∗Consider transforming a standard normal distribution:
L16696: Pr(z) =
L16697: 1
L16698: √
L16699: 2π
L16700: exp
L16701: −z2
L16702: 2
L16703: 
L16704: ,
L16705: (16.27)
L16706: with the function:
L16707: x = f[z] =
L16708: 1
L16709: 1 + exp[−z].
L16710: (16.28)
L16711: Find an expression for the transformed distribution Pr(x).
L16712: Problem 16.3∗Write expressions for the Jacobian of the inverse mapping z = f−1[x, ϕ] and the
L16713: absolute determinant of that Jacobian in forms similar to equations 16.6 and 16.7.
L16714: Draft: please send errata to udlbookmail@gmail.com.
L16717: <!-- page 340 -->
L16718: 326
L16719: 16
L16720: Normalizing flows
L16721: Problem 16.4 Compute the inverse and the determinant of the following matrices by hand:
L16722: Ω1 =
L16723: 
L16724: 
L16725: 2
L16726: 0
L16727: 0
L16728: 0
L16729: 0
L16730: −5
L16731: 0
L16732: 0
L16733: 0
L16734: 0
L16735: 1
L16736: 0
L16737: 0
L16738: 0
L16739: 0
L16740: 2
L16741: 
L16742: 
L16743: Ω2 =
L16744: 
L16745: 
L16746: 1
L16747: 0
L16748: 0
L16749: 0
L16750: 2
L16751: 4
L16752: 0
L16753: 0
L16754: 1
L16755: −1
L16756: 2
L16757: 0
L16758: 4
L16759: −2
L16760: −2
L16761: 1
L16762: 
L16763: .
L16764: (16.29)
L16765: Problem 16.5 Consider a random variable z with mean µ and covariance Σ that is transformed
L16766: as x = Az + b. Show that the expected value of x is Aµ + b and that the covariance of x is
L16767: AΣAT .
L16768: Problem 16.6∗Prove that if x = f[z] = Az + b and Pr(z) = Normz[µ, Σ], then Pr(x) =
L16769: Normx[Aµ + b, AΣAT ] using the relation:
L16770: Pr(x) = Pr(z) ·
L16776: ∂f[z]
L16777: ∂z
L16783: −1
L16784: .
L16785: (16.30)
L16786: Problem 16.7 The Leaky ReLU is defined as:
L16787: LReLU[z] =
L16788: (
L16789: 0.1z
L16790: z < 0
L16791: z
L16792: z ≥0 .
L16793: (16.31)
L16794: Write an expression for the inverse of the leaky ReLU. Write an expression for the inverse
L16795: absolute determinant of the Jacobian |∂f[z]/∂z|−1 for an elementwise transformation x = f[z]
L16796: of the multivariate variable z where:
L16797: f[z] =
L16798: h
L16799: LReLU[z1], LReLU[z2], . . . , LReLU[zD]
L16800: iT
L16801: .
L16802: (16.32)
L16803: Problem 16.8 Consider applying the piecewise linear function f[h, ϕ] defined in equation 16.12
L16804: for the domain h′ ∈[0, 1] elementwise to an input h = [h1, h2, . . . , hD]T so that f[h] =
L16805: [f[h1, ϕ], f[h2, ϕ], . . . , f[hD, ϕ]].
L16806: What is the Jacobian ∂f[h]/∂h?
L16807: What is the determinant of
L16808: the Jacobian?
L16809: Problem 16.9∗Consider constructing an element-wise flow based on a conical combination of
L16810: square root functions in equally spaced bins:
L16811: h′ = f[h, ϕ] =
L16812: p
L16813: [Kh −b + 1] ϕb +
L16814: b−1
L16815: X
L16816: k=1
L16817: p
L16818: ϕk,
L16819: (16.33)
L16820: where b = ⌊Kh⌋+ 1 is the bin that h falls into, and the parameters ϕk are positive, and sum to
L16821: one. Consider the case where K = 5 and ϕ1 = 0.1, ϕ2 = 0.2, ϕ3 = 0.5, ϕ4 = 0.1, ϕ5 = 0.1. Draw
L16822: the function f[h, ϕ]. Draw the inverse function f−1[h′, ϕ].
L16823: Problem 16.10 Draw the structure of the Jacobian (indicating which elements are zero) for the
L16824: forward mapping of the residual flow in figure 16.8 for the cases where f1[•, ϕ1] and f2[•, ϕ2] are
L16825: (i) a fully connected neural network, (ii) an elementwise flow.
L16826: Problem 16.11∗Write out the expression for the KL divergence in equation 16.25. Why does
L16827: it not matter if we can only evaluate the probability q(x) up to a scaling factor κ? Does the
L16828: network have to be invertible to minimize this loss function? Explain your reasoning.
L16829: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L16832: <!-- page 341 -->
L16833: Chapter 17
L16834: Variational autoencoders
L16835: Generative adversarial networks learn a mechanism for creating samples that cannot
L16836: be distinguished from the training examples {xi}. In contrast, like normalizing flows,
L16837: variational autoencoders, or VAEs, are probabilistic generative models; they aim to learn
L16838: a distribution Pr(x) over the data (see figure 14.2). After training, it is possible to draw
L16839: (generate) samples from this distribution. However, the properties of the VAE mean that
L16840: it is unfortunately not possible to evaluate the probability of new examples x∗exactly.
L16841: It is common to talk about the VAE as if it is the model of Pr(x), but this is mislead-
L16842: ing; the VAE is a neural architecture that is designed to help learn the model for Pr(x).
L16843: The final model for Pr(x) contains neither the “variational” nor the “autoencoder” parts
L16844: and might be better described as a nonlinear latent variable model.
L16845: This chapter starts by introducing latent variable models in general and then con-
L16846: siders the specific case of the nonlinear latent variable model. It will become clear that
L16847: maximum likelihood learning of this model is not straightforward. Nevertheless, it is
L16848: possible to define a lower bound on the likelihood, and the VAE architecture approxi-
L16849: mates this bound using a Monte Carlo (sampling) method. The chapter concludes by
L16850: presenting several applications of the VAE.
L16851: 17.1
L16852: Latent variable models
L16853: Latent variable models take an indirect approach to describing a probability distribu-
L16854: tion Pr(x) over a multi-dimensional variable x. Instead of directly writing the expression
L16855: for Pr(x), they model a joint distribution Pr(x, z) of the data x and an unobserved hid-
L16856: Appendix C.1.2
L16857: Marginalization
L16858: den or latent variable z. They then describe the probability of Pr(x) as a marginalization
L16859: of this joint probability so that:
L16860: Pr(x) =
L16861: Z
L16862: Pr(x, z)dz.
L16863: (17.1)
L16864: Typically, the joint probability Pr(x, z) is broken down using the rules of conditional
L16865: Appendix C.1.3
L16866: Conditional
L16867: probability
L16868: probability into the likelihood of the data with respect to the latent variables term Pr(x|z)
L16869: and the prior Pr(z):
L16870: Draft: please send errata to udlbookmail@gmail.com.
L16873: <!-- page 342 -->
L16874: 328
L16875: 17
L16876: Variational autoencoders
L16877: Pr(x) =
L16878: Z
L16879: Pr(x|z)Pr(z)dz.
L16880: (17.2)
L16881: This is a rather indirect approach to describing Pr(x), but it is useful because relatively
L16882: simple expressions for Pr(x|z) and Pr(z) can define complex distributions Pr(x).
L16883: 17.1.1
L16884: Example: mixture of Gaussians
L16885: In a 1D mixture of Gaussians (figure 17.1a), the latent variable z is discrete, and the
L16886: prior Pr(z) is a categorical distribution (figure 5.9) with one probability λn for each
L16887: Problem 17.1
L16888: possible value of z. The likelihood Pr(x|z = n) of the data x given that the latent
L16889: variable z takes value n is normally distributed with mean µn and variance σ2
L16890: n:
L16891: Pr(z = n)
L16892: =
L16893: λn
L16894: Pr(x|z = n)
L16895: =
L16896: Normx
L16897: 
L16898: µn, σ2
L16899: n
L16900: 
L16901: .
L16902: (17.3)
L16903: As in equation 17.2, the probability Pr(x) is given by the marginalization over the latent
L16904: variable z (figure 17.1b). Here, the latent variable is discrete, so we sum over its possible
L16905: values to marginalize:
L16906: Pr(x)
L16907: =
L16908: N
L16909: X
L16910: n=1
L16911: Pr(x, z = n)
L16912: =
L16913: N
L16914: X
L16915: n=1
L16916: Pr(x|z = n) · Pr(z = n)
L16917: =
L16918: N
L16919: X
L16920: n=1
L16921: λn · Normx
L16922: 
L16923: µn, σ2
L16924: n
L16925: 
L16926: .
L16927: (17.4)
L16928: From simple expressions for the likelihood and prior, we describe a complex multi-modal
L16929: probability distribution.
L16930: 17.2
L16931: Nonlinear latent variable model
L16932: In the nonlinear latent variable model, both the data x and the latent variable z are
L16933: Appendix C.3.2
L16934: Multivariate
L16935: normal
L16936: continuous and multivariate. The prior Pr(z) is a standard multivariate normal:
L16937: Pr(z) = Normz[0, I].
L16938: (17.5)
L16939: The likelihood Pr(x|z, ϕ) is also normally distributed; its mean is a nonlinear func-
L16940: tion f[z, ϕ] of the latent variable, and its covariance σ2I is spherical:
L16941: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L16944: <!-- page 343 -->
L16945: 17.2
L16946: Nonlinear latent variable model
L16947: 329
L16948: Figure 17.1 Mixture of Gaussians (MoG). a) The MoG describes a complex
L16949: probability distribution (cyan curve) as a weighted sum of Gaussian components
L16950: (dashed curves). b) This sum is the marginalization of the joint density Pr(x, z)
L16951: between the continuous observed data x and a discrete latent variable z.
L16952: Pr(x|z, ϕ) = Normx
L16953: h
L16954: f[z, ϕ], σ2I
L16955: i
L16956: .
L16957: (17.6)
L16958: The function f[z, ϕ] is described by a deep network with parameters ϕ. The latent vari-
L16959: able z is lower dimensional than the data x. The model f[z, ϕ] describes the important
L16960: aspects of the data, and the remaining unmodeled aspects are ascribed to the noise σ2I.
L16961: Notebook 17.1
L16962: Latent variable
L16963: models
L16964: The data probability Pr(x|ϕ) is found by marginalizing over the latent variable z:
L16965: Pr(x|ϕ)
L16966: =
L16967: Z
L16968: Pr(x, z|ϕ)dz
L16969: =
L16970: Z
L16971: Pr(x|z, ϕ) · Pr(z)dz
L16972: =
L16973: Z
L16974: Normx
L16975: h
L16976: f[z, ϕ], σ2I
L16977: i
L16978: · Normz [0, I] dz.
L16979: (17.7)
L16980: This can be viewed as an infinite weighted sum (i.e., an infinite mixture) of spherical
L16981: Gaussians with different means, where the weights are Pr(z) and the means are the
L16982: network outputs f[z, ϕ] (figure 17.2).
L16983: 17.2.1
L16984: Generation
L16985: A new example x∗can be generated using ancestral sampling (figure 17.3). We draw z∗
L16986: Appendix C.4.2
L16987: Ancestral sampling
L16988: from the prior Pr(z) and pass this through the network f[z∗, ϕ] to compute the mean of
L16989: the likelihood Pr(x|z∗, ϕ) (equation 17.6), from which we draw x∗. Both the prior and
L16990: likelihood are normal distributions, so this is straightforward.
L16991: Draft: please send errata to udlbookmail@gmail.com.
L16994: <!-- page 344 -->
L16995: 330
L16996: 17
L16997: Variational autoencoders
L16998: Figure 17.2 Nonlinear latent variable model. A complex 2D density Pr(x) (right)
L16999: is created as the marginalization of the joint distribution Pr(x, z) (left) over the
L17000: latent variable z; to create Pr(x), we integrate the 3D volume over the dimen-
L17001: sion z. For each z, the distribution over x is a spherical Gaussian (two slices
L17002: shown) with a mean f[z, ϕ] that is a nonlinear function of z and depends on
L17003: parameters ϕ. The distribution Pr(x) is a weighted sum of these Gaussians.
L17004: Figure 17.3 Generation from nonlinear latent variable model. a) We draw a sam-
L17005: ple z∗from the prior probability Pr(z) over the latent variable. b) A sample x∗
L17006: is then drawn from Pr(x|z∗, ϕ). This is a spherical Gaussian with a mean that
L17007: is a nonlinear function f[•, ϕ] of z∗and a fixed variance σ2I. c) If we repeat this
L17008: process many times, we recover the density Pr(x|ϕ).
L17009: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L17012: <!-- page 345 -->
L17013: 17.3
L17014: Training
L17015: 331
L17016: Figure 17.4 Jensen’s inequality (discrete
L17017: case).
L17018: The logarithm (black curve) is
L17019: a concave function;
L17020: you can draw a
L17021: straight line between any two points on
L17022: the curve, and this line will always lie un-
L17023: derneath it. It follows that any convex
L17024: combination (weighted sum with posi-
L17025: tive weights that sum to one) of the six
L17026: points on the log function must lie in
L17027: the gray region under the curve. Here,
L17028: we have weighted the points equally (i.e.,
L17029: taken the mean) to yield the cyan point.
L17030: Since this point lies below the curve,
L17031: log[E[y]] > E[log[y]].
L17032: 17.3
L17033: Training
L17034: To train the model, we maximize the log-likelihood over a training dataset {xi}I
L17035: i=1 with
L17036: respect to the model parameters. For simplicity, we assume that the variance term σ2
L17037: in the likelihood expression is known and concentrate on learning ϕ:
L17038: ˆϕ
L17039: =
L17040: argmax
L17041: ϕ
L17042: " I
L17043: X
L17044: i=1
L17045: log
L17046: h
L17047: Pr(xi|ϕ)
L17048: i#
L17049: ,
L17050: (17.8)
L17051: where:
L17052: Pr(xi|ϕ)
L17053: =
L17054: Z
L17055: Normxi[f[z, ϕ], σ2I] · Normz[0, I]dz.
L17056: (17.9)
L17057: Unfortunately, this is intractable. There is no closed-form expression for the integral and
L17058: no easy way to evaluate it for a particular value of x.
L17059: 17.3.1
L17060: Evidence lower bound (ELBO)
L17061: To make progress, we define a lower bound on the log-likelihood. This is a function that is
L17062: always less than or equal to the log-likelihood for a given value of ϕ and will also depend
L17063: on some other parameters θ. Eventually, we will build a network to compute this lower
L17064: bound and optimize it. To define this lower bound, we need Jensen’s inequality.
L17065: 17.3.2
L17066: Jensen’s inequality
L17067: Jensen’s inequality says that a concave function g[•] of the expectation of data y is
L17068: greater than or equal to the expectation of the function of the data:
L17069: Appendix B.1.2
L17070: Concave functions
L17071: Draft: please send errata to udlbookmail@gmail.com.
L17074: <!-- page 346 -->
L17075: 332
L17076: 17
L17077: Variational autoencoders
L17078: Figure 17.5 Jensen’s inequality (continuous case). For a concave function, com-
L17079: puting the expectation of a distribution Pr(y) and passing it through the function
L17080: gives a result greater than or equal to transforming the variable y by the function
L17081: and then computing the expectation of the new variable. In the case of the loga-
L17082: rithm, we have log[E[y]] ≥E[log[y]]. The left-hand side of the figure corresponds
L17083: to the left-hand side of this inequality and the right-hand side of the figure to
L17084: the right-hand side. One way of thinking about this is to consider that we are
L17085: taking a convex combination of the points in the orange distribution defined over
L17086: y ∈[0, 1]. By the logic of figure 17.4, this must lie under the curve. Alternatively,
L17087: we can think about the concave function as compressing the high values of y
L17088: relative to the low values, so the expected value is lower when we pass y through
L17089: the function first.
L17090: g[E[y]] ≥E
L17091: 
L17092: g[y]
L17093: 
L17094: .
L17095: (17.10)
L17096: In this case, the concave function is the logarithm, so we have:
L17097: Problems 17.2–17.3
L17098: log
L17099: 
L17100: E[y]
L17101: 
L17102: ≥E
L17103: 
L17104: log[y]
L17105: 
L17106: ,
L17107: (17.11)
L17108: or writing out the expression for the expectation in full, we have:
L17109: log
L17110: Z
L17111: Pr(y)ydy
L17112: 
L17113: ≥
L17114: Z
L17115: Pr(y) log[y]dy.
L17116: (17.12)
L17117: This is explored in figures 17.4–17.5. In fact, the slightly more general statement is true:
L17118: log
L17119: Z
L17120: Pr(y)h[y]dy
L17121: 
L17122: ≥
L17123: Z
L17124: Pr(y) log[h[y]]dy.
L17125: (17.13)
L17126: where h[y] is a function of y. This follows because h[y] is another random variable with
L17127: a new distribution. Since we never specified Pr(y), the relation remains true.
L17128: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L17131: <!-- page 347 -->
L17132: 17.3
L17133: Training
L17134: 333
L17135: -3.0
L17136: Figure 17.6 Evidence lower bound (ELBO). The goal is to maximize the log-
L17137: likelihood log[Pr(x|ϕ)] (black curve) with respect to the parameters ϕ.
L17138: The
L17139: ELBO is a function that lies everywhere below the log-likelihood. It is a function
L17140: of both ϕ and a second set of parameters θ.
L17141: For fixed θ, we get a function
L17142: of ϕ (two colored curves for different values of θ). Consequently, we can increase
L17143: the log-likelihood by either improving the ELBO with respect to a) the new
L17144: parameters θ (moving from colored curve to colored curve) or b) the original
L17145: parameters ϕ (moving along the current colored curve).
L17146: 17.3.3
L17147: Deriving the bound
L17148: We now use Jensen’s inequality to derive the lower bound for the log-likelihood. We
L17149: start by multiplying and dividing the log-likelihood by an arbitrary probability distribu-
L17150: tion q(z) over the latent variables:
L17151: log[Pr(x|ϕ)]
L17152: =
L17153: log
L17154: Z
L17155: Pr(x, z|ϕ)dz
L17156: 
L17157: =
L17158: log
L17159: Z
L17160: q(z)Pr(x, z|ϕ)
L17161: q(z)
L17162: dz
L17163: 
L17164: ,
L17165: (17.14)
L17166: We then use Jensen’s inequality for the logarithm (equation 17.12) to find a lower bound:
L17167: log
L17168: Z
L17169: q(z)Pr(x, z|ϕ)
L17170: q(z)
L17171: dz
L17172: 
L17173: ≥
L17174: Z
L17175: q(z) log
L17176: Pr(x, z|ϕ)
L17177: q(z)
L17178: 
L17179: dz,
L17180: (17.15)
L17181: where the right-hand side is termed the evidence lower bound or ELBO. It gets this name
L17182: because Pr(x|ϕ) is called the evidence in the context of Bayes’ rule (equation 17.19).
L17183: In practice, the distribution q(z) has parameters θ, so the ELBO can be written as:
L17184: ELBO[θ, ϕ] =
L17185: Z
L17186: q(z|θ) log
L17187: Pr(x, z|ϕ)
L17188: q(z|θ)
L17189: 
L17190: dz.
L17191: (17.16)
L17192: Draft: please send errata to udlbookmail@gmail.com.
