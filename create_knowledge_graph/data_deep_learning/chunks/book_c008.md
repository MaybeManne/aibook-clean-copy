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
L04895: <!-- page 104 -->
L04896: 90
L04897: 6
L04898: Fitting models
L04899: mt+1
L04900: ←
L04901: β · mt + (1 −β)∂L[ϕt]
L04902: ∂ϕ
L04903: vt+1
L04904: ←
L04905: γ · vt + (1 −γ)
L04906: ∂L[ϕt]
L04907: ∂ϕ
L04908: 2
L04909: ,
L04910: (6.15)
L04911: where β and γ are the momentum coeﬀicients for the two statistics.
L04912: Using momentum is equivalent to taking a weighted average over the history of each
L04913: of these statistics. At the start of the procedure, all the previous measurements are
L04914: effectively zero, resulting in unrealistically small estimates. Consequently, we modify
L04915: these statistics using the rule:
L04916: ˜mt+1
L04917: ←
L04918: mt+1
L04919: 1 −βt+1
L04920: ˜vt+1
L04921: ←
L04922: vt+1
L04923: 1 −γt+1 .
L04924: (6.16)
L04925: Since β and γ are in the range [0, 1), the terms with exponents t+1 become smaller
L04926: with each time step, the denominators become closer to one, and this modification has
L04927: a diminishing effect.
L04928: Finally, we update the parameters as before, but with the modified terms:
L04929: ϕt+1
L04930: ←
L04931: ϕt −α ·
L04932: ˜mt+1
L04933: p
L04934: ˜vt+1 + ϵ.
L04935: (6.17)
L04936: The result is an algorithm that can converge to the overall minimum and makes good
L04937: Notebook 6.5
L04938: Adam
L04939: progress in every direction in the parameter space. Note that Adam is usually used in a
L04940: stochastic setting where the gradients and their squares are computed from mini-batches:
L04941: mt+1
L04942: ←
L04943: β · mt + (1 −β)
L04944: X
L04945: i∈Bt
L04946: ∂ℓi[ϕt]
L04947: ∂ϕ
L04948: vt+1
L04949: ←
L04950: γ · vt + (1 −γ)
L04951:  X
L04952: i∈Bt
L04953: ∂ℓi[ϕt]
L04954: ∂ϕ
L04955: !2
L04956: ,
L04957: (6.18)
L04958: and so the trajectory is noisy in practice.
L04959: As we shall see in chapter 7, the gradient magnitudes of neural network parameters
L04960: can depend on their depth in the network. Adam helps compensate for this tendency
L04961: and balances out changes across the different layers. In practice, Adam also has the
L04962: advantage of being less sensitive to the initial learning rate because it avoids situations
L04963: like those in figures 6.9a–b, so it doesn’t need complex learning rate schedules.
L04964: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L04967: <!-- page 105 -->
L04968: 6.5
L04969: Training algorithm hyperparameters
L04970: 91
L04971: 6.5
L04972: Training algorithm hyperparameters
L04973: The choices of learning algorithm, batch size, learning rate schedule, and momentum
L04974: coeﬀicients are all considered hyperparameters of the training algorithm; these directly
L04975: affect the final model performance but are distinct from the model parameters. Choosing
L04976: these can be more art than science, and it’s common to train many models with different
L04977: hyperparameters and choose the best one. This is known as hyperparameter search. We
L04978: return to this issue in chapter 8.
L04979: 6.6
L04980: Summary
L04981: This chapter discussed model training. This problem was framed as finding parameters ϕ
L04982: that corresponded to the minimum of a loss function L[ϕ]. The gradient descent method
L04983: measures the gradient of the loss function for the current parameters (i.e., how the loss
L04984: changes when we make a small change to the parameters). Then it moves the parameters
L04985: in the direction that decreases the loss fastest. This is repeated until convergence.
L04986: For nonlinear functions, the loss function may have both local minima (where gradi-
L04987: ent descent gets trapped) and saddle points (where gradient descent may appear to have
L04988: converged but has not). Stochastic gradient descent helps mitigate these problems.1 At
L04989: each iteration, we use a different random subset of the data (a batch) to compute the
L04990: gradient. This adds noise to the process and helps prevent the algorithm from getting
L04991: trapped in a sub-optimal region of parameter space. Each iteration is also computation-
L04992: ally cheaper since it only uses a subset of the data. We saw that adding a momentum
L04993: term makes convergence more eﬀicient. Finally, we introduced the Adam algorithm.
L04994: The ideas in this chapter apply to optimizing any model. The next chapter tackles
L04995: two aspects of training specific to neural networks. First, we address how to compute
L04996: the gradients of the loss with respect to the parameters of a neural network. This is
L04997: accomplished using the famous backpropagation algorithm. Second, we discuss how to
L04998: initialize the network parameters before optimization begins. Without careful initializa-
L04999: tion, the gradients used by the optimization can become extremely large or extremely
L05000: small, which can hinder the training process.
L05001: Notes
L05002: Optimization algorithms:
L05003: Optimization algorithms are used extensively throughout engi-
L05004: neering, and it is generally more typical to use the term objective function rather than loss
L05005: function or cost function. Gradient descent was invented by Cauchy (1847), and stochastic gra-
L05006: dient descent dates back to at least Robbins & Monro (1951). A modern compromise between
L05007: the two is stochastic variance-reduced descent (Johnson & Zhang, 2013), in which the full gra-
L05008: dient is computed periodically, with stochastic updates interspersed. Reviews of optimization
L05009: algorithms for neural networks can be found in Ruder (2016), Bottou et al. (2018), and Sun
L05010: (2020). Bottou (2012) discusses best practice for SGD, including shuffling without replacement.
L05011: 1Chapter 20 discusses the extent to which saddle points and local minima really are problems in
L05012: deep learning. In practice, deep networks are surprisingly easy to train.
L05013: Draft: please send errata to udlbookmail@gmail.com.
L05016: <!-- page 106 -->
L05017: 92
L05018: 6
L05019: Fitting models
L05020: Convexity, minima, and saddle points:
L05021: A function is convex if every chord (line segment
L05022: between two points on the surface) lies above the function and does not intersect it. This can
L05023: be tested algebraically by considering the Hessian matrix (the matrix of second derivatives):
L05024: H[ϕ] =
L05025: 
L05026: 
L05027: ∂2L
L05028: ∂ϕ2
L05029: 0
L05030: ∂2L
L05031: ∂ϕ0∂ϕ1
L05032: . . .
L05033: ∂2L
L05034: ∂ϕ0∂ϕN
L05035: ∂2L
L05036: ∂ϕ1∂ϕ0
L05037: ∂2L
L05038: ∂ϕ2
L05039: 1
L05040: . . .
L05041: ∂2L
L05042: ∂ϕ1∂ϕN
L05043: ...
L05044: ...
L05045: ...
L05046: ...
L05047: ∂2L
L05048: ∂ϕN ∂ϕ0
L05049: ∂2L
L05050: ∂ϕN ∂ϕ1
L05051: . . .
L05052: ∂2L
L05053: ∂ϕ2
L05054: N
L05055: 
L05056: 
L05057: .
L05058: (6.19)
L05059: If the Hessian matrix is positive definite (has positive eigenvalues) for all possible parameter
L05060: Appendix B.3.7
L05061: Eigenvalues
L05062: values, then the function is convex; the loss function will look like a smooth bowl (as in fig-
L05063: ure 6.1c), so training will be relatively easy. There will be a single global minimum and no local
L05064: minima or saddle points.
L05065: For any loss function, the eigenvalues of the Hessian matrix at places where the gradient is
L05066: zero allow us to classify this position as (i) a minimum (the eigenvalues are all positive), (ii)
L05067: a maximum (the eigenvalues are all negative), or (iii) a saddle point (positive eigenvalues are
L05068: associated with directions in which we are at a minimum and negative ones with directions
L05069: where we are at a maximum).
L05070: Line search:
L05071: Gradient descent with a fixed step size is ineﬀicient because the distance moved
L05072: depends entirely on the magnitude of the gradient. It moves a long distance when the function
L05073: is changing fast (where perhaps it should be more cautious) but a short distance when the
L05074: function is changing slowly (where perhaps it should explore further). For this reason, gradient
L05075: descent methods are usually combined with a line search procedure in which we sample the
L05076: function along the desired direction to try to find the optimal step size. One such approach
L05077: is bracketing (figure 6.10). Another problem with gradient descent is that it tends to lead to
L05078: ineﬀicient oscillatory behavior when descending valleys (e.g., path 1 in figure 6.5a).
L05079: Beyond gradient descent:
L05080: Numerous algorithms have been developed that remedy the prob-
L05081: lems of gradient descent. Most notable is the Newton method, which takes the curvature of the
L05082: surface into account using the inverse of the Hessian matrix; if the gradient of the function is
L05083: changing quickly, then it applies a more cautious update. This method eliminates the need for
L05084: line search and does not suffer from oscillatory behavior. However, it has its own problems; in
L05085: its simplest form, it moves toward the nearest extremum, but this may be a maximum if we
L05086: are closer to the top of a hill than we are to the bottom of a valley.
L05087: Moreover, computing the
L05088: Problem 6.11
L05089: inverse Hessian is intractable when the number of parameters is large, as in neural networks.
L05090: Properties of SGD:
L05091: The limit of SGD as the learning rate tends to zero is a stochastic
L05092: differential equation. Jastrzębski et al. (2018) showed that this equation relies on the learning-
L05093: rate to batch size ratio and that there is a relation between the learning rate to batch size ratio
L05094: and the width of the minimum found. Wider minima are considered more desirable; if the loss
L05095: function for test data is similar, then small errors in the parameter estimates will have little
L05096: effect on test performance. He et al. (2019) prove a generalization bound for SGD that has a
L05097: positive correlation with the ratio of batch size to learning rate. They train a large number of
L05098: models on different architectures and datasets and find empirical evidence that test accuracy
L05099: improves when the ratio of batch size to learning rate is low. Smith et al. (2018) and Goyal et al.
L05100: (2018) also identified the ratio of batch size to learning rate as being important for generalization
L05101: (see figure 20.10).
L05102: Momentum:
L05103: The idea of using momentum to speed up optimization dates to Polyak (1964).
L05104: Goh (2017) presents an in-depth discussion of the properties of momentum.
L05105: The Nesterov
L05106: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L05109: <!-- page 107 -->
L05110: Notes
L05111: 93
L05112: Figure 6.10 Line search using the bracketing approach. a) The current solution is
L05113: at position a (orange point), and we wish to search the region [a, d] (gray shaded
L05114: area). We define two points b, c interior to the search region and evaluate the loss
L05115: function at these points. Here L[b] > L[c], so we eliminate the range [a, b]. b) We
L05116: now repeat this procedure in the refined search region and find that L[b] < L[c],
L05117: so we eliminate the range [c, d]. c) We repeat this process until this minimum is
L05118: closely bracketed.
L05119: accelerated gradient method was introduced by Nesterov (1983). Nesterov momentum was first
L05120: applied in the context of stochastic gradient descent by Sutskever et al. (2013).
L05121: Adaptive training algorithms:
L05122: AdaGrad (Duchi et al., 2011) is an optimization algorithm
L05123: that addresses the possibility that some parameters may have to move further than others by
L05124: assigning a different learning rate to each parameter. AdaGrad uses the cumulative squared
L05125: gradient for each parameter to attenuate its learning rate. This has the disadvantage that the
L05126: learning rates decrease over time, and learning can halt before the minimum is found. RMSProp
L05127: (Hinton et al., 2012a) and AdaDelta (Zeiler, 2012) modified this algorithm to help prevent these
L05128: problems by recursively updating the squared gradient term.
L05129: By far the most widely used adaptive training algorithm is adaptive moment optimization or
L05130: Adam (Kingma & Ba, 2015). This combines the ideas of momentum (in which the gradient
L05131: vector is averaged over time) and AdaGrad, AdaDelta, and RMSProp (in which a smoothed
L05132: squared gradient term is used to modify the learning rate for each parameter). The original
L05133: paper on the Adam algorithm provided a convergence proof for convex loss functions, but a
L05134: counterexample was identified by Reddi et al. (2018), who developed a modification of Adam
L05135: called AMSGrad, which does converge. Of course, in deep learning, the loss functions are non-
L05136: convex, and Zaheer et al. (2018) subsequently developed an adaptive algorithm called YOGI
L05137: and proved that it converges in this scenario. Regardless of these theoretical objections, the
L05138: original Adam algorithm works well in practice and is widely used, not least because it works
L05139: well over a broad range of hyperparameters and makes rapid initial progress.
L05140: One potential problem with adaptive training algorithms is that the learning rates are based on
L05141: accumulated statistics of the observed gradients. At the start of training, when there are few
L05142: samples, these statistics may be very noisy. This can be remedied by learning rate warm-up
L05143: (Goyal et al., 2018), in which the learning rates are gradually increased over the first few thou-
L05144: sand iterations. An alternative solution is rectified Adam (Liu et al., 2021a), which gradually
L05145: Draft: please send errata to udlbookmail@gmail.com.
L05148: <!-- page 108 -->
L05149: 94
L05150: 6
L05151: Fitting models
L05152: changes the momentum term over time in a way that helps avoid high variance. Dozat (2016)
L05153: incorporated Nesterov momentum into the Adam algorithm.
L05154: SGD vs. Adam:
L05155: There has been a lively discussion about the relative merits of SGD and
L05156: Adam. Wilson et al. (2017) provided evidence that SGD with momentum can find lower minima
L05157: than Adam, which generalizes better over a variety of deep learning tasks. However, this is
L05158: strange since SGD is a special case of Adam (when β = 0, γ →1) once the modification
L05159: term (equation 6.16) becomes one, which happens quickly. It is hence more likely that SGD
L05160: outperforms Adam when we use Adam’s default hyperparameters. Loshchilov & Hutter (2019)
L05161: proposed AdamW, which substantially improves the performance of Adam in the presence of
L05162: L2 regularization (see section 9.1). Choi et al. (2019) provide evidence that if we search for the
L05163: best Adam hyperparameters, it performs just as well as SGD and converges faster. Keskar &
L05164: Socher (2017) proposed a method called SWATS that starts using Adam (to make rapid initial
L05165: progress) and then switches to SGD (to get better final generalization performance).
L05166: Exhaustive search:
L05167: All the algorithms discussed in this chapter are iterative. A completely
L05168: different approach is to quantize the network parameters and exhaustively search the resulting
L05169: discretized parameter space using SAT solvers (Mézard & Mora, 2009).
L05170: This approach has
L05171: the potential to find the global minimum and provide a guarantee that there is no lower loss
L05172: elsewhere but is only practical for very small models.
L05173: Problems
L05174: Problem 6.1 Show that the derivatives of the least squares loss function in equation 6.5 are
L05175: given by the expressions in equation 6.7.
L05176: Problem 6.2 A surface is guaranteed to be convex if the eigenvalues of the Hessian H[ϕ] are
L05177: positive everywhere. In this case, the surface has a unique minimum, and optimization is easy.
L05178: Find an algebraic expression for the Hessian matrix,
L05179: H[ϕ] =
L05180: 
L05181: 
L05182: ∂2L
L05183: ∂ϕ2
L05184: 0
L05185: ∂2L
L05186: ∂ϕ0∂ϕ1
L05187: ∂2L
L05188: ∂ϕ1∂ϕ0
L05189: ∂2L
L05190: ∂ϕ2
L05191: 1
L05192: 
L05193: ,
L05194: (6.20)
L05195: for the linear regression model (equation 6.5). Prove that this function is convex when there
L05196: Appendix B.3.7
L05197: Eigenvalues
L05198: Appendix B.3.8
L05199: Trace
L05200: Appendix B.3.8
L05201: Determinant
L05202: are at least two different samples xi by showing that the eigenvalues are always positive. This
L05203: can be done by showing that both the trace and the determinant of the matrix are positive.
L05204: Problem 6.3 Compute the derivatives of the least squares loss L[ϕ] with respect to the param-
L05205: eters ϕ0 and ϕ1 for the Gabor model (equation 6.8).
L05206: Problem 6.4∗The logistic regression model uses a linear function to assign an input x to one
L05207: of two classes y ∈{0, 1}. For a 1D input and a 1D output, it has two parameters, ϕ0 and ϕ1,
L05208: and is defined by:
L05209: Pr(y = 1|x) = sig[ϕ0 + ϕ1x],
L05210: (6.21)
L05211: where sig[•] is the logistic sigmoid function:
L05212: sig[z] =
L05213: 1
L05214: 1 + exp[−z].
L05215: (6.22)
L05216: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L05219: <!-- page 109 -->
L05220: Notes
L05221: 95
L05222: Figure 6.11 Three 1D loss functions for problem 6.6.
L05223: (i) Plot y against x for this model for different values of ϕ0 and ϕ1 and explain the qualitative
L05224: meaning of each parameter. (ii) What is a suitable loss function for this model? (iii) Compute
L05225: the derivatives of this loss function with respect to the parameters. (iv) Generate ten data
L05226: points from a normal distribution with mean -1 and standard deviation 1 and assign them the
L05227: label y = 0. Generate another ten data points from a normal distribution with mean 1 and
L05228: standard deviation 1 and assign these the label y = 1. Plot the loss as a heatmap in terms of
L05229: the two parameters ϕ0 and ϕ1. (v) Is this loss function convex? How could you prove this?
L05230: Problem 6.5∗Compute the derivatives of the least squares loss with respect to the ten param-
L05231: eters of the simple neural network model introduced in equation 3.1:
L05232: f[x, ϕ] = ϕ0 + ϕ1a[θ10 + θ11x] + ϕ2a[θ20 + θ21x] + ϕ3a[θ30 + θ31x].
L05233: (6.23)
L05234: Think carefully about what the derivative of the ReLU function a[•] will be.
L05235: Problem 6.6 Which of the functions in figure 6.11 is convex? Justify your answer. Characterize
L05236: each of the points 1–7 as (i) a local minimum, (ii) the global minimum, or (iii) neither.
L05237: Problem 6.7∗The gradient descent trajectory for path 1 in figure 6.5a oscillates back and forth
L05238: ineﬀiciently as it moves down the valley toward the minimum. It’s also notable that it turns at
L05239: right angles to the previous direction at each step. Provide a qualitative explanation for these
L05240: phenomena. Propose a solution that might help prevent this behavior.
L05241: Problem 6.8∗Can (non-stochastic) gradient descent with a fixed learning rate escape local
L05242: minima?
L05243: Problem 6.9 We run the stochastic gradient descent algorithm for 1,000 iterations on a dataset
L05244: of size 100 with a batch size of 20. For how many epochs did we train the model?
L05245: Problem 6.10 Show that the momentum term mt (equation 6.11) is an infinite weighted sum
L05246: of the gradients at the previous iterations and derive an expression for the coeﬀicients (weights)
L05247: of that sum.
L05248: Problem 6.11 What dimensions will the Hessian have if the model has one million parameters?
L05249: Draft: please send errata to udlbookmail@gmail.com.
L05252: <!-- page 110 -->
L05253: Chapter 7
L05254: Gradients and initialization
L05255: Chapter 6 introduced iterative optimization algorithms. These are general-purpose meth-
L05256: ods for finding the minimum of a function. In the context of neural networks, they find
L05257: parameters that minimize the loss so that the model accurately predicts the training
L05258: outputs from the inputs. The basic approach is to choose initial parameters randomly
L05259: and then make a series of small changes that decrease the loss on average. Each change is
L05260: based on the gradient of the loss with respect to the parameters at the current position.
L05261: This chapter discusses two issues that are specific to neural networks.
L05262: First, we
L05263: consider how to calculate the gradients eﬀiciently. This is a serious challenge since the
L05264: largest models at the time of writing have ∼1012 parameters, and the gradient needs to
L05265: be computed for every parameter at every iteration of the training algorithm. Second,
L05266: we consider how to initialize the parameters. If this is not done carefully, the initial
L05267: losses and their gradients can be extremely large or small. In either case, this impedes
L05268: the training process.
L05269: 7.1
L05270: Problem definitions
L05271: Consider a network f[x, ϕ] with multivariate input x, parameters ϕ, and three hidden
L05272: layers h1, h2, and h3:
L05273: h1
L05274: =
L05275: a[β0 + Ω0x]
L05276: h2
L05277: =
L05278: a[β1 + Ω1h1]
L05279: h3
L05280: =
L05281: a[β2 + Ω2h2]
L05282: f[x, ϕ]
L05283: =
L05284: β3 + Ω3h3,
L05285: (7.1)
L05286: where the function a[•] applies the activation function separately to every element of the
L05287: input. The model parameters ϕ = {β0, Ω0, β1, Ω1, β2, Ω2, β3, Ω3} consist of the bias
L05288: vectors βk and weight matrices Ωk between every layer (figure 7.1).
L05289: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L05292: <!-- page 111 -->
L05293: 7.2
L05294: Computing derivatives
L05295: 97
L05296: We also have individual loss terms ℓi, which return the negative log-likelihood of
L05297: the ground truth label yi given the model prediction f[xi, ϕ] for training input xi. For
L05298: example, this might be the least squares loss ℓi = (f[xi, ϕ] −yi)2. The total loss is the
L05299: sum of these terms over the training data:
L05300: L[ϕ] =
L05301: I
L05302: X
L05303: i=1
L05304: ℓi.
L05305: (7.2)
L05306: The most commonly used optimization algorithm for training neural networks is
L05307: stochastic gradient descent (SGD), which updates the parameters as:
L05308: ϕt+1 ←−ϕt −α
L05309: X
L05310: i∈Bt
L05311: ∂ℓi[ϕt]
L05312: ∂ϕ
L05313: ,
L05314: (7.3)
L05315: where α is the learning rate, and Bt contains the batch indices at iteration t. To compute
L05316: this update, we need to calculate the derivatives:
L05317: ∂ℓi
L05318: ∂βk
L05319: and
L05320: ∂ℓi
L05321: ∂Ωk
L05322: ,
L05323: (7.4)
L05324: for the parameters {βk, Ωk} at every layer k ∈{0, 1, . . . , K} and for each index i in
L05325: Problem 7.1
L05326: the batch. The first part of this chapter describes the backpropagation algorithm, which
L05327: computes these derivatives eﬀiciently.
L05328: In the second part of the chapter, we consider how to initialize the network parameters
L05329: before we commence training. We describe methods to choose the initial weights Ωk and
L05330: biases βk so that training is stable.
L05331: 7.2
L05332: Computing derivatives
L05333: The derivatives of the loss tell us how the loss changes when we make a small change
L05334: to the parameters. Optimization algorithms exploit this information to manipulate the
L05335: parameters so that the loss becomes smaller. The backpropagation algorithm computes
L05336: these derivatives. The mathematical details are somewhat involved, so we first make two
L05337: observations that provide some intuition.
L05338: Observation 1:
L05339: Each weight (element of Ωk) multiplies the activation at a source hidden
L05340: unit and adds the result to a destination hidden unit in the next layer. It follows that the
L05341: effect of any small change to the weight is amplified or attenuated by the activation at
L05342: the source hidden unit. Hence, we run the network for each data example in the batch
L05343: and store the activations of all the hidden units. This is known as the forward pass
L05344: (figure 7.1). The stored activations will subsequently be used to compute the gradients.
L05345: Observation 2:
L05346: A small change in a bias or weight causes a ripple effect of changes
L05347: through the subsequent network. The change modifies the value of its destination hidden
L05348: Draft: please send errata to udlbookmail@gmail.com.
L05351: <!-- page 112 -->
L05352: 98
L05353: 7
L05354: Gradients and initialization
L05355: Figure 7.1 Backpropagation forward pass. The goal is to compute the derivatives
L05356: of the loss ℓwith respect to each of the weights (arrows) and biases (not shown).
L05357: In other words, we want to know how a small change to each parameter will affect
L05358: the loss. Each weight multiplies the hidden unit at its source and contributes the
L05359: result to the hidden unit at its destination. Consequently, the effects of any small
L05360: change to the weight will be scaled by the activation of the source hidden unit.
L05361: For example, the blue weight is applied to the second hidden unit at layer 1; if
L05362: the activation of this unit doubles, then the effect of a small change to the blue
L05363: weight will double too. Hence, to compute the derivatives of the weights, we need
L05364: to calculate and store the activations at the hidden layers. This is known as the
L05365: forward pass since it involves running the network equations sequentially.
L05366: unit. This, in turn, changes the values of the hidden units in the subsequent layer, which
L05367: will change the hidden units in the layer after that, and so on, until a change is made to
L05368: the model output and, finally, the loss.
L05369: Hence, to know how changing a parameter modifies the loss, we also need to know
L05370: how changes to every subsequent hidden layer will, in turn, modify their successor. These
L05371: same quantities are required when considering other parameters in the same or earlier
L05372: layers. It follows that we can calculate them once and reuse them. For example, consider
L05373: computing the effect of a small change in weights that feed into hidden layers h3, h2,
L05374: and h1, respectively:
L05375: • To calculate how a small change in a weight or bias feeding into hidden layer h3
L05376: modifies the loss, we need to know (i) how a change in layer h3 changes the model
L05377: output f, and (ii) how a change in this output changes the loss ℓ(figure 7.2a).
L05378: • To calculate how a small change in a weight or bias feeding into hidden layer h2
L05379: modifies the loss, we need to know (i) how a change in layer h2 affects h3, (ii) how h3
L05380: changes the model output, and (iii) how this output changes the loss (figure 7.2b).
L05381: • To calculate how a small change in a weight or bias feeding into hidden layer h1
L05382: modifies the loss, we need to know (i) how a change in layer h1 affects layer h2,
L05383: (ii) how a change in layer h2 affects layer h3, (iii) how layer h3 changes the model
L05384: output, and (iv) how the model output changes the loss (figure 7.2c).
L05385: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L05388: <!-- page 113 -->
L05389: 7.2
L05390: Computing derivatives
L05391: 99
L05392: Figure 7.2 Backpropagation backward pass.
L05393: a) To compute how a change to
L05394: a weight feeding into layer h3 (blue arrow) changes the loss, we need to know
L05395: how the hidden unit in h3 changes the model output f and how f changes the
L05396: loss (orange arrows).
L05397: b) To compute how a small change to a weight feeding
L05398: into h2 (blue arrow) changes the loss, we need to know (i) how the hidden unit
L05399: in h2 changes h3, (ii) how h3 changes f, and (iii) how f changes the loss (orange
L05400: arrows). c) Similarly, to compute how a small change to a weight feeding into h1
L05401: (blue arrow) changes the loss, we need to know how h1 changes h2 and how
L05402: these changes propagate through to the loss (orange arrows). The backward pass
L05403: first computes derivatives at the end of the network and then works backward to
L05404: exploit the inherent redundancy of these computations.
L05405: Draft: please send errata to udlbookmail@gmail.com.
L05408: <!-- page 114 -->
L05409: 100
L05410: 7
L05411: Gradients and initialization
L05412: As we move backward through the network, we see that most of the terms we need
L05413: were already calculated in the previous step, so we do not need to re-compute them.
L05414: Proceeding backward through the network in this way to compute the derivatives is
L05415: known as the backward pass.
L05416: The ideas behind backpropagation are relatively easy to understand. However, the
L05417: derivation requires matrix calculus because the bias and weight terms are vectors and
L05418: matrices, respectively. To help grasp the underlying mechanics, the following section
L05419: derives backpropagation for a simpler toy model with scalar parameters. We then apply
L05420: the same approach to a deep neural network in section 7.4.
L05421: 7.3
L05422: Toy example
L05423: Consider a model f[x, ϕ] with eight scalar parameters ϕ = {β0, ω0, β1, ω1, β2, ω2, β3, ω3}
L05424: that consists of a composition of the functions sin[•], exp[•], and cos[•]:
L05425: f[x, ϕ] = β3 + ω3 · cos
L05426: h
L05427: β2 + ω2 · exp
L05428: 
L05429: β1 + ω1 · sin[β0 + ω0 · x]
L05430: i
L05431: ,
L05432: (7.5)
L05433: and a least squares loss function L[ϕ] = P
L05434: i ℓi with individual terms:
L05435: ℓi = (f[xi, ϕ] −yi)2,
L05436: (7.6)
L05437: where, as usual, xi is the ith training input, and yi is the ith training output. You can
L05438: think of this as a simple neural network with one input, one output, one hidden unit at
L05439: each layer, and different activation functions sin[•], exp[•], and cos[•] between each layer.
L05440: We aim to compute the derivatives:
L05441: ∂ℓi
L05442: ∂β0
L05443: ,
L05444: ∂ℓi
L05445: ∂ω0
L05446: ,
L05447: ∂ℓi
L05448: ∂β1
L05449: ,
L05450: ∂ℓi
L05451: ∂ω1
L05452: ,
L05453: ∂ℓi
L05454: ∂β2
L05455: ,
L05456: ∂ℓi
L05457: ∂ω2
L05458: ,
L05459: ∂ℓi
L05460: ∂β3
L05461: ,
L05462: and
L05463: ∂ℓi
L05464: ∂ω3
L05465: .
L05466: (7.7)
L05467: Of course, we could find expressions for these derivatives by hand and compute them
L05468: directly. However, some of these expressions are quite complex. For example:
L05469: ∂ℓi
L05470: ∂ω0
L05471: =
L05472: −2
L05473: 
L05474: β3 + ω3 · cos
L05475: h
L05476: β2 + ω2 · exp
L05477: 
L05478: β1 + ω1 · sin[β0 + ω0 · xi]
L05479: i
L05480: −yi
L05481: 
L05482: ·ω1ω2ω3 · xi · cos[β0 + ω0 · xi] · exp
L05483: h
L05484: β1 + ω1 · sin[β0 + ω0 · xi]
L05485: i
L05486: · sin
L05487: 
L05488: β2 + ω2 · exp
L05489: h
L05490: β1 + ω1 · sin[β0 + ω0 · xi]
L05491: i
L05492: .
L05493: (7.8)
L05494: Such expressions are awkward to derive and code without mistakes and do not exploit
L05495: the inherent redundancy; notice that the three exponential terms are the same.
L05496: The backpropagation algorithm is an eﬀicient method for computing all of these
L05497: derivatives at once. It consists of (i) a forward pass, in which we compute and store a
L05498: series of intermediate values and the network output, and (ii) a backward pass, in which
L05499: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L05502: <!-- page 115 -->
L05503: 7.3
L05504: Toy example
L05505: 101
L05506: Figure 7.3 Backpropagation forward pass. We compute and store each of the
L05507: intermediate variables in turn until we finally calculate the loss.
L05508: we calculate the derivatives of each parameter, starting at the end of the network, and
L05509: reusing previous calculations as we move toward the start.
L05510: Forward pass:
L05511: We treat the computation of the loss as a series of calculations:
L05512: f0
L05513: =
L05514: β0 + ω0 · xi
L05515: h1
L05516: =
L05517: sin[f0]
L05518: f1
L05519: =
L05520: β1 + ω1 · h1
L05521: h2
L05522: =
L05523: exp[f1]
L05524: f2
L05525: =
L05526: β2 + ω2 · h2
L05527: h3
L05528: =
L05529: cos[f2]
L05530: f3
L05531: =
L05532: β3 + ω3 · h3
L05533: ℓi
L05534: =
L05535: (f3 −yi)2.
L05536: (7.9)
L05537: We compute and store the values of the intermediate variables fk and hk (figure 7.3).
L05538: Backward pass #1:
L05539: We now compute the derivatives of ℓi with respect to these inter-
L05540: mediate variables, but in reverse order:
L05541: ∂ℓi
L05542: ∂f3
L05543: ,
L05544: ∂ℓi
L05545: ∂h3
L05546: ,
L05547: ∂ℓi
L05548: ∂f2
L05549: ,
L05550: ∂ℓi
L05551: ∂h2
L05552: ,
L05553: ∂ℓi
L05554: ∂f1
L05555: ,
L05556: ∂ℓi
L05557: ∂h1
L05558: ,
L05559: and
L05560: ∂ℓi
L05561: ∂f0
L05562: .
L05563: (7.10)
L05564: The first of these derivatives is straightforward:
L05565: ∂ℓi
L05566: ∂f3
L05567: = 2(f3 −yi).
L05568: (7.11)
L05569: The next derivative can be calculated using the chain rule:
L05570: ∂ℓi
L05571: ∂h3
L05572: = ∂f3
L05573: ∂h3
L05574: ∂ℓi
L05575: ∂f3
L05576: .
L05577: (7.12)
L05578: The left-hand side asks how ℓi changes when h3 changes. The right-hand side says we can
L05579: decompose this into (i) how f3 changes when h3 changes and (ii) how ℓi changes when f3
L05580: changes. In the original equations, h3 changes f3, which changes ℓi, and the derivatives
L05581: Draft: please send errata to udlbookmail@gmail.com.
