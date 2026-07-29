L03087: <!-- page 72 -->
L03088: 58
L03089: 5
L03090: Loss functions
L03091: 5.1.1
L03092: Computing a distribution over outputs
L03093: This shift in perspective raises the question of exactly how a model f[x, ϕ] can be adapted
L03094: to compute a probability distribution. The solution is simple. First, we choose a para-
L03095: metric distribution Pr(y|θ) defined on the output domain y. Then we use the network
L03096: to compute one or more of the parameters θ of this distribution.
L03097: For example, suppose the prediction domain is the set of real numbers, so y ∈R.
L03098: Here, we might choose the univariate normal distribution, which is defined on R. This
L03099: distribution is defined by the mean µ and variance σ2, so θ = {µ, σ2}. The machine
L03100: learning model might predict the mean µ, and the variance σ2 could be treated as an
L03101: unknown constant.
L03102: 5.1.2
L03103: Maximum likelihood criterion
L03104: The model now computes different distribution parameters θi = f[xi, ϕ] for each training
L03105: input xi.
L03106: Each observed training output yi should have high probability under its
L03107: corresponding distribution Pr(yi|θi). Hence, we choose the model parameters ϕ so that
L03108: they maximize the combined probability across all I training examples:
L03109: ˆϕ
L03110: =
L03111: argmax
L03112: ϕ
L03113: " IY
L03114: i=1
L03115: Pr(yi|xi)
L03116: #
L03117: =
L03118: argmax
L03119: ϕ
L03120: " IY
L03121: i=1
L03122: Pr(yi|θi)
L03123: #
L03124: =
L03125: argmax
L03126: ϕ
L03127: " IY
L03128: i=1
L03129: Pr(yi|f[xi, ϕ])
L03130: #
L03131: .
L03132: (5.1)
L03133: The combined probability term is the likelihood of the parameters, and hence equation 5.1
L03134: is known as the maximum likelihood criterion.1
L03135: Here we are implicitly making two assumptions. First, we assume that the form of
L03136: the probability distribution over the outputs yi is the same for each data point. Second,
L03137: we assume that the conditional distributions Pr(yi|xi) of the output given the input are
L03138: independent, so the total likelihood of the training data decomposes as:
L03139: Appendix C.1.5
L03140: Independence
L03141: Pr(y1, y2, . . . , yI|x1, x2, . . . , xI) =
L03142: IY
L03143: i=1
L03144: Pr(yi|xi).
L03145: (5.2)
L03146: 1A conditional probability Pr(z|ψ) can be considered in two ways.
L03147: As a function of z, it is a
L03148: probability distribution that sums to one. As a function of ψ, it is known as a likelihood and does not
L03149: generally sum to one.
L03150: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L03153: <!-- page 73 -->
L03154: 5.1
L03155: Maximum likelihood
L03156: 59
L03157: Figure 5.2 The log transform. a) The log function is monotonically increasing.
L03158: If z > z′, then log[z] > log[z′]. It follows that the maximum of any function g[z]
L03159: will be at the same position as the maximum of log[g[z]]. b) A function g[z]. c)
L03160: The logarithm of this function log[g[z]]. All positions on g[z] with a positive slope
L03161: retain a positive slope after the log transform, and those with a negative slope
L03162: retain a negative slope. The position of the maximum remains the same.
L03163: 5.1.3
L03164: Maximizing log-likelihood
L03165: The maximum likelihood criterion (equation 5.1) is not very practical.
L03166: Each term
L03167: Pr(yi|f[xi, ϕ]) can be small, so the product of many of these terms can be tiny.
L03168: It
L03169: may be diﬀicult to represent this quantity with finite precision arithmetic. Fortunately,
L03170: we can equivalently maximize the logarithm of the likelihood:
L03171: ˆϕ
L03172: =
L03173: argmax
L03174: ϕ
L03175: " IY
L03176: i=1
L03177: Pr(yi|f[xi, ϕ])
L03178: #
L03179: =
L03180: argmax
L03181: ϕ
L03182: "
L03183: log
L03184: " IY
L03185: i=1
L03186: Pr(yi|f[xi, ϕ])
L03187: ##
L03188: =
L03189: argmax
L03190: ϕ
L03191: " I
L03192: X
L03193: i=1
L03194: log
L03195: h
L03196: Pr(yi|f[xi, ϕ])
L03197: i#
L03198: .
L03199: (5.3)
L03200: This log-likelihood criterion is equivalent because the logarithm is a monotonically in-
L03201: creasing function: if z > z′, then log[z] > log[z′] and vice versa (figure 5.2). It follows
L03202: that when we change the model parameters ϕ to improve the log-likelihood criterion, we
L03203: also improve the original maximum likelihood criterion. It also follows that the overall
L03204: maxima of the two criteria must be in the same place, so the best model parameters ˆϕ
L03205: are the same in both cases. However, the log-likelihood criterion has the practical ad-
L03206: vantage of using a sum of terms, not a product, so representing it with finite precision
L03207: isn’t problematic.
L03208: Draft: please send errata to udlbookmail@gmail.com.
L03211: <!-- page 74 -->
L03212: 60
L03213: 5
L03214: Loss functions
L03215: 5.1.4
L03216: Minimizing negative log-likelihood
L03217: Finally, we note that, by convention, model fitting problems are framed in terms of
L03218: minimizing a loss. To convert the maximum log-likelihood criterion to a minimization
L03219: problem, we multiply by minus one, which gives us the negative log-likelihood criterion:
L03220: ˆϕ
L03221: =
L03222: argmin
L03223: ϕ
L03224: "
L03225: −
L03226: I
L03227: X
L03228: i=1
L03229: log
L03230: h
L03231: Pr(yi|f[xi, ϕ])
L03232: i#
L03233: =
L03234: argmin
L03235: ϕ
L03236: h
L03237: L[ϕ]
L03238: i
L03239: ,
L03240: (5.4)
L03241: which is what forms the final loss function L[ϕ].
L03242: 5.1.5
L03243: Inference
L03244: The network no longer directly predicts the outputs y but instead determines a proba-
L03245: bility distribution over y. When we perform inference, we often want a point estimate
L03246: rather than a distribution, so we return the maximum of the distribution:
L03247: ˆy = argmax
L03248: y
L03249: h
L03250: Pr(y|f[x, ˆϕ])
L03251: i
L03252: .
L03253: (5.5)
L03254: It is usually possible to find an expression for this in terms of the distribution parame-
L03255: ters θ predicted by the model. For example, in the univariate normal distribution, the
L03256: maximum occurs at the mean µ.
L03257: 5.2
L03258: Recipe for constructing loss functions
L03259: The recipe for constructing loss functions for training data {xi, yi} using the maximum
L03260: likelihood approach is hence:
L03261: 1. Choose a suitable probability distribution Pr(y|θ) defined over the domain of the
L03262: predictions y with distribution parameters θ.
L03263: 2. Set the machine learning model f[x, ϕ] to predict one or more of these parameters,
L03264: so θ = f[x, ϕ] and Pr(y|θ) = Pr(y|f[x, ϕ]).
L03265: 3. To train the model, find the network parameters ˆϕ that minimize the negative
L03266: log-likelihood loss function over the training dataset pairs {xi, yi}:
L03267: ˆϕ = argmin
L03268: ϕ
L03269: h
L03270: L[ϕ]
L03271: i
L03272: = argmin
L03273: ϕ
L03274: "
L03275: −
L03276: I
L03277: X
L03278: i=1
L03279: log
L03280: h
L03281: Pr(yi|f[xi, ϕ])
L03282: i#
L03283: .
L03284: (5.6)
L03285: 4. To perform inference for a new test example x, return either the full distribu-
L03286: tion Pr(y|f[x, ˆϕ]) or the value where this distribution is maximized.
L03287: We devote most of the rest of this chapter to constructing loss functions for common
L03288: prediction types using this recipe.
L03289: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L03292: <!-- page 75 -->
L03293: 5.3
L03294: Example 1: univariate regression
L03295: 61
L03296: Figure 5.3 The univariate normal distri-
L03297: bution (also known as the Gaussian dis-
L03298: tribution) is defined on the real line z ∈
L03299: R and has parameters µ and σ2.
L03300: The
L03301: mean µ determines the position of the
L03302: peak.
L03303: The positive root of the vari-
L03304: ance σ2 (the standard deviation) de-
L03305: termines the width of the distribution.
L03306: Since the total probability density sums
L03307: to one, the peak becomes higher as the
L03308: variance decreases and the distribution
L03309: becomes narrower.
L03310: 5.3
L03311: Example 1: univariate regression
L03312: We start by considering univariate regression models. Here the goal is to predict a single
L03313: scalar output y ∈R from input x using a model f[x, ϕ] with parameters ϕ. Following
L03314: the recipe, we choose a probability distribution over the output domain y. We select the
L03315: univariate normal distribution (figure 5.3), which is defined over y ∈R. This has two
L03316: parameters (mean µ and variance σ2) and has a probability density function:
L03317: Pr(y|µ, σ2) =
L03318: 1
L03319: √
L03320: 2πσ2 exp
L03321: 
L03322: −(y −µ)2
L03323: 2σ2
L03324: 
L03325: .
L03326: (5.7)
L03327: Second, we set the machine learning model f[x, ϕ] to compute one or more of the param-
L03328: eters of this distribution. Here, we just compute the mean so µ = f[x, ϕ]:
L03329: Pr(y|f[x, ϕ], σ2) =
L03330: 1
L03331: √
L03332: 2πσ2 exp
L03333: 
L03334: −(y −f[x, ϕ])2
L03335: 2σ2
L03336: 
L03337: .
L03338: (5.8)
L03339: We aim to find the parameters ϕ that make the training data {xi, yi} most probable
L03340: under this distribution (figure 5.4). To accomplish this, we choose a loss function L[ϕ]
L03341: based on the negative log-likelihood:
L03342: L[ϕ]
L03343: =
L03344: −
L03345: I
L03346: X
L03347: i=1
L03348: log
L03349: 
L03350: Pr(yi|f[xi, ϕ], σ2)
L03351: 
L03352: =
L03353: −
L03354: I
L03355: X
L03356: i=1
L03357: log
L03358: 
L03359: 1
L03360: √
L03361: 2πσ2 exp
L03362: 
L03363: −(yi −f[xi, ϕ])2
L03364: 2σ2
L03365: 
L03366: .
L03367: (5.9)
L03368: When we train the model, we seek parameters ˆϕ that minimize this loss.
L03369: Draft: please send errata to udlbookmail@gmail.com.
L03372: <!-- page 76 -->
L03373: 62
L03374: 5
L03375: Loss functions
L03376: 5.3.1
L03377: Least squares loss function
L03378: Now let’s perform some algebraic manipulations on the loss function. We seek:
L03379: ˆϕ
L03380: =
L03381: argmin
L03382: ϕ
L03383: "
L03384: −
L03385: I
L03386: X
L03387: i=1
L03388: log
L03389: 
L03390: 1
L03391: √
L03392: 2πσ2 exp
L03393: 
L03394: −(yi −f[xi, ϕ])2
L03395: 2σ2
L03396: #
L03397: =
L03398: argmin
L03399: ϕ
L03400: "
L03401: −
L03402: I
L03403: X
L03404: i=1
L03405: 
L03406: log
L03407: 
L03408: 1
L03409: √
L03410: 2πσ2
L03411: 
L03412: −(yi −f[xi, ϕ])2
L03413: 2σ2
L03414: #
L03415: =
L03416: argmin
L03417: ϕ
L03418: "
L03419: −
L03420: I
L03421: X
L03422: i=1
L03423: −(yi −f[xi, ϕ])2
L03424: 2σ2
L03425: #
L03426: =
L03427: argmin
L03428: ϕ
L03429: " I
L03430: X
L03431: i=1
L03432: (yi −f[xi, ϕ])2
L03433: #
L03434: ,
L03435: (5.10)
L03436: where we removed the first term between the second and third lines because it doesn’t
L03437: depend on ϕ. We removed the denominator between the third and fourth lines, as this is
L03438: just a constant positive scaling factor that does not affect the position of the minimum.
L03439: The result of these manipulations is the least squares loss function that we originally
L03440: introduced when we discussed linear regression in chapter 2:
L03441: L[ϕ] =
L03442: I
L03443: X
L03444: i=1
L03445:  yi −f[xi, ϕ]
L03446: 2.
L03447: (5.11)
L03448: We see that the least squares loss function follows naturally from the assumptions that the
L03449: Notebook 5.1
L03450: Least squares
L03451: loss
L03452: predictions are (i) independent and (ii) drawn from a normal distribution with mean µ =
L03453: f[xi, ϕ] (figure 5.4).
L03454: 5.3.2
L03455: Inference
L03456: The network no longer directly predicts y but instead predicts the mean µ = f[x, ϕ] of
L03457: the normal distribution over y. When we perform inference, we usually want a single
L03458: “best” point estimate ˆy, so we take the maximum of the predicted distribution:
L03459: ˆy = argmax
L03460: y
L03461: h
L03462: Pr(y|f[x, ˆϕ], σ2)
L03463: i
L03464: .
L03465: (5.12)
L03466: For the univariate normal distribution, the maximum position is determined by the mean
L03467: parameter µ (figure 5.3). This is precisely what the model computed, so ˆy = f[x, ˆϕ].
L03468: 5.3.3
L03469: Estimating variance
L03470: To formulate the least squares loss function, we assumed that the network predicted the
L03471: mean of a normal distribution. The final expression in equation 5.11 (perhaps surpris-
L03472: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L03475: <!-- page 77 -->
L03476: 5.3
L03477: Example 1: univariate regression
L03478: 63
L03479: Figure 5.4 Equivalence of least squares and maximum likelihood loss for the
L03480: normal distribution.
L03481: a) Consider the linear model from figure 2.2.
L03482: The least
L03483: squares criterion minimizes the sum of the squares of the deviations (dashed lines)
L03484: between the model prediction f[xi, ϕ] (green line) and the true output values yi
L03485: (orange points). Here the fit is good, so these deviations are small (e.g., for the
L03486: two highlighted points). b) For these parameters, the fit is bad, and the squared
L03487: deviations are large. c) The least squares criterion follows from the assumption
L03488: that the model predicts the mean of a normal distribution over the outputs and
L03489: that we maximize the probability. For the first case, the model fits well, so the
L03490: probability Pr(yi|xi) of the data (horizontal orange dashed lines) is large (and
L03491: the negative log probability is small). d) For the second case, the model fits badly,
L03492: so the probability is small and the negative log probability is large.
L03493: Draft: please send errata to udlbookmail@gmail.com.
L03496: <!-- page 78 -->
L03497: 64
L03498: 5
L03499: Loss functions
L03500: ingly) does not depend on the variance σ2. However, there is nothing to stop us from
L03501: treating σ2 as a learned parameter and minimizing equation 5.9 with respect to both the
L03502: model parameters ϕ and the distribution variance σ2:
L03503: ˆϕ, ˆσ2 = argmin
L03504: ϕ,σ2
L03505: "
L03506: −
L03507: I
L03508: X
L03509: i=1
L03510: log
L03511: 
L03512: 1
L03513: √
L03514: 2πσ2 exp
L03515: 
L03516: −(yi −f[xi, ϕ])2
L03517: 2σ2
L03518: #
L03519: .
L03520: (5.13)
L03521: In inference, the model predicts the mean µ = f[x, ˆϕ] from the input, and we learned the
L03522: variance ˆσ2 during the training process. The former is the best prediction. The latter
L03523: tells us about the uncertainty of the prediction.
L03524: 5.3.4
L03525: Heteroscedastic regression
L03526: The model above assumes that the variance of the data is constant everywhere. However,
L03527: this might be unrealistic. When the uncertainty of the model varies as a function of the
L03528: input data, we refer to this as heteroscedastic (as opposed to homoscedastic, where the
L03529: uncertainty is constant).
L03530: A simple way to model this is to train a neural network f[x, ϕ] that computes both
L03531: the mean and the variance. For example, consider a shallow network with two outputs.
L03532: We denote the first output as f1[x, ϕ] and use this to predict the mean, and we denote
L03533: the second output as f2[x, ϕ] and use it to predict the variance.
L03534: There is one complication; the variance must be positive, but we can’t guarantee
L03535: that the network will always produce a positive output. To ensure that the computed
L03536: variance is positive, we pass the second network output through a function that maps
L03537: an arbitrary value to a positive one. A suitable choice is the squaring function, giving:
L03538: µ
L03539: =
L03540: f1[x, ϕ]
L03541: σ2
L03542: =
L03543: f2[x, ϕ]2,
L03544: (5.14)
L03545: which results in the loss function:
L03546: ˆϕ = argmin
L03547: ϕ
L03548: "
L03549: −
L03550: I
L03551: X
L03552: i=1
L03553: 
L03554: log
L03555: "
L03556: 1
L03557: p
L03558: 2πf2[xi, ϕ]2
L03559: #
L03560: −(yi −f1[xi, ϕ])2
L03561: 2f2[xi, ϕ]2
L03562: #
L03563: .
L03564: (5.15)
L03565: Homoscedastic and heteroscedastic models are compared in figure 5.5.
L03566: 5.4
L03567: Example 2: binary classification
L03568: In binary classification, the goal is to assign the data x to one of two discrete classes y ∈
L03569: {0, 1}. In this context, we refer to y as a label. Examples of binary classification include
L03570: (i) predicting whether a restaurant review is positive (y = 1) or negative (y = 0) from
L03571: text data x and (ii) predicting whether a tumor is present (y = 1) or absent (y = 0)
L03572: from an MRI scan x.
L03573: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L03576: <!-- page 79 -->
L03577: 5.4
L03578: Example 2: binary classification
L03579: 65
L03580: Figure 5.5 Homoscedastic vs. heteroscedastic regression.
L03581: a) A shallow neural
L03582: network for homoscedastic regression predicts just the mean µ of the output
L03583: distribution from the input x. b) The result is that while the mean (blue line)
L03584: is a piecewise linear function of the input x, the variance is constant everywhere
L03585: (arrows and gray region show ±2 standard deviations).
L03586: c) A shallow neural
L03587: network for heteroscedastic regression also predicts the variance σ2 (or, more
L03588: precisely, computes its square root, which we then square).
L03589: d) The standard
L03590: deviation now also becomes a piecewise linear function of the input x.
L03591: Figure 5.6 Bernoulli distribution.
L03592: The
L03593: Bernoulli distribution is defined on the
L03594: domain z ∈{0, 1} and has a single pa-
L03595: rameter λ that denotes the probability
L03596: of observing z = 1. It follows that the
L03597: probability of observing z = 0 is 1 −λ.
L03598: Draft: please send errata to udlbookmail@gmail.com.
L03601: <!-- page 80 -->
L03602: 66
L03603: 5
L03604: Loss functions
L03605: Figure 5.7
L03606: Logistic
L03607: sigmoid
L03608: function.
L03609: This function maps the real line z ∈
L03610: R to numbers between zero and one,
L03611: so sig[z] ∈[0, 1]. An input of 0 is mapped
L03612: to 0.5. Negative inputs are mapped to
L03613: numbers below 0.5, and positive inputs
L03614: to numbers above 0.5.
L03615: Once again, we follow the recipe from section 5.2 to construct the loss function. First,
L03616: we choose a probability distribution over the output space y ∈{0, 1}. A suitable choice
L03617: is the Bernoulli distribution, which is defined on the domain {0, 1}. This has a single
L03618: parameter λ ∈[0, 1] that represents the probability that y takes the value one (figure 5.6):
L03619: Pr(y|λ) =
L03620: (
L03621: 1 −λ
L03622: y = 0
L03623: λ
L03624: y = 1 ,
L03625: (5.16)
L03626: which can equivalently be written as:
L03627: Pr(y|λ) = (1 −λ)1−y · λy.
L03628: (5.17)
L03629: Second, we set the machine learning model f[x, ϕ] to predict the single distribution
L03630: parameter λ. However, λ can only take values in the range [0, 1], and we cannot guarantee
L03631: that the network output will lie in this range. Consequently, we pass the network output
L03632: through a function that maps the real numbers R to [0, 1]. A suitable function is the
L03633: logistic sigmoid (figure 5.7):
L03634: Problem 5.1
L03635: sig[z] =
L03636: 1
L03637: 1 + exp[−z].
L03638: (5.18)
L03639: Hence, we predict the distribution parameter as λ = sig[f[x, ϕ]]. The likelihood is now:
L03640: Pr(y|x) = (1 −sig[f[x, ϕ]])1−y · sig[f[x, ϕ]]y.
L03641: (5.19)
L03642: This is depicted in figure 5.8 for a shallow neural network model. The loss function is
L03643: the negative log-likelihood of the training set:
L03644: L[ϕ] =
L03645: I
L03646: X
L03647: i=1
L03648: −(1 −yi) log
L03649: h
L03650: 1 −sig[f[xi, ϕ]]
L03651: i
L03652: −yi log
L03653: h
L03654: sig[f[xi, ϕ]]
L03655: i
L03656: .
L03657: (5.20)
L03658: For reasons to be explained in section 5.7, this is known as the binary cross-entropy loss.
L03659: The transformed model output sig[f[x, ϕ]] predicts the parameter λ of the Bernoulli
L03660: Notebook 5.2
L03661: Binary
L03662: cross-entropy loss
L03663: distribution.
L03664: This represents the probability that y = 1, and it follows that 1 −λ
L03665: represents the probability that y = 0. When we perform inference, we may want a point
L03666: Problem 5.2
L03667: estimate of y, so we set y = 1 if λ > 0.5 and y = 0 otherwise.
L03668: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L03671: <!-- page 81 -->
L03672: 5.5
L03673: Example 3: multiclass classification
L03674: 67
L03675: Figure 5.8 Binary classification model.
L03676: a) The network output is a piecewise
L03677: linear function that can take arbitrary real values. b) This is transformed by the
L03678: logistic sigmoid function, which compresses these values to the range [0, 1]. c)
L03679: The transformed output predicts the probability λ that y = 1 (solid line). The
L03680: probability that y = 0 is hence 1 −λ (dashed line). For any fixed x (vertical
L03681: slice), we retrieve the two values of a Bernoulli distribution similar to that in
L03682: figure 5.6. The loss function favors model parameters that produce large values
L03683: of λ at positions xi that are associated with positive examples yi = 1 and small
L03684: values of λ at positions associated with negative examples yi = 0.
L03685: Figure 5.9 Categorical distribution. The
L03686: categorical distribution assigns probabil-
L03687: ities to K >2 categories, with associated
L03688: probabilities λ1, λ2, . . . , λK. Here, there
L03689: are five categories, so K = 5. To ensure
L03690: that this is a valid probability distribu-
L03691: tion, each parameter λk must lie in the
L03692: range [0, 1], and all K parameters must
L03693: sum to one.
L03694: 5.5
L03695: Example 3: multiclass classification
L03696: The goal of multiclass classification is to assign an input data example x to one of K > 2
L03697: classes, so y ∈{1, 2, . . . , K}. Real-world examples include (i) predicting which of K = 10
L03698: digits y is present in an image x of a handwritten number and (ii) predicting which of K
L03699: possible words y follows an incomplete sentence x.
L03700: We once more follow the recipe from section 5.2.
L03701: We first choose a distribution
L03702: over the prediction space y.
L03703: In this case, we have y ∈{1, 2, . . . , K}, so we choose
L03704: the categorical distribution (figure 5.9), which is defined on this domain. This has K
L03705: parameters λ1, λ2, . . . , λK, which determine the probability of each category:
L03706: Draft: please send errata to udlbookmail@gmail.com.
L03709: <!-- page 82 -->
L03710: 68
L03711: 5
L03712: Loss functions
L03713: Figure 5.10 Multiclass classification for K =3 classes. a) The network has three
L03714: piecewise linear outputs, which can take arbitrary values. b) After the softmax
L03715: function, these outputs are constrained to be non-negative and sum to one. Hence,
L03716: for a given input x, we compute valid parameters for the categorical distribution:
L03717: any vertical slice of this plot produces three values that sum to one and would
L03718: form the heights of the bars in a categorical distribution similar to figure 5.9.
L03719: Pr(y = k) = λk.
L03720: (5.21)
L03721: The parameters are constrained to take values between zero and one, and they must
L03722: collectively sum to one to ensure a valid probability distribution.
L03723: Then we use a network f[x, ϕ] with K outputs to compute these K parameters from
L03724: the input x. Unfortunately, the network outputs will not necessarily obey the afore-
L03725: mentioned constraints. Consequently, we pass the K outputs of the network through a
L03726: function that ensures these constraints are respected. A suitable choice is the softmax
L03727: function (figure 5.10). This takes an arbitrary vector of length K and returns a vector
L03728: of the same length but where the elements are now in the range [0, 1] and sum to one.
L03729: The kth output of the softmax function is:
L03730: softmaxk[z] =
L03731: exp[zk]
L03732: PK
L03733: k′=1 exp[zk′]
L03734: ,
L03735: (5.22)
L03736: where the exponential functions ensure positivity, and the sum in the denominator en-
L03737: Appendix B.1.3
L03738: Exponential
L03739: function
L03740: sures that the K numbers sum to one.
L03741: The likelihood that input x has label y = k (figure 5.10) is hence:
L03742: Pr(y = k|x) = softmaxk
L03743: h
L03744: f[x, ϕ]
L03745: i
L03746: .
L03747: (5.23)
L03748: The loss function is the negative log-likelihood of the training data:
L03749: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L03752: <!-- page 83 -->
L03753: 5.6
L03754: Multiple outputs
L03755: 69
L03756: L[ϕ]
L03757: =
L03758: −
L03759: I
L03760: X
L03761: i=1
L03762: log
L03763: h
L03764: softmaxyi
L03765: h
L03766: f [xi, ϕ]
L03767: ii
L03768: =
L03769: −
L03770: I
L03771: X
L03772: i=1
L03774: fyi [xi, ϕ] −log
L03775: " K
L03776: X
L03777: k′=1
L03778: exp [ fk′ [xi, ϕ]]
L03779: #!
L03780: ,
L03781: (5.24)
L03782: where fyi[x, ϕ] and fk′[x, ϕ] denote the yth
L03783: i
L03784: and k′th outputs of the network, respectively.
L03785: For reasons that will be explained in section 5.7, this is known as the multiclass cross-
L03786: entropy loss.
L03787: The transformed model output represents a categorical distribution over possible
L03788: Notebook 5.3
L03789: Multiclass
L03790: cross-entropy loss
L03791: classes y ∈{1, 2, . . . , K}. For a point estimate, we take the most probable category ˆy =
L03792: argmaxk
L03793: 
L03794: Pr(y = k | f[x, ˆϕ])
L03795: 
L03796: . This corresponds to whichever curve is highest for that
L03797: value of x in figure 5.10.
L03798: 5.5.1
L03799: Predicting other data types
L03800: In this chapter, we have focused on regression and classification because these problems
L03801: are widespread. However, to make different types of predictions, we simply choose an
L03802: appropriate distribution over that domain and apply the recipe in section 5.2. Figure 5.11
L03803: enumerates a series of probability distributions and their prediction domains. Some of
L03804: Problems 5.3–5.6
L03805: these are explored in the problems at the end of the chapter.
L03806: 5.6
L03807: Multiple outputs
L03808: Often, we wish to make more than one prediction with the same model, so the target
L03809: output y is a vector.
L03810: For example, we might want to predict a molecule’s melting
L03811: and boiling point (a multivariate regression problem, figure 1.2b) or the object class at
L03812: every point in an image (a multivariate classification problem, figure 1.4a). While it
L03813: is possible to define multivariate probability distributions and use a neural network to
L03814: model their parameters as a function of the input, it is more usual to treat each prediction
L03815: as independent.
L03816: Independence implies that we treat the probability Pr(y|f[x, ϕ]) as a product of
L03817: Appendix C.1.5
L03818: Independence
L03819: univariate terms for each element yd ∈y:
L03820: Pr(y|f[x, ϕ]) =
L03821: Y
L03822: d
L03823: Pr(yd|fd[x, ϕ]),
L03824: (5.25)
L03825: where fd[x, ϕ] is the dth set of network outputs, which describe the parameters of the
L03826: distribution over yd. For example, to predict multiple continuous variables yd ∈R, we
L03827: use a normal distribution for each yd, and the network outputs fd[x, ϕ] predict the means
L03828: of these distributions. To predict multiple discrete variables yd ∈{1, 2, . . . , K}, we use a
L03829: Draft: please send errata to udlbookmail@gmail.com.
L03832: <!-- page 84 -->
L03833: 70
L03834: 5
L03835: Loss functions
L03836: Data Type
L03837: Domain
L03838: Distribution
L03839: Use
L03840: univariate, continuous,
L03841: y ∈R
L03842: univariate
L03843: regression
L03844: unbounded
L03845: normal
L03846: univariate, continuous,
L03847: y ∈R
L03848: Laplace
L03849: robust
L03850: unbounded
L03851: or t-distribution
L03852: regression
L03853: univariate, continuous,
L03854: y ∈R
L03855: mixture of
L03856: multimodal
L03857: unbounded
L03858: Gaussians
L03859: regression
L03860: univariate, continuous,
L03861: y ∈R+
L03862: exponential
L03863: predicting
L03864: bounded below
L03865: or gamma
L03866: magnitude
L03867: univariate, continuous,
L03868: y ∈[0, 1]
L03869: beta
L03870: predicting
L03871: bounded
L03872: proportions
L03873: multivariate, continuous,
L03874: y ∈RK
L03875: multivariate
L03876: multivariate
L03877: unbounded
L03878: normal
L03879: regression
L03880: univariate, continuous,
L03881: y ∈(−π, π]
L03882: von Mises
L03883: predicting
L03884: circular
L03885: direction
L03886: univariate, discrete,
L03887: y ∈{0, 1}
L03888: Bernoulli
L03889: binary
L03890: binary
L03891: classification
L03892: univariate, discrete,
L03893: y ∈{1, 2, . . . , K}
L03894: categorical
L03895: multiclass
L03896: bounded
L03897: classification
L03898: univariate, discrete,
L03899: y ∈{0, 1, 2, 3, . . .}
L03900: Poisson
L03901: predicting
L03902: bounded below
L03903: event counts
L03904: multivariate, discrete,
L03905: y ∈Perm[1, 2, . . . , K]
L03906: Plackett-Luce
L03907: ranking
L03908: permutation
L03909: Figure 5.11 Distributions for loss functions for different prediction types.
L03910: categorical distribution for each yd. Here, each set of network outputs fd[x, ϕ] predicts
L03911: the K values that contribute to the categorical distribution for yd.
L03912: When we minimize the negative log probability, this product becomes a sum of terms:
L03913: L[ϕ] = −
L03914: I
L03915: X
L03916: i=1
L03917: log
L03918: h
L03919: Pr(yi|f[xi, ϕ])
L03920: i
L03921: = −
L03922: I
L03923: X
L03924: i=1
L03925: X
L03926: d
L03927: log
L03928: h
L03929: Pr(yid|fd[xi, ϕ])
L03930: i
L03931: .
L03932: (5.26)
L03933: where yid is the dth output from the ith training example.
L03934: To make two or more prediction types simultaneously, we similarly assume the errors
L03935: in each are independent. For example, to predict wind direction and strength, we might
L03936: Problems 5.7–5.10
L03937: choose the von Mises distribution (defined on circular domains) for the direction and
L03938: the exponential distribution (defined on positive real numbers) for the strength. The
L03939: independence assumption implies that the joint likelihood of the two predictions is the
L03940: product of individual likelihoods. These terms will become additive when we compute
L03941: the negative log-likelihood.
L03942: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L03945: <!-- page 85 -->
L03946: 5.7
L03947: Cross-entropy loss
L03948: 71
L03949: Figure 5.12 Cross-entropy method. a) Empirical distribution of training samples
L03950: (arrows denote Dirac delta functions). b) Model distribution (a normal distribu-
L03951: tion with parameters θ = {µ, σ2}). In the cross-entropy approach, we minimize
L03952: the distance (KL divergence) between these two distributions as a function of the
L03953: model parameters θ.
L03954: 5.7
L03955: Cross-entropy loss
L03956: In this chapter, we developed loss functions that minimize negative log-likelihood. How-
L03957: ever, the term cross-entropy loss is also commonplace. In this section, we describe the
L03958: cross-entropy loss and show that it is equivalent to using negative log-likelihood.
L03959: The cross-entropy loss is based on the idea of finding parameters θ that minimize the
L03960: distance between the empirical distribution q(y) of the observed data y and a model dis-
L03961: tribution Pr(y|θ) (figure 5.12). The distance between two probability distributions q(z)
L03962: Appendix C.5.1
L03963: KL Divergence
L03964: and p(z) can be evaluated using the Kullback-Leibler (KL) divergence:
L03965: DKL
L03966: 
L03967: q||p
L03968: 
L03969: =
L03970: Z ∞
L03971: −∞
L03972: q(z) log
L03973: 
L03974: q(z)
L03975: 
L03976: dz −
L03977: Z ∞
L03978: −∞
L03979: q(z) log
L03980: 
L03981: p(z)
L03982: 
L03983: dz.
L03984: (5.27)
L03985: Now consider that we observe an empirical data distribution at points {yi}I
L03986: i=1. We
L03987: can describe this as a weighted sum of point masses:
L03988: q(y) = 1
L03989: I
L03990: I
L03991: X
L03992: i=1
L03993: δ[y −yi],
L03994: (5.28)
L03995: where δ[•] is the Dirac delta function. We want to minimize the KL divergence between
L03996: Appendix B.1.3
L03997: Dirac delta
L03998: function
L03999: the model distribution Pr(y|θ) and this empirical distribution:
L04000: ˆθ
L04001: =
L04002: argmin
L04003: θ
L04004: Z ∞
L04005: −∞
L04006: q(y) log
L04007: 
L04008: q(y)
L04009: 
L04010: dy −
L04011: Z ∞
L04012: −∞
L04013: q(y) log
L04014: 
L04015: Pr(y|θ)
L04016: 
L04017: dy
L04018: 
L04019: =
L04020: argmin
L04021: θ
L04022: 
L04023: −
L04024: Z ∞
L04025: −∞
L04026: q(y) log
L04027: 
L04028: Pr(y|θ)
L04029: 
L04030: dy
L04031: 
L04032: ,
L04033: (5.29)
L04034: Draft: please send errata to udlbookmail@gmail.com.
L04037: <!-- page 86 -->
L04038: 72
L04039: 5
L04040: Loss functions
L04041: where the first term disappears, as it has no dependence on θ. The remaining second
L04042: term is known as the cross-entropy. It can be interpreted as the amount of uncertainty
L04043: that remains in one distribution after taking into account what we already know from
L04044: the other. Now, we substitute in the definition of q(y) from equation 5.28:
L04045: ˆθ
L04046: =
L04047: argmin
L04048: θ
L04049: "
L04050: −
L04051: Z ∞
L04052: −∞
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
