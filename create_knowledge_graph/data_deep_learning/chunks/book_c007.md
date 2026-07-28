L04054: 1
L04055: I
L04056: I
L04057: X
L04058: i=1
L04059: δ[y −yi]
L04060: !
L04061: log
L04062: 
L04063: Pr(y|θ)
L04064: 
L04065: dy
L04066: #
L04067: =
L04068: argmin
L04069: θ
L04070: "
L04071: −1
L04072: I
L04073: I
L04074: X
L04075: i=1
L04076: log
L04077: 
L04078: Pr(yi|θ)
L04079: 
L04080: #
L04081: =
L04082: argmin
L04083: θ
L04084: "
L04085: −
L04086: I
L04087: X
L04088: i=1
L04089: log
L04090: 
L04091: Pr(yi|θ)
L04092: 
L04093: #
L04094: .
L04095: (5.30)
L04096: The product of the two terms in the first line corresponds to pointwise multiplying the
L04097: point masses in figure 5.12a with the logarithm of the distribution in figure 5.12b. We
L04098: are left with a finite set of weighted probability masses centered on the data points. In
L04099: the last line, we have eliminated the constant scaling factor 1/I, as this does not affect
L04100: the position of the minimum.
L04101: In machine learning, the distribution parameters θ are computed by the model f[xi, ϕ],
L04102: so we have:
L04103: ˆϕ = argmin
L04104: ϕ
L04105: "
L04106: −
L04107: I
L04108: X
L04109: i=1
L04110: log
L04111: 
L04112: Pr(yi|f[xi, ϕ])
L04113: 
L04114: #
L04115: .
L04116: (5.31)
L04117: This is precisely the negative log-likelihood criterion from the recipe in section 5.2.
L04118: It follows that the negative log-likelihood criterion (from maximizing the data likeli-
L04119: hood) and the cross-entropy criterion (from minimizing the distance between the model
L04120: and empirical data distributions) are equivalent.
L04121: 5.8
L04122: Summary
L04123: We previously considered neural networks as directly predicting outputs y from data x.
L04124: In this chapter, we shifted perspective to think about neural networks as computing the
L04125: parameters θ of probability distributions Pr(y|θ) over the output space. This led to a
L04126: principled approach to building loss functions. We selected model parameters ϕ that
L04127: maximized the likelihood of the observed data under these distributions. We saw that
L04128: this is equivalent to minimizing the negative log-likelihood.
L04129: The least squares criterion for regression is a natural consequence of this approach;
L04130: it follows from the assumption that y is normally distributed and that we are predicting
L04131: the mean. We also saw how the regression model could be (i) extended to estimate the
L04132: uncertainty over the prediction and (ii) extended to make that uncertainty dependent
L04133: on the input (the heteroscedastic model). We applied the same approach to both binary
L04134: and multiclass classification and derived loss functions for each. We discussed how to
L04135: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L04138: <!-- page 87 -->
L04139: Notes
L04140: 73
L04141: tackle more complex data types and how to deal with multiple outputs. Finally, we
L04142: argued that cross-entropy is an equivalent way to think about fitting models.
L04143: In previous chapters, we developed neural network models. In this chapter, we de-
L04144: veloped loss functions for deciding how well a model describes the training data for a
L04145: given set of parameters. The next chapter considers model training, in which we aim to
L04146: find the model parameters that minimize this loss.
L04147: Notes
L04148: Losses based on the normal distribution:
L04149: Nix & Weigend (1994) and Williams (1996)
L04150: investigated heteroscedastic nonlinear regression in which both the mean and the variance of
L04151: the output are functions of the input. In the context of unsupervised learning, Burda et al.
L04152: (2016) use a loss function based on a multivariate normal distribution with diagonal covariance,
L04153: and Dorta et al. (2018) use a loss function based on a normal distribution with full covariance.
L04154: Robust regression:
L04155: Qi et al. (2020) investigate the properties of regression models that min-
L04156: imize mean absolute error rather than mean squared error.
L04157: This loss function follows from
L04158: assuming a Laplace distribution over the outputs and estimates the median output for a given
L04159: input rather than the mean. Barron (2019) presents a loss function that parameterizes the de-
L04160: gree of robustness. When interpreted in a probabilistic context, it yields a family of univariate
L04161: probability distributions that includes the normal and Cauchy distributions as special cases.
L04162: Estimating quantiles:
L04163: Sometimes, we may not want to estimate the mean or median in a
L04164: regression task but may instead want to predict a quantile. For example, this is useful for risk
L04165: models, where we want to know that the true value will be less than the predicted value 90%
L04166: of the time. This is known as quantile regression (Koenker & Hallock, 2001). This could be
L04167: done by fitting a heteroscedastic regression model and then estimating the quantile based on
L04168: the predicted normal distribution. Alternatively, the quantiles can be estimated directly using
L04169: quantile loss (also known as pinball loss). In practice, this minimizes the absolute deviations
L04170: of the data from the model but weights the deviations in one direction more than the other.
L04171: Recent work has investigated simultaneously predicting multiple quantiles to get an idea of the
L04172: overall distribution shape (Rodrigues & Pereira, 2020).
L04173: Class imbalance and focal loss:
L04174: Lin et al. (2017c) address data imbalance in classification
L04175: problems. If the number of examples for some classes is much greater than for others, then the
L04176: standard maximum likelihood loss does not work well; the model may concentrate on becoming
L04177: more confident about well-classified examples from the dominant classes and classify less well-
L04178: represented classes poorly. Lin et al. (2017c) introduce focal loss, which adds a single extra
L04179: parameter that down-weights the effect of well-classified examples to improve performance.
L04180: Learning to rank:
L04181: Cao et al. (2007), Xia et al. (2008), and Chen et al. (2009) all used the
L04182: Plackett-Luce model in loss functions for learning to rank data. This is the listwise approach to
L04183: learning to rank as the model ingests an entire list of objects to be ranked at once. Alternative
L04184: approaches are the pointwise approach, in which the model ingests a single object, and the
L04185: pairwise approach, where the model ingests pairs of objects.
L04186: Chen et al. (2009) summarize
L04187: different approaches for learning to rank.
L04188: Other data types:
L04189: Fan et al. (2020) use a loss based on the beta distribution for predicting
L04190: values between zero and one.
L04191: Jacobs et al. (1991) and Bishop (1994) investigated mixture
L04192: density networks for multimodal data.
L04193: These model the output as a mixture of Gaussians
L04194: Draft: please send errata to udlbookmail@gmail.com.
L04197: <!-- page 88 -->
L04198: 74
L04199: 5
L04200: Loss functions
L04201: Figure 5.13
L04202: The
L04203: von
L04204: Mises
L04205: distribu-
L04206: tion is defined over the circular do-
L04207: main (−π, π].
L04208: It has two parameters.
L04209: The mean µ determines the position
L04210: of the peak.
L04211: The concentration κ >
L04212: 0 acts like the inverse of the vari-
L04213: ance. Hence 1/√κ is roughly equivalent
L04214: to the standard deviation in a normal
L04215: distribution.
L04216: (see figure 5.14) that is conditional on the input. Prokudin et al. (2018) used the von Mises
L04217: distribution to predict direction (see figure 5.13). Fallah et al. (2009) constructed loss functions
L04218: for prediction counts using the Poisson distribution (see figure 5.15). Ng et al. (2017) used loss
L04219: functions based on the gamma distribution to predict duration.
L04220: Non-probabilistic approaches:
L04221: It is not strictly necessary to adopt the probabilistic ap-
L04222: proach discussed in this chapter, but this has become the default in recent years; any loss func-
L04223: tion that aims to reduce the distance between the model output and the training outputs will
L04224: suﬀice, and distance can be defined in any way that seems sensible. There are several well-known
L04225: non-probabilistic machine learning models for classification, including support vector machines
L04226: (Vapnik, 1995; Cristianini & Shawe-Taylor, 2000), which use hinge loss, and AdaBoost (Freund
L04227: & Schapire, 1997), which uses exponential loss.
L04228: Problems
L04229: Problem 5.1 Show that the logistic sigmoid function sig[z] becomes 0 as
L04230: z →−∞, is 0.5
L04231: when z = 0, and becomes 1 when z →∞, where:
L04232: sig[z] =
L04233: 1
L04234: 1 + exp[−z].
L04235: (5.32)
L04236: Problem 5.2 The loss L for binary classification for a single training pair {x, y} is:
L04237: L = −(1 −y) log
L04238: h
L04239: 1 −sig[f[x, ϕ]]
L04240: i
L04241: −y log
L04242: h
L04243: sig[f[x, ϕ]]
L04244: i
L04245: ,
L04246: (5.33)
L04247: where sig[•] is defined in equation 5.32. Plot this loss as a function of the transformed network
L04248: output sig[f[x, ϕ]] ∈[0, 1] (i) when the training label y = 0 and (ii) when y = 1.
L04249: Problem 5.3∗Suppose we want to build a model that predicts the direction y in radians of the
L04250: prevailing wind based on local measurements of barometric pressure x. A suitable distribution
L04251: over circular domains is the von Mises distribution (figure 5.13):
L04252: Pr(y|µ, κ) = exp
L04253: 
L04254: κ cos[y −µ]
L04255: 
L04256: 2π · Bessel0[κ] ,
L04257: (5.34)
L04258: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L04261: <!-- page 89 -->
L04262: Notes
L04263: 75
L04264: Figure 5.14 Multimodal data and mixture of Gaussians density.
L04265: a) Example
L04266: training data where, for intermediate values of the input x, the corresponding
L04267: output y follows one of two paths. For example, at x = 0, the output y might
L04268: be roughly −2 or +3 but is unlikely to be between these values. b) The mixture
L04269: of Gaussians is a probability model suited to this kind of data. As the name
L04270: suggests, the model is a weighted sum (solid cyan curve) of two or more normal
L04271: distributions with different means and variances (here, two normal distributions,
L04272: dashed blue and orange curves). When the means are far apart, this forms a
L04273: multimodal distribution. c) When the means are close, the mixture can model
L04274: unimodal but non-normal densities.
L04275: where µ is a measure of the mean direction and κ is a measure of concentration (i.e., the inverse
L04276: of the variance). The term Bessel0[κ] is a modified Bessel function of the first kind of order 0.
L04277: Use the recipe from section 5.2 to develop a loss function for learning the parameter µ of a
L04278: model f[x, ϕ] to predict the most likely wind direction. Your solution should treat the concen-
L04279: tration κ as constant. How would you perform inference?
L04280: Problem 5.4∗
L04281: Sometimes, the outputs y for input x are multimodal (figure 5.14a); there is
L04282: more than one valid prediction for a given input. Here, we might use a weighted sum of normal
L04283: components as the distribution over the output. This is known as a mixture of Gaussians model.
L04284: For example, a mixture of two Gaussians has parameters θ = {λ, µ1, σ2
L04285: 1, µ2, σ2
L04286: 2}:
L04287: Pr(y|λ, µ1, µ2, σ2
L04288: 1, σ2
L04289: 2) =
L04290: λ
L04291: p
L04292: 2πσ2
L04293: 1
L04294: exp
L04295: −(y −µ1)2
L04296: 2σ2
L04297: 1
L04298: 
L04299: +
L04300: 1 −λ
L04301: p
L04302: 2πσ2
L04303: 2
L04304: exp
L04305: −(y −µ2)2
L04306: 2σ2
L04307: 2
L04308: 
L04309: ,
L04310: (5.35)
L04311: where λ ∈[0, 1] controls the relative weight of the two components, which have means µ1, µ2
L04312: and variances σ2
L04313: 1, σ2
L04314: 2, respectively.
L04315: This model can represent a distribution with two peaks
L04316: (figure 5.14b) or a distribution with one peak but a more complex shape (figure 5.14c).
L04317: Use the recipe from section 5.2 to construct a loss function for training a model f[x, ϕ] that takes
L04318: input x, has parameters ϕ, and predicts a mixture of two Gaussians. The loss should be based
L04319: on I training data pairs {xi, yi}. What problems do you foresee when performing inference?
L04320: Problem 5.5 Consider extending the model from problem 5.3 to predict the wind direction using
L04321: a mixture of two von Mises distributions. Write an expression for the likelihood Pr(y|θ) for
L04322: this model. How many outputs will the network need to produce?
L04323: Draft: please send errata to udlbookmail@gmail.com.
L04326: <!-- page 90 -->
L04327: 76
L04328: 5
L04329: Loss functions
L04330: Figure 5.15 Poisson distribution. This discrete distribution is defined over non-
L04331: negative integers z ∈{0, 1, 2, . . .}. It has a single parameter λ ∈R+, which is
L04332: known as the rate and is the mean of the distribution. a–c) Poisson distributions
L04333: with rates of 1.4, 2.8, and 6.0, respectively.
L04334: Problem 5.6 Consider building a model to predict the number of pedestrians y ∈{0, 1, 2, . . .}
L04335: that will pass a given point in the city in the next minute, based on data x that contains
L04336: information about the time of day, the longitude and latitude, and the type of neighborhood.
L04337: A suitable distribution for modeling counts is the Poisson distribution (figure 5.15). This has
L04338: a single parameter λ > 0 called the rate that represents the mean of the distribution. The
L04339: distribution has probability density function:
L04340: Pr(y = k) = λke−λ
L04341: k!
L04342: .
L04343: (5.36)
L04344: Design a loss function for this model assuming we have access to I training pairs {xi, yi}.
L04345: Problem 5.7 Consider a multivariate regression problem where we predict ten outputs, so y ∈
L04346: R10, and model each with an independent normal distribution where the means µd are pre-
L04347: dicted by the network, and variances σ2 are constant.
L04348: Write an expression for the likeli-
L04349: hood Pr(y|f[x, ϕ]).
L04350: Show that minimizing the negative log-likelihood of this model is still
L04351: equivalent to minimizing a sum of squared terms if we don’t estimate the variance σ2.
L04352: Problem 5.8∗Construct a loss function for making multivariate predictions y ∈RDo based
L04353: on independent normal distributions with different variances σ2
L04354: d for each dimension. Assume
L04355: a heteroscedastic model so that both the means µd and variances σ2
L04356: d vary as a function of the
L04357: data.
L04358: Problem 5.9∗Consider a multivariate regression problem in which we predict the height of a
L04359: person in meters and their weight in kilos from data x. Here, the units take quite different
L04360: ranges. What problems do you see this causing? Propose two solutions to these problems.
L04361: Problem 5.10 Extend the model from problem 5.3 to predict both the wind direction and the
L04362: wind speed and define the associated loss function.
L04363: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L04366: <!-- page 91 -->
L04367: Chapter 6
L04368: Fitting models
L04369: Chapters 3 and 4 described shallow and deep neural networks. These represent families
L04370: of piecewise linear functions, where the parameters determine the particular function.
L04371: Chapter 5 introduced the loss — a single number representing the mismatch between
L04372: the network predictions and the ground truth for a training set.
L04373: The loss depends on the network parameters, and this chapter considers how to find
L04374: the parameter values that minimize this loss. This is known as learning the network’s
L04375: parameters or simply as training or fitting the model. The process is to choose initial
L04376: parameter values and then iterate the following two steps: (i) compute the derivatives
L04377: (gradients) of the loss with respect to the parameters, and (ii) adjust the parameters
L04378: based on the gradients to decrease the loss. After many iterations, we hope to reach the
L04379: overall minimum of the loss function.
L04380: This chapter tackles the second of these steps; we consider algorithms that adjust
L04381: the parameters to decrease the loss. Chapter 7 discusses how to initialize the parameters
L04382: and compute the gradients for neural networks.
L04383: 6.1
L04384: Gradient descent
L04385: To fit a model, we need a training set {xi, yi} of input/output pairs. We seek param-
L04386: eters ϕ for the model f[xi, ϕ] that map the inputs xi to the outputs yi as closely as
L04387: possible. To this end, we define a loss function L[ϕ] that returns a single number that
L04388: quantifies the mismatch in this mapping. The goal of an optimization algorithm is to
L04389: find parameters ˆϕ that minimize the loss:
L04390: ˆϕ = argmin
L04391: ϕ
L04392: h
L04393: L[ϕ]
L04394: i
L04395: .
L04396: (6.1)
L04397: There are many families of optimization algorithms, but the standard methods for train-
L04398: ing neural networks are iterative. These algorithms initialize the parameters heuristically
L04399: and then adjust them repeatedly in such a way that the loss decreases.
L04400: Draft: please send errata to udlbookmail@gmail.com.
L04403: <!-- page 92 -->
L04404: 78
L04405: 6
L04406: Fitting models
L04407: The simplest method in this class is gradient descent. This starts with initial param-
L04408: eters ϕ = [ϕ0, ϕ1, . . . , ϕN]T and iterates two steps:
L04409: Step 1.
L04410: Compute the derivatives of the loss with respect to the parameters:
L04411: ∂L
L04412: ∂ϕ =
L04413: 
L04414: 
L04415: ∂L
L04416: ∂ϕ0
L04417: ∂L
L04418: ∂ϕ1...
L04419: ∂L
L04420: ∂ϕN
L04421: 
L04422: 
L04423: .
L04424: (6.2)
L04425: Step 2.
L04426: Update the parameters according to the rule:
L04427: ϕ ←−ϕ −α · ∂L
L04428: ∂ϕ,
L04429: (6.3)
L04430: where the positive scalar α determines the magnitude of the change.
L04431: The first step computes the gradient of the loss function at the current position. This
L04432: determines the uphill direction of the loss function.
L04433: The second step moves a small
L04434: distance α downhill (hence the negative sign). The parameter α may be fixed (in which
L04435: Notebook 6.1
L04436: Line search
L04437: case, we call it a learning rate), or we may perform a line search where we try several
L04438: values of α to find the one that most decreases the loss.
L04439: At the minimum of the loss function, the surface must be flat (or we could improve
L04440: further by going downhill). Hence, the gradient will be zero, and the parameters will stop
L04441: changing. In practice, we monitor the gradient magnitude and terminate the algorithm
L04442: when it becomes too small.
L04443: 6.1.1
L04444: Linear regression example
L04445: Consider applying gradient descent to the 1D linear regression model from chapter 2. The
L04446: model f[x, ϕ] maps a scalar input x to a scalar output y and has parameters ϕ = [ϕ0, ϕ1]T ,
L04447: which represent the y-intercept and the slope:
L04448: y
L04449: =
L04450: f[x, ϕ]
L04451: =
L04452: ϕ0 + ϕ1x.
L04453: (6.4)
L04454: Given a dataset {xi, yi} containing I input/output pairs, we choose the least squares
L04455: loss function:
L04456: L[ϕ]
L04457: =
L04458: I
L04459: X
L04460: i=1
L04461: ℓi
L04462: =
L04463: I
L04464: X
L04465: i=1
L04466: (f[xi, ϕ] −yi)2
L04467: =
L04468: I
L04469: X
L04470: i=1
L04471: (ϕ0 + ϕ1xi −yi)2 ,
L04472: (6.5)
L04473: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L04476: <!-- page 93 -->
L04477: 6.1
L04478: Gradient descent
L04479: 79
L04480: Figure 6.1 Gradient descent for the linear regression model. a) Training set of I =
L04481: 12 input/output pairs {xi, yi}. b) Loss function showing iterations of gradient
L04482: descent. We start at point 0 and move in the steepest downhill direction until
L04483: we can improve no further to arrive at point 1. We then repeat this procedure.
L04484: We measure the gradient at point 1 and move downhill to point 2 and so on. c)
L04485: This can be visualized better as a heatmap, where the brightness represents the
L04486: loss. After only four iterations, we are already close to the minimum. d) The
L04487: model with the parameters at point 0 (lightest line) describes the data very badly,
L04488: but each successive iteration improves the fit. The model with the parameters at
L04489: point 4 (darkest line) is already a reasonable description of the training data.
L04490: Draft: please send errata to udlbookmail@gmail.com.
L04493: <!-- page 94 -->
L04494: 80
L04495: 6
L04496: Fitting models
L04497: where the term ℓi = (ϕ0 + ϕ1xi −yi)2 is the individual contribution to the loss from
L04498: the ith training example.
L04499: The derivative of the loss function with respect to the parameters can be decomposed
L04500: into the sum of the derivatives of the individual contributions:
L04501: ∂L
L04502: ∂ϕ = ∂
L04503: ∂ϕ
L04504: I
L04505: X
L04506: i=1
L04507: ℓi =
L04508: I
L04509: X
L04510: i=1
L04511: ∂ℓi
L04512: ∂ϕ,
L04513: (6.6)
L04514: where these are given by:
L04515: Problem 6.1
L04516: ∂ℓi
L04517: ∂ϕ =
L04518: 
L04519: 
L04520: ∂ℓi
L04521: ∂ϕ0
L04522: ∂ℓi
L04523: ∂ϕ1
L04524: 
L04525: =
L04526: " 2(ϕ0 + ϕ1xi −yi)
L04527: 2xi(ϕ0 + ϕ1xi −yi)
L04528: #
L04529: .
L04530: (6.7)
L04531: Figure 6.1 shows the progression of this algorithm as we iteratively compute the
L04532: Notebook 6.2
L04533: Gradient descent
L04534: derivatives according to equations 6.6 and 6.7 and then update the parameters using the
L04535: rule in equation 6.3. In this case, we have used a line search procedure to find the value
L04536: of α that decreases the loss the most at each iteration.
L04537: 6.1.2
L04538: Gabor model example
L04539: Loss functions for linear regression problems (figure 6.1c) always have a single well-
L04540: defined global minimum. More formally, they are convex, which means that every chord
L04541: Problem 6.2
L04542: (line segment between two points on the surface) lies above the function and does not
L04543: intersect it. Convexity implies that wherever we initialize the parameters, we are bound
L04544: to reach the minimum if we keep walking downhill; the training procedure can’t fail.
L04545: Unfortunately, loss functions for most nonlinear models, including both shallow and
L04546: deep networks, are non-convex.
L04547: Visualizing neural network loss functions is challenging
L04548: due to the number of parameters. Hence, we first explore a simpler nonlinear model with
L04549: two parameters to gain insight into the properties of non-convex loss functions:
L04550: f[x, ϕ] = sin[ϕ0 + 0.06 · ϕ1x] · exp
L04551: 
L04552: −(ϕ0 + 0.06 · ϕ1x)2
L04553: 32.0
L04554: 
L04555: .
L04556: (6.8)
L04557: This Gabor model maps scalar input x to scalar output y and consists of a sinusoidal
L04558: Problems 6.3–6.5
L04559: component (creating an oscillatory function) multiplied by a negative exponential com-
L04560: ponent (causing the amplitude to decrease as we move from the center). It has two
L04561: parameters ϕ = [ϕ0, ϕ1]T , where ϕ0 ∈R determines the mean position of the function
L04562: and ϕ1 ∈R+ stretches or squeezes it along the x-axis (figure 6.2).
L04563: Consider a training set of I examples {xi, yi} (figure 6.3). The least squares loss
L04564: function for I training examples is defined as:
L04565: L[ϕ] =
L04566: I
L04567: X
L04568: i=1
L04569: (f[xi, ϕ] −yi)2 .
L04570: (6.9)
L04571: Once more, the goal is to find the parameters ˆϕ that minimize this loss.
L04572: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L04575: <!-- page 95 -->
L04576: 6.1
L04577: Gradient descent
L04578: 81
L04579: Figure 6.2 Gabor model. This nonlinear model maps scalar input x to scalar
L04580: output y and has parameters ϕ = [ϕ0, ϕ1]T . It describes a sinusoidal function
L04581: that decreases in amplitude with distance from its center. Parameter ϕ0 ∈R
L04582: determines the position of the center. As ϕ0 increases, the function moves left.
L04583: Parameter ϕ1 ∈R+ squeezes the function along the x-axis relative to the center.
L04584: As ϕ1 increases, the function narrows.
L04585: a–c) Model with different parameters.
L04586: (Interactive figure)
L04587: Figure 6.3 Training data for fitting the
L04588: Gabor model. The training dataset con-
L04589: tains 28 input/output examples {xi, yi}.
L04590: These data were created by uniformly
L04591: sampling xi
L04592: ∈[−15, 15], passing the
L04593: samples through a Gabor model with pa-
L04594: rameters ϕ = [0.0, 16.6]T , and adding
L04595: normally distributed noise.
L04596: 6.1.3
L04597: Local minima and saddle points
L04598: Figure 6.4 depicts the loss function associated with the Gabor model for this dataset.
L04599: There are numerous local minima (cyan circles). Here the gradient is zero, and the loss
L04600: Problem 6.6
L04601: increases if we move in any direction, but we are not at the overall minimum of the
L04602: function. The point with the lowest loss is known as the global minimum and is depicted
L04603: by the gray circle.
L04604: If we start in a random position and use gradient descent to go downhill, there is
L04605: Problems 6.7–6.8
L04606: no guarantee that we will wind up at the global minimum and find the best parameters
L04607: (figure 6.5a). It’s equally or even more likely that the algorithm will terminate in one
L04608: of the local minima. Furthermore, there is no way of knowing whether there is a better
L04609: solution elsewhere.
L04610: Draft: please send errata to udlbookmail@gmail.com.
L04613: <!-- page 96 -->
L04614: 82
L04615: 6
L04616: Fitting models
L04617: Figure 6.4 Loss function for the Gabor model. a) The loss function is non-convex,
L04618: with multiple local minima (cyan circles) in addition to the global minimum (gray
L04619: circle). It also contains saddle points where the gradient is locally zero, but the
L04620: function increases in one direction and decreases in the other. The blue cross is
L04621: an example of a saddle point; the function decreases as we move horizontally in
L04622: either direction but increases as we move vertically. b–f) Models associated with
L04623: the different minima. In each case, there is no small change that decreases the
L04624: loss. Panel (c) shows the global minimum, which has a loss of 0.64. (Interactive
L04625: figure)
L04626: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L04629: <!-- page 97 -->
L04630: 6.2
L04631: Stochastic gradient descent
L04632: 83
L04633: Figure 6.5 Gradient descent vs. stochastic gradient descent. a) Gradient descent
L04634: with line search. As long as the gradient descent algorithm is initialized in the
L04635: right “valley” of the loss function (e.g., points 1 and 3), the parameter estimate
L04636: will move steadily toward the global minimum. However, if it is initialized outside
L04637: this valley (e.g., point 2), it will descend toward one of the local minima. b)
L04638: Stochastic gradient descent adds noise to the optimization process, so it is possible
L04639: to escape from the wrong valley (e.g., point 2) and still reach the global minimum.
L04640: In addition, the loss function contains saddle points (e.g., the blue cross in figure 6.4).
L04641: Here, the gradient is zero, but the function increases in some directions and decreases
L04642: in others. If the current parameters are not exactly at the saddle point, then gradient
L04643: descent can escape by moving downhill. However, the surface near the saddle point is
L04644: flat, so it’s hard to be sure that training hasn’t converged; if we terminate the algorithm
L04645: when the gradient is small, we may erroneously stop near a saddle point.
L04646: 6.2
L04647: Stochastic gradient descent
L04648: The Gabor model has two parameters, so we could find the global minimum by either (i)
L04649: exhaustively searching the parameter space or (ii) repeatedly starting gradient descent
L04650: from different positions and choosing the result with the lowest loss. However, neural
L04651: network models can have millions of parameters, so neither approach is practical. In
L04652: short, using gradient descent to find the global optimum of a high-dimensional loss
L04653: function is challenging. We can find a minimum, but there is no way to tell whether this
L04654: Draft: please send errata to udlbookmail@gmail.com.
L04657: <!-- page 98 -->
L04658: 84
L04659: 6
L04660: Fitting models
L04661: Figure 6.6 Alternative view of SGD for the Gabor model with a batch size three.
L04662: a) Loss function for the entire training dataset. At each iteration, there is a prob-
L04663: ability distribution of possible parameter changes (inset shows samples). These
L04664: correspond to different choices of the three batch elements. b) Loss function for
L04665: one possible batch. The SGD algorithm moves in the downhill direction on this
L04666: function for a distance that is determined by the learning rate and the local gra-
L04667: dient magnitude. The current model (dashed function in inset) changes to better
L04668: fit the batch data (solid function). c) A different batch creates a different loss
L04669: function and results in a different update. d) For this batch, the algorithm moves
L04670: downhill with respect to the batch loss function but in the locally uphill direction
L04671: with respect to the global loss function in panel (a). This is how SGD can escape
L04672: local minima.
L04673: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L04676: <!-- page 99 -->
L04677: 6.2
L04678: Stochastic gradient descent
L04679: 85
L04680: is the global minimum or even a good one.
L04681: One of the main problems is that the final destination of a gradient descent algorithm
L04682: Notebook 6.3
L04683: Stochastic
L04684: gradient descent
L04685: is entirely determined by the starting point. Stochastic gradient descent (SGD) attempts
L04686: to remedy this problem by adding some noise to the gradient at each step. The solution
L04687: still moves downhill on average, but at any given iteration, the direction chosen is not
L04688: necessarily in the steepest downhill direction. Indeed, it might not be downhill at all.
L04689: The SGD algorithm has the possibility of moving temporarily uphill and hence jumping
L04690: from one “valley” of the loss function to another (figure 6.5b).
L04691: 6.2.1
L04692: Batches and epochs
L04693: The mechanism for introducing randomness is simple. At each iteration, the algorithm
L04694: chooses a random subset of the training data and computes the gradient from these
L04695: examples alone. This subset is known as a minibatch or batch for short. The update rule
L04696: for the model parameters ϕt at iteration t is hence:
L04697: ϕt+1 ←−ϕt −α ·
L04698: X
L04699: i∈Bt
L04700: ∂ℓi[ϕt]
L04701: ∂ϕ
L04702: ,
L04703: (6.10)
L04704: where Bt is a set containing the indices of the input/output pairs in the current batch
L04705: and, as before, ℓi is the loss due to the ith pair. The term α is the learning rate, and
L04706: together with the gradient magnitude, determines the distance moved at each iteration.
L04707: The learning rate is chosen at the start of the procedure and does not depend on the
L04708: local properties of the function.
L04709: The batches are usually drawn from the dataset without replacement. The algorithm
L04710: works through the training examples until it has used all the data, at which point it
L04711: Problem 6.9
L04712: starts sampling from the full training dataset again. A single pass through the entire
L04713: training dataset is referred to as an epoch. A batch may be as small as a single example
L04714: or as large as the whole dataset. The latter case is called full-batch gradient descent and
L04715: is identical to regular (non-stochastic) gradient descent.
L04716: An alternative interpretation of SGD is that it computes the gradient of a different
L04717: loss function at each iteration; the loss function depends on both the model and the
L04718: training data and hence will differ for each randomly selected batch.
L04719: In this view,
L04720: SGD performs deterministic gradient descent on a constantly changing loss function
L04721: (figure 6.6). However, despite this variability, the expected loss and expected gradients
L04722: at any point remain the same as for gradient descent.
L04723: 6.2.2
L04724: Properties of stochastic gradient descent
L04725: SGD has several attractive features. First, although it adds noise to the trajectory, it
L04726: still improves the fit to a subset of the data at each iteration. Hence, the updates tend
L04727: to be sensible even if they are not optimal. Second, because it draws training examples
L04728: without replacement and iterates through the dataset, the training examples all still
L04729: contribute equally. Third, it is less computationally expensive to compute the gradient
L04730: Draft: please send errata to udlbookmail@gmail.com.
L04733: <!-- page 100 -->
L04734: 86
L04735: 6
L04736: Fitting models
L04737: from just a subset of the training data. Fourth, it can (in principle) escape local minima.
L04738: Fifth, it reduces the chances of getting stuck near saddle points; it is likely that at least
L04739: some of the possible batches will have a significant gradient at any point on the loss
L04740: function. Finally, there is some evidence that SGD finds parameters for neural networks
L04741: that cause them to generalize well to new data in practice (see section 9.2).
L04742: SGD does not necessarily “converge” in the traditional sense. However, the hope is
L04743: that when we are close to the global minimum, all the data points will be well described
L04744: by the model. Consequently, the gradient will be small, whichever batch is chosen, and
L04745: the parameters will cease to change much. In practice, SGD is often applied with a
L04746: learning rate schedule. The learning rate α starts at a high value and is decreased by a
L04747: constant factor every N epochs. The logic is that in the early stages of training, we want
L04748: the algorithm to explore the parameter space, jumping from valley to valley to find a
L04749: sensible region. In later stages, we are roughly in the right place and are more concerned
L04750: with fine-tuning the parameters, so we decrease α to make smaller changes.
L04751: 6.3
L04752: Momentum
L04753: A common modification to stochastic gradient descent is to add a momentum term. We
L04754: update the parameters with a weighted combination of the gradient computed from the
L04755: current batch and the direction moved in the previous step:
L04756: mt+1
L04757: ←
L04758: β · mt + (1 −β)
L04759: X
L04760: i∈Bt
L04761: ∂ℓi[ϕt]
L04762: ∂ϕ
L04763: ϕt+1
L04764: ←
L04765: ϕt −α · mt+1,
L04766: (6.11)
L04767: where mt is the momentum (which drives the update at iteration t), β ∈[0, 1) controls
L04768: the degree to which the gradient is smoothed over time, and α is the learning rate.
L04769: The recursive formulation of the momentum calculation means that the gradient step
L04770: is an infinite weighted sum of all the previous gradients, where the weights get smaller
L04771: as we move back in time.
L04772: The effective learning rate increases if all these gradients
L04773: Problem 6.10
L04774: are aligned over multiple iterations but decreases if the gradient direction repeatedly
L04775: changes as the terms in the sum cancel out. The overall effect is a smoother trajectory
L04776: and reduced oscillatory behavior in valleys (figure 6.7).
L04777: 6.3.1
L04778: Nesterov accelerated momentum
L04779: The momentum term can be considered a coarse prediction of where the SGD algorithm
L04780: Notebook 6.4
L04781: Momentum
L04782: will move next. Nesterov accelerated momentum (figure 6.8) computes the gradients at
L04783: this predicted point rather than at the current point:
L04784: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L04787: <!-- page 101 -->
L04788: 6.3
L04789: Momentum
L04790: 87
L04791: Figure 6.7 Stochastic gradient descent with momentum. a) Regular stochastic
L04792: descent takes a very indirect path toward the minimum. b) With a momentum
L04793: term, the change at the current step is a weighted combination of the previ-
L04794: ous change and the gradient computed from the batch. This smooths out the
L04795: trajectory and increases the speed of convergence.
L04796: Figure 6.8 Nesterov accelerated momen-
L04797: tum.
L04798: The solution has traveled along
L04799: the dashed line to arrive at point 1. A
L04800: traditional momentum update measures
L04801: the gradient at point 1, moves some dis-
L04802: tance in this direction to point 2, and
L04803: then adds the momentum term from the
L04804: previous iteration (i.e., in the same di-
L04805: rection as the dashed line), arriving at
L04806: point 3.
L04807: The Nesterov momentum up-
L04808: date first applies the momentum term
L04809: (moving from point 1 to point 4) and
L04810: then measures the gradient and applies
L04811: an update to arrive at point 5.
L04812: Draft: please send errata to udlbookmail@gmail.com.
L04815: <!-- page 102 -->
L04816: 88
L04817: 6
L04818: Fitting models
L04819: mt+1
L04820: ←
L04821: β · mt + (1 −β)
L04822: X
L04823: i∈Bt
L04824: ∂ℓi[ϕt −αβ · mt]
L04825: ∂ϕ
L04826: ϕt+1
L04827: ←
L04828: ϕt −α · mt+1,
L04829: (6.12)
L04830: where now the gradients are evaluated at ϕt −αβ · mt. One way to think about this is
L04831: that the gradient term now corrects the path provided by momentum alone.
L04832: 6.4
L04833: Adam
L04834: Gradient descent with a fixed step size has the following undesirable property: it makes
L04835: large adjustments to parameters associated with large gradients (where perhaps we
L04836: should be more cautious) and small adjustments to parameters associated with small
L04837: gradients (where perhaps we should explore further).
L04838: When the gradient of the loss
L04839: surface is much steeper in one direction than another, it is diﬀicult to choose a learning
L04840: rate that (i) makes good progress in both directions and (ii) is stable (figures 6.9a–b).
L04841: A straightforward approach is to normalize the gradients so that we move a fixed
L04842: distance (governed by the learning rate) in each direction. To do this, we first measure
L04843: the gradient mt+1 and the pointwise squared gradient vt+1:
L04844: mt+1
L04845: ←
L04846: ∂L[ϕt]
L04847: ∂ϕ
L04848: vt+1
L04849: ←
L04850: ∂L[ϕt]
L04851: ∂ϕ
L04852: 2
L04853: .
L04854: (6.13)
L04855: Then we apply the update rule:
L04856: ϕt+1
L04857: ←
L04858: ϕt −α ·
L04859: mt+1
L04860: √vt+1 + ϵ,
L04861: (6.14)
L04862: where the square root and division are both pointwise, α is the learning rate, and ϵ is a
L04863: small constant that prevents division by zero when the gradient magnitude is zero. The
L04864: term vt+1 is the squared gradient, and the positive root of this is used to normalize the
L04865: gradient itself, so all that remains is the sign in each coordinate direction. The result is
L04866: that the algorithm moves a fixed distance α along each coordinate, where the direction
L04867: is determined by whichever way is downhill (figure 6.9c). This simple algorithm makes
L04868: good progress in both directions but will not converge unless it happens to land exactly
L04869: at the minimum. Instead, it will bounce back and forth around the minimum.
L04870: Adaptive moment estimation, or Adam, takes this idea and adds momentum to both
L04871: the estimate of the gradient and the squared gradient:
L04872: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L04875: <!-- page 103 -->
L04876: 6.4
L04877: Adam
L04878: 89
L04879: Figure 6.9 Adaptive moment estimation (Adam). a) This loss function changes
L04880: quickly in the vertical direction but slowly in the horizontal direction. If we run
L04881: full-batch gradient descent with a learning rate that makes good progress in the
L04882: vertical direction, then the algorithm takes a long time to reach the final hor-
L04883: izontal position. b) If the learning rate is chosen so that the algorithm makes
L04884: good progress in the horizontal direction, it overshoots in the vertical direction
L04885: and becomes unstable. c) A straightforward approach is to move a fixed distance
L04886: along each axis at each step so that we move downhill in both directions. This is
L04887: accomplished by normalizing the gradient magnitude and retaining only the sign.
L04888: However, this does not usually converge to the exact minimum but instead oscil-
L04889: lates back and forth around it (here between the last two points). d) The Adam
L04890: algorithm uses momentum in both the estimated gradient and the normalization
L04891: term, which creates a smoother path.
L04892: Draft: please send errata to udlbookmail@gmail.com.
