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
L17195: <!-- page 348 -->
L17196: 334
L17197: 17
L17198: Variational autoencoders
L17199: To learn the nonlinear latent variable model, we maximize this quantity as a function of
L17200: both ϕ and θ. The neural architecture that computes this quantity is the VAE.
L17201: 17.4
L17202: ELBO properties
L17203: When first encountered, the ELBO is a somewhat mysterious object, so we now provide
L17204: some intuition about its properties. Consider that the original log-likelihood of the data
L17205: is a function of the parameters ϕ and that we want to find its maximum. For any fixed θ,
L17206: the ELBO is still a function of the parameters but one that must lie below the original
L17207: likelihood function. When we change θ, we modify this function, and depending on our
L17208: choice, the lower bound may move closer or further from the log-likelihood. When we
L17209: change ϕ, we move along the lower bound function (figure 17.6).
L17210: 17.4.1
L17211: Tightness of bound
L17212: The ELBO is tight when, for a fixed value of ϕ, the ELBO and the log likelihood function
L17213: coincide.
L17214: To find the distribution q(z|θ) that makes the bound tight, we factor the
L17215: Appendix C.1.3
L17216: Conditional
L17217: probability
L17218: numerator of the log term in the ELBO using the definition of conditional probability:
L17219: ELBO[θ, ϕ]
L17220: =
L17221: Z
L17222: q(z|θ) log
L17223: Pr(x, z|ϕ)
L17224: q(z|θ)
L17225: 
L17226: dz
L17227: =
L17228: Z
L17229: q(z|θ) log
L17230: Pr(z|x, ϕ)Pr(x|ϕ)
L17231: q(z|θ)
L17232: 
L17233: dz
L17234: =
L17235: Z
L17236: q(z|θ) log
L17237: 
L17238: Pr(x|ϕ)
L17239: 
L17240: dz +
L17241: Z
L17242: q(z|θ) log
L17243: Pr(z|x, ϕ)
L17244: q(z|θ)
L17245: 
L17246: dz
L17247: =
L17248: log
L17249: 
L17250: Pr(x|ϕ)
L17251: 
L17252: +
L17253: Z
L17254: q(z|θ) log
L17255: Pr(z|x, ϕ)
L17256: q(z|θ)
L17257: 
L17258: dz
L17259: =
L17260: log
L17261: 
L17262: Pr(x|ϕ)
L17263: 
L17264: −DKL
L17265: h
L17266: q(z|θ)
L17274: Pr(z|x, ϕ)
L17275: i
L17276: .
L17277: (17.17)
L17278: Here, the first integral disappears between lines three and four since log[Pr(x|ϕ)] does
L17279: not depend on z, and the integral of the probability distribution q(z|θ) is one. In the
L17280: Appendix C.5.1
L17281: KL divergence
L17282: last line, we have just used the definition of the Kullback-Leibler (KL) divergence.
L17283: This equation shows that the ELBO is the original log-likelihood minus the KL di-
L17284: vergence DKL [q(z|θ)||Pr(z|x, ϕ)]. The KL divergence measures the “distance” between
L17285: distributions and can only take non-negative values. It follows the ELBO is a lower
L17286: bound on log[Pr(x|ϕ)].
L17287: The KL distance will be zero, and the bound will be tight
L17288: when q(z|θ) = Pr(z|x, ϕ). This is the posterior distribution over the latent variables z
L17289: given observed data x; it indicates which values of the latent variable could have been
L17290: responsible for the data point (figure 17.7).
L17291: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L17294: <!-- page 349 -->
L17295: 17.4
L17296: ELBO properties
L17297: 335
L17298: Figure 17.7 Posterior distribution over latent variable. a) The posterior distri-
L17299: bution
L17300: Pr(z|x∗, ϕ) is the distribution over the values of the latent variable z
L17301: that could be responsible for a data point x∗.
L17302: We calculate this via Bayes’
L17303: rule Pr(z|x∗, ϕ) ∝Pr(x∗|z, ϕ)Pr(z). b) We compute the first term on the right-
L17304: hand side (the likelihood) by assessing the probability of x∗against the symmetric
L17305: Gaussian associated with each value of z. Here, it was more likely to have been
L17306: created from z1 than z2. The second term is the prior probability Pr(z) over the
L17307: latent variable. Combining these two factors and normalizing so the distribution
L17308: sums to one gives us the posterior Pr(z|x∗, ϕ).
L17309: 17.4.2
L17310: ELBO as reconstruction loss minus KL distance to prior
L17311: Equations 17.16 and 17.17 are two different ways to express the ELBO. A third way is
L17312: to consider the bound as reconstruction error minus the distance to the prior:
L17313: ELBO[θ, ϕ]
L17314: =
L17315: Z
L17316: q(z|θ) log
L17317: Pr(x, z|ϕ)
L17318: q(z|θ)
L17319: 
L17320: dz
L17321: =
L17322: Z
L17323: q(z|θ) log
L17324: Pr(x|z, ϕ)Pr(z)
L17325: q(z|θ)
L17326: 
L17327: dz
L17328: =
L17329: Z
L17330: q(z|θ) log [Pr(x|z, ϕ)] dz +
L17331: Z
L17332: q(z|θ) log
L17333:  Pr(z)
L17334: q(z|θ)
L17335: 
L17336: dz
L17337: =
L17338: Z
L17339: q(z|θ) log
L17340: 
L17341: Pr(x|z, ϕ)
L17342: 
L17343: dz −DKL
L17344: h
L17345: q(z|θ)
L17353: Pr(z)
L17354: i
L17355: ,
L17356: (17.18)
L17357: where the joint distribution Pr(x, z|ϕ) has been factored into conditional probabil-
L17358: Problem 17.4
L17359: ity Pr(x|z, ϕ)Pr(z) between the first and second lines, and the definition of KL di-
L17360: vergence is used again in the last line.
L17361: Draft: please send errata to udlbookmail@gmail.com.
L17364: <!-- page 350 -->
L17365: 336
L17366: 17
L17367: Variational autoencoders
L17368: In this formulation, the first term measures the average agreement Pr(x|z, ϕ) of the
L17369: latent variable and the data. This measures the reconstruction accuracy. The second
L17370: term measures the degree to which the auxiliary distribution q(z|θ) matches the prior.
L17371: This formulation is the one that is used in the variational autoencoder.
L17372: 17.5
L17373: Variational approximation
L17374: We saw in equation 17.17 that the ELBO is tight when q(z|θ) is the posterior Pr(z|x, ϕ).
L17375: In principle, we can compute the posterior using Bayes’ rule:
L17376: Pr(z|x, ϕ) = Pr(x|z, ϕ)Pr(z)
L17377: Pr(x|ϕ)
L17378: ,
L17379: (17.19)
L17380: but in practice, this is intractable because we can’t evaluate the evidence term Pr(x|ϕ)
L17381: in the denominator (see section 17.3).
L17382: One solution is to make a variational approximation: we choose a simple parametric
L17383: form for q(z|θ) and use this to approximate the true posterior.
L17384: Here, we choose a
L17385: Appendix C.3.2
L17386: Multivariate
L17387: normal
L17388: multivariate normal distribution with mean µ and diagonal covariance Σ. This will not
L17389: always match the posterior well but will be better for some values of µ and Σ than
L17390: others. During training, we will find the normal distribution that is “closest” to the true
L17391: posterior Pr(z|x) (figure 17.8). This corresponds to minimizing the KL divergence in
L17392: equation 17.17 and moving the colored curves in figure 17.6 upwards.
L17393: Since the optimal choice for q(z|θ) was the posterior Pr(z|x), and this depends on
L17394: the data example x, the variational approximation should do the same, so we choose:
L17395: q(z|x, θ) = Normz
L17396: h
L17397: gµ[x, θ], gΣ[x, θ]
L17398: i
L17399: ,
L17400: (17.20)
L17401: where g[x, θ] is a second neural network with parameters θ that predicts the mean µ
L17402: and variance Σ of the normal variational approximation.
L17403: 17.6
L17404: The variational autoencoder
L17405: Finally, we can describe the VAE. We build a network that computes the ELBO:
L17406: ELBO[θ, ϕ] =
L17407: Z
L17408: q(z|x, θ) log
L17409: 
L17410: Pr(x|z, ϕ)
L17411: 
L17412: dz −DKL
L17413: h
L17414: q(z|x, θ)
L17422: Pr(z)
L17423: i
L17424: ,
L17425: (17.21)
L17426: where the distribution q(z|x, θ) is the approximation from equation 17.20.
L17427: The first term still involves an intractable integral, but since it is an expectation with
L17428: Appendix C.2
L17429: Expectation
L17430: respect to q(z|x, θ), we can approximate it by sampling. For any function a[•] we have:
L17431: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L17434: <!-- page 351 -->
L17435: 17.6
L17436: The variational autoencoder
L17437: 337
L17438: Figure 17.8 Variational approximation. The posterior Pr(z|x∗, ϕ) can’t be com-
L17439: puted in closed form. The variational approximation chooses a family of distribu-
L17440: tions q(z|x, θ) (here Gaussians) and tries to find the closest member of this family
L17441: to the true posterior. a) Sometimes, the approximation (cyan curve) is good and
L17442: lies close to the true posterior (orange curve). b) However, if the posterior is
L17443: multi-modal (as in figure 17.7), then the Gaussian approximation will be poor.
L17444: Ez
L17445: 
L17446: a[z]
L17447: 
L17448: =
L17449: Z
L17450: a[z]q(z|x, θ)dz ≈1
L17451: N
L17452: N
L17453: X
L17454: n=1
L17455: a[z∗
L17456: n],
L17457: (17.22)
L17458: where z∗
L17459: n is the nth sample from q(z|x, θ). This is known as a Monte Carlo estimate.
L17460: For a very approximate estimate, we can just use a single sample z∗from q(z|x, θ):
L17461: ELBO[θ, ϕ]
L17462: ≈
L17463: log
L17464: 
L17465: Pr(x|z∗, ϕ)
L17466: 
L17467: −DKL
L17468: h
L17469: q(z|x, θ)
L17477: Pr(z)
L17478: i
L17479: .
L17480: (17.23)
L17481: The second term is the KL divergence between the variational distribution q(z|x, θ) =
L17482: Appendix C.5.4
L17483: KL divergence
L17484: between normal
L17485: distributions
L17486: Normz[µ, Σ] and the prior Pr(z) = Normz[0, I]. The KL divergence between two normal
L17487: distributions can be calculated in closed form. For the special case where one distribution
L17488: has parameters µ, Σ and the other is a standard normal, it is given by:
L17489: DKL
L17490: h
L17491: q(z|x, θ)
L17499: Pr(z)
L17500: i
L17501: = 1
L17502: 2
L17503: 
L17504: Tr[Σ] + µT µ −Dz −log
L17505: h
L17506: det[Σ]
L17507: i
L17508: .
L17509: (17.24)
L17510: where Dz is the dimensionality of the latent space.
L17511: 17.6.1
L17512: VAE algorithm
L17513: To summarize, we aim to build a model that computes the evidence lower bound for a
L17514: point x. Then we use an optimization algorithm to maximize this lower bound over the
L17515: Draft: please send errata to udlbookmail@gmail.com.
L17518: <!-- page 352 -->
L17519: 338
L17520: 17
L17521: Variational autoencoders
L17522: Figure 17.9 Variational autoencoder. The encoder g[x, θ] takes a training exam-
L17523: ple x and predicts the parameters µ, Σ of the variational distribution q(z|x, θ).
L17524: We sample from this distribution and then use the decoder f[z, ϕ] to predict the
L17525: data x. The loss function is the negative ELBO, which depends on how accurate
L17526: this prediction is and how similar the variational distribution q(z|x, θ) is to the
L17527: prior Pr(z) (equation 17.21).
L17528: dataset and hence improve the log-likelihood. To compute the ELBO we:
L17529: • compute the mean µ and variance Σ of the variational posterior distribution q(z|θ, x)
L17530: for this data point x using the network g[x, θ],
L17531: • draw a sample z∗from this distribution, and
L17532: • compute the ELBO using equation 17.23.
L17533: The associated architecture is shown in figure 17.9. It should now be clear why this
L17534: is called a variational autoencoder. It is variational because it computes a Gaussian
L17535: approximation to the posterior distribution. It is an autoencoder because it starts with
L17536: a data point x, computes a lower-dimensional latent vector z from this, and then uses this
L17537: vector to recreate the data point x as closely as possible. In this context, the mapping
L17538: from the data to the latent variable by the network g[x, θ] is called the encoder, and the
L17539: mapping from the latent variable to the data by the network f[z, ϕ] is called the decoder.
L17540: The VAE computes the ELBO as a function of both ϕ and θ. To maximize this
L17541: bound, we run mini-batches of samples through the network and update these parameters
L17542: with an optimization algorithm such as SGD or Adam. The gradients of the ELBO with
L17543: respect to the parameters are computed as usual using automatic differentiation. During
L17544: this process, we are both moving between the colored curves (changing θ) and along them
L17545: (changing ϕ) in figure 17.10. During this process, the parameters ϕ change to assign the
L17546: data a higher likelihood in the nonlinear latent variable model.
L17547: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L17550: <!-- page 353 -->
L17551: 17.7
L17552: The reparameterization trick
L17553: 339
L17554: Figure 17.10 The VAE updates both fac-
L17555: tors that determine the lower bound at
L17556: each iteration. Both the parameters ϕ of
L17557: the decoder and the parameters θ of the
L17558: encoder are manipulated to increase this
L17559: lower bound.
L17560: Figure 17.11 Reparameterization trick.
L17561: With the original architecture (fig-
L17562: ure 17.9), we cannot easily backpropagate through the sampling step. The repa-
L17563: rameterization trick removes the sampling step from the main pipeline; we draw
L17564: from a standard normal and combine this with the predicted mean and covariance
L17565: to get a sample from the variational distribution.
L17566: 17.7
L17567: The reparameterization trick
L17568: There is one more complication; the network involves a sampling step, and it is diﬀicult
L17569: to differentiate through this stochastic component. However, differentiating past this
L17570: step is necessary to update the parameters θ that precede it in the network.
L17571: Fortunately, there is a simple solution; we can move the stochastic part into a branch
L17572: Problem 17.5
L17573: of the network that draws a sample ϵ∗from Normϵ[0, I] and then use the relation:
L17574: z∗= µ + Σ1/2ϵ∗,
L17575: (17.25)
L17576: to draw from the intended Gaussian.
L17577: Now we can compute the derivatives as usual
L17578: Notebook 17.2
L17579: Reparameterization
L17580: trick
L17581: because the backpropagation algorithm does not need to pass down the stochastic branch.
L17582: This is known as the reparameterization trick (figure 17.11).
L17583: Draft: please send errata to udlbookmail@gmail.com.
L17586: <!-- page 354 -->
L17587: 340
L17588: 17
L17589: Variational autoencoders
L17590: 17.8
L17591: Applications
L17592: Variational autoencoders have many uses, including denoising, anomaly detection, and
L17593: compression. This section reviews several applications for image data.
L17594: 17.8.1
L17595: Approximating sample probability
L17596: In section 17.3, we argued that it is not possible to evaluate the probability of a sample
L17597: with the VAE, which describes this probability as:
L17598: Pr(x)
L17599: =
L17600: Z
L17601: Pr(x|z)Pr(z)dz
L17602: =
L17603: Ez
L17604: h
L17605: Pr(x|z)
L17606: i
L17607: =
L17608: Ez
L17609: h
L17610: Normx[f[z, ϕ], σ2I]
L17611: i
L17612: .
L17613: (17.26)
L17614: In principle, we could approximate this probability using equation 17.22 by drawing
L17615: samples from Pr(z) = Normz[0, I] and computing:
L17616: Pr(x) ≈1
L17617: N
L17618: N
L17619: X
L17620: n=1
L17621: Pr(x|zn).
L17622: (17.27)
L17623: However, the curse of dimensionality means that almost all values of zn that we draw
L17624: would have a very low probability Pr(x|zn); we would have to draw an enormous number
L17625: of samples to get a reliable estimate. A better approach is to use importance sampling.
L17626: Here, we sample z from an auxiliary distribution q(z), evaluate Pr(x|zn), and rescale
L17627: the resulting values by the probability q(z) under the new distribution:
L17628: Pr(x)
L17629: =
L17630: Z
L17631: Pr(x|z)Pr(z)dz
L17632: =
L17633: Z Pr(x|z)Pr(z)
L17634: q(z)
L17635: q(z)dz
L17636: =
L17637: Eq(z)
L17638: Pr(x|z)Pr(z)
L17639: q(z)
L17640: 
L17641: ≈
L17642: 1
L17643: N
L17644: N
L17645: X
L17646: n=1
L17647: Pr(x|zn)Pr(zn)
L17648: q(zn)
L17649: ,
L17650: (17.28)
L17651: where now we draw the samples from q(z). If q(z) is close to the region of z where
L17652: Notebook 17.3
L17653: Importance
L17654: sampling
L17655: the Pr(x|z) has high likelihood, then we will focus the sampling on the relevant area of
L17656: space and estimate Pr(x) much more eﬀiciently.
L17657: The product Pr(x|z)Pr(z) that we are trying to integrate is proportional to the
L17658: posterior distribution Pr(z|x) (by Bayes’ rule). Hence, a sensible choice of auxiliary
L17659: distribution q(z) is the variational posterior q(z|x) computed by the encoder.
L17660: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L17663: <!-- page 355 -->
L17664: 17.8
L17665: Applications
L17666: 341
L17667: Figure 17.12 Sampling from a standard VAE trained on CELEBA. In each col-
L17668: umn, a latent variable z∗is drawn and passed through the model to predict the
L17669: mean f[z∗, ϕ] before adding independent Gaussian noise (see figure 17.3). a) A
L17670: set of samples that are the sum of b) the predicted means and c) spherical Gaus-
L17671: sian noise vectors. The images look too smooth before we add the noise and too
L17672: noisy afterward. This is typical, and usually, the noise-free version is shown since
L17673: the noise is considered to represent aspects of the image that are not modeled.
L17674: Adapted from Dorta et al. (2018). d) It is now possible to generate high-quality
L17675: images from VAEs using hierarchical priors, specialized architecture, and careful
L17676: regularization. Adapted from Vahdat & Kautz (2020).
L17677: In this way, we can approximate the probability of new samples. With suﬀicient
L17678: samples, this will provide a better estimate than the lower bound and could be used to
L17679: evaluate the quality of the model by evaluating the log-likelihood of test data. Alterna-
L17680: tively, it could be used as a criterion for determining whether new examples belong to
L17681: the distribution or are anomalous.
L17682: 17.8.2
L17683: Generation
L17684: VAEs build a probabilistic model, and it’s easy to sample from this model by draw-
L17685: ing from the prior Pr(z) over the latent variable, passing this result through the de-
L17686: coder f[z, ϕ], and adding noise according to Pr(x|f[z, ϕ]). Unfortunately, samples from
L17687: Draft: please send errata to udlbookmail@gmail.com.
L17690: <!-- page 356 -->
L17691: 342
L17692: 17
L17693: Variational autoencoders
L17694: vanilla VAEs are generally low-quality (figure 17.12a–c). This is partly because of the
L17695: naïve spherical Gaussian noise model and partly because of the Gaussian models used
L17696: for the prior and variational posterior. One trick to improve generation quality is to
L17697: sample from the aggregated posterior q(z|θ) = (1/I) P
L17698: i q(z|xi, θ) rather than the prior;
L17699: this is the average posterior over all samples and is a mixture of Gaussians that is more
L17700: representative of true distribution in latent space.
L17701: Modern VAEs can produce high-quality samples (figure 17.12d), but only by using
L17702: hierarchical priors and specialized network architecture and regularization techniques.
L17703: Diffusion models (chapter 18) can be viewed as VAEs with hierarchical priors. These
L17704: also create very high-quality samples.
L17705: 17.8.3
L17706: Resynthesis
L17707: VAEs can also be used to modify real data. A data point x can be projected into the
L17708: latent space by either (i) taking the mean of the distribution predicted by the encoder
L17709: or (ii) by using an optimization procedure to find the latent variable z that maximizes
L17710: the posterior probability, which Bayes’ rule tells us is proportional to Pr(x|z)Pr(z).
L17711: In figure 17.13, multiple images labeled as “neutral” or “smiling” are projected into
L17712: latent space. The vector representing this change is estimated by taking the difference
L17713: in latent space between the means of these two groups. A second vector is estimated to
L17714: represent “mouth closed” versus “mouth open.”
L17715: Now the image of interest is projected into the latent space, and then the repre-
L17716: sentation is modified by adding or subtracting these vectors. To generate intermediate
L17717: images, spherical linear interpolation or Slerp is used rather than linear interpolation.
L17718: Problem 17.6
L17719: In 3D, this would be the difference between interpolating along the surface of a sphere
L17720: versus digging a straight tunnel through its body.
L17721: The process of encoding (and possibly modifying) input data before decoding again is
L17722: known as resynthesis. This can also be done with GANs and normalizing flows. However,
L17723: in GANs, there is no encoder, so a separate procedure must be used to find the latent
L17724: variable that corresponds to the observed data.
L17725: 17.8.4
L17726: Disentanglement
L17727: In the resynthesis example above, the directions in space representing interpretable prop-
L17728: erties had to be estimated using labeled training data. Other work attempts to improve
L17729: the characteristics of the latent space so that its coordinate directions correspond to real-
L17730: world properties. When each dimension represents an independent real-world factor, the
L17731: latent space is described as disentangled. For example, when modeling face images, we
L17732: might hope to uncover head pose or hair color as independent factors.
L17733: Methods to encourage disentanglement typically add regularization terms to the loss
L17734: function based on either (i) the posterior q(z|x, θ) over the latent variables z, or (ii) the
L17735: aggregated posterior q(z|θ) = (1/I) P
L17736: i q(z|xi, θ):
L17737: Lnew = −ELBO[θ, ϕ] + λ1EP r(x)
L17738: h
L17739: r1
L17740: 
L17741: q(z|x, θ)
L17742: i
L17743: + λ2r2
L17744: 
L17745: q(z|θ)
L17746: 
L17747: .
L17748: (17.29)
L17749: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L17752: <!-- page 357 -->
L17753: 17.9
L17754: Summary
L17755: 343
L17756: Figure 17.13 Resynthesis. The original image on the left is projected into the la-
L17757: tent space using the encoder, and the mean of the predicted Gaussian is chosen to
L17758: represent the image. The center-left image in the grid is the reconstruction of the
L17759: input. The other images are reconstructions after manipulating the latent space
L17760: in directions representing smiling/neutral (horizontal) and mouth open/closed
L17761: (vertical). Adapted from White (2016).
L17762: Here the regularization term r1[•] is a function of the posterior and is weighted by λ1.
L17763: The term r2[•] is a function of the aggregated posterior and is weighted by λ2.
L17764: For example, the beta VAE upweights the second term in the ELBO (equation 17.18):
L17765: ELBO[θ, ϕ]
L17766: ≈
L17767: log
L17768: 
L17769: Pr(x|z∗, ϕ)
L17770: 
L17771: −β · DKL
L17772: h
L17773: q(z|x, θ)
L17781: Pr(z)
L17782: i
L17783: ,
L17784: (17.30)
L17785: where β > 1 determines how much more the deviation from the prior Pr(z) is weighted
L17786: relative to the reconstruction error. Since the prior is usually a multivariate normal with
L17787: a spherical covariance matrix, its dimensions are independent. Hence, up-weighting this
L17788: term encourages the posterior distributions to be less correlated. Another variant is the
L17789: total correlation VAE, which adds a term to decrease the total correlation between vari-
L17790: ables in the latent space (figure 17.14) and maximizes the mutual information between
L17791: a small subset of the latent variables and the observations.
L17792: 17.9
L17793: Summary
L17794: The VAE is an architecture that helps to learn a nonlinear latent variable model over x.
L17795: This model can generate new examples by sampling from the latent variable, passing the
L17796: result through a deep network, and then adding independent Gaussian noise.
L17797: Draft: please send errata to udlbookmail@gmail.com.
L17800: <!-- page 358 -->
L17801: 344
L17802: 17
L17803: Variational autoencoders
L17804: Figure 17.14 Disentanglement in the total correlation VAE. The VAE model is
L17805: modified so that the loss function encourages the total correlation of the latent
L17806: variables to be minimized and hence encourages disentanglement. When trained
L17807: on a dataset of images of chairs, several of the latent dimensions have clear real-
L17808: world interpretations, including a) rotation, b) overall size, and c) legs (swivel
L17809: chair versus normal). In each case, the central column depicts samples from the
L17810: model, and as we move left to right, we are subtracting or adding a coordinate
L17811: vector in latent space. Adapted from Chen et al. (2018d).
L17812: It is not possible to compute the likelihood of a data point in closed form, and
L17813: this poses problems for training with maximum likelihood. However, we can define a
L17814: lower bound on the likelihood and maximize this bound. Unfortunately, for the bound
L17815: to be tight, we need to compute the posterior probability of the latent variable given
L17816: the observed data, which is also intractable.
L17817: The solution is to make a variational
L17818: approximation. This is a simpler distribution (usually a Gaussian) that approximates
L17819: the posterior and whose parameters are computed by a second encoder network.
L17820: To create high-quality samples from the VAE, it seems to be necessary to model the
L17821: latent space with more sophisticated probability distributions than the Gaussian prior
L17822: and posterior.
L17823: One option is to use hierarchical priors (in which one latent variable
L17824: generates another). The next chapter discusses diffusion models, which produce very
L17825: high-quality examples and can be viewed as hierarchical VAEs.
L17826: Notes
L17827: The VAE was originally introduced by Kingma & Welling (2014). A comprehensive introduction
L17828: to variational autoencoders can be found in Kingma et al. (2019).
L17829: Applications:
L17830: The VAE and variants thereof have been applied to images (Kingma & Welling,
L17831: 2014; Gregor et al., 2016; Gulrajani et al., 2016; Akuzawa et al., 2018), speech (Hsu et al., 2017b),
L17832: text (Bowman et al., 2015; Hu et al., 2017; Xu et al., 2020), molecules (Gómez-Bombarelli et al.,
L17833: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
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
