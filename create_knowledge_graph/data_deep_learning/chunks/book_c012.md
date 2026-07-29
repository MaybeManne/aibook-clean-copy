L07621: <!-- page 152 -->
L07622: Chapter 9
L07623: Regularization
L07624: Chapter 8 described how to measure model performance and identified that there could
L07625: be a significant performance gap between the training and test data. Possible reasons for
L07626: this discrepancy include: (i) the model describes statistical peculiarities of the training
L07627: data that are not representative of the true mapping from input to output (overfitting),
L07628: and (ii) the model is unconstrained in areas with no training examples, leading to sub-
L07629: optimal predictions.
L07630: This chapter discusses regularization techniques. These are a family of methods that
L07631: reduce the generalization gap between training and test performance. Strictly speaking,
L07632: regularization involves adding explicit terms to the loss function that favor certain pa-
L07633: rameter choices. However, in machine learning, this term is commonly used to refer to
L07634: any strategy that improves generalization.
L07635: We start by considering regularization in its strictest sense.
L07636: Then we show how
L07637: the stochastic gradient descent algorithm itself favors certain solutions. This is known
L07638: as implicit regularization. Following this, we consider a set of heuristic methods that
L07639: improve test performance.
L07640: These include early stopping, ensembling, dropout, label
L07641: smoothing, and transfer learning.
L07642: 9.1
L07643: Explicit regularization
L07644: Consider fitting a model f[x, ϕ] with parameters ϕ using a training set {xi, yi} of in-
L07645: put/output pairs. We seek the parameters ˆϕ that minimize the loss function L[ϕ] :
L07646: ˆϕ
L07647: =
L07648: argmin
L07649: ϕ
L07650: 
L07651: L[ϕ]
L07652: 
L07653: =
L07654: argmin
L07655: ϕ
L07656: " I
L07657: X
L07658: i=1
L07659: ℓi[xi, yi]
L07660: #
L07661: ,
L07662: (9.1)
L07663: where the individual terms ℓi[xi, yi] measure the mismatch between the network pre-
L07664: dictions f[xi, ϕ] and output targets yi for each training pair. To bias this minimization
L07665: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L07668: <!-- page 153 -->
L07669: 9.1
L07670: Explicit regularization
L07671: 139
L07672: Figure 9.1 Explicit regularization. a) Loss function for Gabor model (see sec-
L07673: tion 6.1.2). Cyan circles represent local minima. Gray circle represents the global
L07674: minimum. b) The regularization term favors parameters close to the center of the
L07675: plot by adding an increasing penalty as we move away from this point. c) The
L07676: final loss function is the sum of the original loss function plus the regularization
L07677: term. This surface has fewer local minima, and the global minimum has moved
L07678: to a different position (arrow shows change).
L07679: toward certain solutions, we include an additional term:
L07680: ˆϕ = argmin
L07681: ϕ
L07682: " I
L07683: X
L07684: i=1
L07685: ℓi[xi, yi] + λ · g[ϕ]
L07686: #
L07687: ,
L07688: (9.2)
L07689: where g[ϕ] is a function that returns a scalar which takes larger values when the pa-
L07690: rameters are less preferred. The term λ is a positive scalar that controls the relative
L07691: contribution of the original loss function and the regularization term. The minima of
L07692: the regularized loss function usually differ from those in the original, so the training
L07693: procedure converges to different parameter values (figure 9.1).
L07694: 9.1.1
L07695: Probabilistic interpretation
L07696: Regularization can be viewed from a probabilistic perspective. Section 5.1 shows how
L07697: loss functions are constructed from the maximum likelihood criterion:
L07698: ˆϕ = argmax
L07699: ϕ
L07700: " IY
L07701: i=1
L07702: Pr(yi|xi, ϕ)
L07703: #
L07704: .
L07705: (9.3)
L07706: The regularization term can be considered as a prior Pr(ϕ) that represents knowledge
L07707: about the parameters before we observe the data and we now have the maximum a
L07708: posteriori or MAP criterion:
L07709: Draft: please send errata to udlbookmail@gmail.com.
L07712: <!-- page 154 -->
L07713: 140
L07714: 9
L07715: Regularization
L07716: ˆϕ = argmax
L07717: ϕ
L07718: "
L07719: Pr(ϕ)
L07720: IY
L07721: i=1
L07722: Pr(yi|xi, ϕ)
L07723: #
L07724: .
L07725: (9.4)
L07726: Moving back to the negative log-likelihood loss function by taking the log and multiplying
L07727: by minus one, we see that λ · g[ϕ] = −log[Pr(ϕ)].
L07728: 9.1.2
L07729: L2 regularization
L07730: This discussion has sidestepped the question of which solutions the regularization term
L07731: should penalize (or equivalently that the prior should favor). Since neural networks are
L07732: used in an extremely broad range of applications, these can only be very generic pref-
L07733: erences. The most commonly used regularization term is the L2 norm, which penalizes
L07734: the sum of the squares of the parameter values:
L07735: ˆϕ = argmin
L07736: ϕ
L07737: 
L07738: 
L07739: I
L07740: X
L07741: i=1
L07742: ℓi[xi, yi] + λ
L07743: X
L07744: j
L07745: ϕ2
L07746: j
L07747: 
L07748: ,
L07749: (9.5)
L07750: where j indexes the parameters. This is also referred to as Tikhonov regularization or
L07751: Problems 9.1–9.2
L07752: ridge regression, or (when applied to matrices) Frobenius norm regularization.
L07753: For neural networks, L2 regularization is usually applied to the weights but not
L07754: the biases and is hence referred to as a weight decay term. The effect is to encourage
L07755: smaller weights, so the output function is smoother.
L07756: To see this, consider that the
L07757: output prediction is a weighted sum of the activations at the last hidden layer. If the
L07758: Notebook 9.1
L07759: L2 regularization
L07760: weights have a smaller magnitude, the output will vary less. The same logic applies to
L07761: the computation of the pre-activations at the last hidden layer and so on, progressing
L07762: backward through the network. In the limit, if we forced all the weights to be zero, the
L07763: network would produce a constant output determined by the final bias parameter.
L07764: Figure 9.2 shows the effect of fitting the simplified network from figure 8.4 with weight
L07765: decay and different values of the regularization coeﬀicient λ. When λ is small, it has
L07766: little effect. However, as λ increases, the fit to the data becomes less accurate, and the
L07767: function becomes smoother. This might improve the test performance for two reasons:
L07768: • If the network is overfitting, then adding the regularization term means that the
L07769: network must trade off slavish adherence to the data against the desire to be
L07770: smooth. One way to think about this is that the error due to variance reduces (the
L07771: model no longer needs to pass through every data point) at the cost of increased
L07772: bias (the model can only describe smooth functions).
L07773: • When the network is over-parameterized, some of the extra model capacity de-
L07774: scribes areas with no training data. Here, the regularization term will favor func-
L07775: tions that smoothly interpolate between the nearby points.
L07776: This is reasonable
L07777: behavior in the absence of knowledge about the true function.
L07778: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L07781: <!-- page 155 -->
L07782: 9.2
L07783: Implicit regularization
L07784: 141
L07785: Figure 9.2 L2 regularization in simplified network with 14 hidden units (see fig-
L07786: ure 8.4). a–f) Fitted functions as we increase the regularization coeﬀicient λ. The
L07787: black curve is the true function, the orange circles are the noisy training data,
L07788: and the cyan curve is the fitted model. For small λ (panels a–b), the fitted func-
L07789: tion passes exactly through the data points. For intermediate λ (panels c–d), the
L07790: function is smoother and more similar to the ground truth. For large λ (panels
L07791: e–f), the regularization term overpowers the likelihood term, so the fitted function
L07792: is too smooth and the overall fit is worse.
L07793: 9.2
L07794: Implicit regularization
L07795: An intriguing recent finding is that neither gradient descent nor stochastic gradient
L07796: descent moves neutrally to the minimum of the loss function; each exhibits a preference
L07797: for some solutions over others. This is known as implicit regularization.
L07798: 9.2.1
L07799: Implicit regularization in gradient descent
L07800: Consider a continuous version of gradient descent where the step size is infinitesimal.
L07801: The change in parameters ϕ will be governed by the differential equation:
L07802: dϕ
L07803: dt = −∂L
L07804: ∂ϕ.
L07805: (9.6)
L07806: Draft: please send errata to udlbookmail@gmail.com.
L07809: <!-- page 156 -->
L07810: 142
L07811: 9
L07812: Regularization
L07813: Figure 9.3 Implicit regularization in gradient descent. a) Loss function with family
L07814: of global minima on horizontal line ϕ1 = 0.61. Dashed blue line shows continuous
L07815: gradient descent path starting in bottom-left.
L07816: Cyan trajectory shows discrete
L07817: gradient descent with step size 0.1 (first few steps shown explicitly as arrows).
L07818: The finite step size causes the paths to diverge and reach a different final position.
L07819: b) This disparity can be approximated by adding a regularization term to the
L07820: continuous gradient descent loss function that penalizes the squared gradient
L07821: magnitude.
L07822: c) After adding this term, the continuous gradient descent path
L07823: converges to the same place that the discrete one did on the original function.
L07824: Gradient descent approximates this process with a series of discrete steps of size α:
L07825: ϕt+1 = ϕt −α∂L[ϕt]
L07826: ∂ϕ
L07827: ,
L07828: (9.7)
L07829: The discretization causes a deviation from the continuous path (figure 9.3).
L07830: This deviation can be understood by deriving a modified loss term ˜L for the continu-
L07831: ous case that arrives at the same place as the discretized version on the original loss L. It
L07832: can be shown (see notes “Implicit regularization in gradient descent” at end of chapter)
L07833: that this modified loss is:
L07834: ˜LGD[ϕ] = L[ϕ] + α
L07835: 4
L07840: ∂L
L07841: ∂ϕ
L07846: 2
L07847: .
L07848: (9.8)
L07849: In other words, the discrete trajectory is repelled from places where the gradient norm
L07850: is large (the surface is steep). This doesn’t change the position of the minima where the
L07851: gradients are zero anyway. However, it changes the effective loss function elsewhere and
L07852: modifies the optimization trajectory, which potentially converges to a different minimum.
L07853: Implicit regularization due to gradient descent may be responsible for the observation
L07854: that full batch gradient descent generalizes better with larger step sizes (figure 9.5a).
L07855: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L07858: <!-- page 157 -->
L07859: 9.3
L07860: Heuristics to improve performance
L07861: 143
L07862: 9.2.2
L07863: Implicit regularization in stochastic gradient descent
L07864: A similar analysis can be applied to stochastic gradient descent. Now we seek a modified
L07865: loss function such that the continuous version reaches the same place as the average of
L07866: the possible random SGD updates. This can be shown to be:
L07867: ˜LSGD[ϕ]
L07868: =
L07869: ˜LGD[ϕ] + α
L07870: 4B
L07871: B
L07872: X
L07873: b=1
L07878: ∂Lb
L07879: ∂ϕ −∂L
L07880: ∂ϕ
L07885: 2
L07886: =
L07887: L[ϕ] + α
L07888: 4
L07893: ∂L
L07894: ∂ϕ
L07899: 2
L07900: + α
L07901: 4B
L07902: B
L07903: X
L07904: b=1
L07909: ∂Lb
L07910: ∂ϕ −∂L
L07911: ∂ϕ
L07916: 2
L07917: .
L07918: (9.9)
L07919: Here, Lb is the loss for the bth of the B batches in an epoch, and both L and Lb now
L07920: represent the means of the I individual losses in the full dataset and the |B| individual
L07921: losses in the batch, respectively:
L07922: L = 1
L07923: I
L07924: I
L07925: X
L07926: i=1
L07927: ℓi[xi, yi]
L07928: and
L07929: Lb = 1
L07930: |B|
L07931: X
L07932: i∈Bb
L07933: ℓi[xi, yi].
L07934: (9.10)
L07935: Equation 9.9 reveals an extra regularization term, which corresponds to the variance
L07936: of the gradients of the batch losses Lb. In other words, SGD implicitly favors places
L07937: where the gradients are stable (where all the batches agree on the slope). Once more, this
L07938: modifies the trajectory of the optimization process (figure 9.4) but does not necessarily
L07939: change the position of the global minimum; if the model is over-parameterized, then it
L07940: may fit all the training data exactly, so each of these gradient terms will be zero at the
L07941: global minimum.
L07942: SGD generalizes better than gradient descent, and smaller batch sizes generally per-
L07943: form better than larger ones (figure 9.5b). One possible explanation is that the inherent
L07944: randomness allows the algorithm to reach different parts of the loss function. However,
L07945: Notebook 9.2
L07946: Implicit
L07947: regularization
L07948: it’s also possible that some or all of this performance increase is due to implicit regular-
L07949: ization; this encourages solutions where all the data fits well (so the batch variance is
L07950: small) rather than solutions where some of the data fit extremely well and other data less
L07951: well (perhaps with the same overall loss, but with larger batch variance). The former
L07952: solutions are likely to generalize better.
L07953: 9.3
L07954: Heuristics to improve performance
L07955: We’ve seen that explicit regularization encourages the training algorithm to find a good
L07956: solution by adding extra terms to the loss function. This also occurs implicitly as an un-
L07957: intended (but seemingly helpful) byproduct of stochastic gradient descent. This section
L07958: describes other heuristic methods used to improve generalization.
L07959: Draft: please send errata to udlbookmail@gmail.com.
L07962: <!-- page 158 -->
L07963: 144
L07964: 9
L07965: Regularization
L07966: Figure 9.4 Implicit regularization for stochastic gradient descent. a) Original loss
L07967: function for Gabor model (section 6.1.2). Blue point represents global minimum.
L07968: b) Implicit regularization term from gradient descent penalizes the squared gra-
L07969: dient magnitude. c) Additional implicit regularization from stochastic gradient
L07970: descent penalizes the variance of the batch gradients. d) Modified loss function
L07971: (sum of original loss plus two implicit regularization components). Blue point
L07972: represents global minimum which may now be in a different place from panel (a).
L07973: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L07976: <!-- page 159 -->
L07977: 9.3
L07978: Heuristics to improve performance
L07979: 145
L07980: Figure 9.5 Effect of learning rate (LR) and batch size for 4000 training and
L07981: 4000 test examples from MNIST-1D (see figure 8.1) for a neural network with
L07982: two hidden layers.
L07983: a) Performance is better for large learning rates than for
L07984: intermediate or small ones. In each case, the number of iterations is 6000/LR, so
L07985: each solution has the opportunity to move the same distance. b) Performance is
L07986: superior for smaller batch sizes. In each case, the number of iterations was chosen
L07987: so that the training data were memorized at roughly the same model capacity.
L07988: 9.3.1
L07989: Early stopping
L07990: Early stopping refers to stopping the training procedure before it has fully converged.
L07991: This can reduce overfitting if the model has already captured the coarse shape of the
L07992: underlying function but has not yet had time to overfit to the noise (figure 9.6). One
L07993: way of thinking about this is that since the weights are initialized to small values (see
L07994: section 7.5), they simply don’t have time to become large, so early stopping has a similar
L07995: effect to explicit L2 regularization. A different view is that early stopping reduces the
L07996: effective model complexity. Hence, we move back down the bias/variance trade-off curve
L07997: from the critical region, and performance improves (see figures 8.9 and 8.10).
L07998: Early stopping has a single hyperparameter, the number of steps after which learning
L07999: is terminated. As usual, this is chosen empirically using a validation set (section 8.5).
L08000: However, for early stopping, the hyperparameter can be selected without the need to
L08001: train multiple models. The model is trained once, the performance on the validation set
L08002: is monitored every T iterations, and the associated parameters are stored. The stored
L08003: parameters where the validation performance was best are selected.
L08004: 9.3.2
L08005: Ensembling
L08006: Another approach to reducing the generalization gap between training and test data is
L08007: to build several models and average their predictions. A group of such models is known
L08008: Draft: please send errata to udlbookmail@gmail.com.
L08011: <!-- page 160 -->
L08012: 146
L08013: 9
L08014: Regularization
L08015: Figure 9.6 Early stopping. a) Simplified shallow network model with 14 linear
L08016: regions (figure 8.4) is initialized randomly (cyan curve) and trained with SGD
L08017: using a batch size of five and a learning rate of 0.05. b–d) As training proceeds,
L08018: the function first captures the coarse structure of the true function (black curve)
L08019: before e–f) overfitting to the noisy training data (orange points). Although the
L08020: training loss continues to decrease throughout this process, the learned models in
L08021: panels (c) and (d) are closest to the true underlying function. They will generalize
L08022: better on average to test data than those in panels (e) or (f).
L08023: as an ensemble. This technique reliably improves test performance at the cost of training
L08024: and storing multiple models and performing inference multiple times.
L08025: The models can be combined by taking the mean of the outputs (for regression
L08026: problems) or the mean of the pre-softmax activations (for classification problems). The
L08027: assumption is that model errors are independent and will cancel out.
L08028: Alternatively,
L08029: we can take the median of the outputs (for regression problems) or the most frequent
L08030: predicted class (for classification problems) to make the predictions more robust.
L08031: One way to train different models is just to use different random initializations. This
L08032: may help in regions of input space far from the training data. Here, the fitted function
L08033: Notebook 9.3
L08034: Ensembling
L08035: is relatively unconstrained, and different models may produce different predictions, so
L08036: the average of several models may generalize better than any single model.
L08037: A second approach is to generate several different datasets by re-sampling the train-
L08038: ing data with replacement and training a different model from each. This is known as
L08039: bootstrap aggregating or bagging for short (figure 9.7). It has the effect of smoothing
L08040: out the data; if a data point is not present in one training set, the model will interpo-
L08041: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L08044: <!-- page 161 -->
L08045: 9.3
L08046: Heuristics to improve performance
L08047: 147
L08048: Figure 9.7 Ensemble methods.
L08049: a) Fitting a single model (gray curve) to the
L08050: entire dataset (orange points). b–e) Four models created by re-sampling the data
L08051: with replacement (bagging) four times (size of orange point indicates number of
L08052: times the data point was re-sampled). f) When we average the predictions of this
L08053: ensemble, the result (cyan curve) is smoother than the result from panel (a) for
L08054: the full dataset (gray curve) and will probably generalize better.
L08055: late from nearby points; hence, if that point was an outlier, the fitted function will be
L08056: more moderate in this region. Other approaches include training models with different
L08057: hyperparameters or training completely different families of models.
L08058: 9.3.3
L08059: Dropout
L08060: Dropout clamps a random subset (typically 50%) of hidden units to zero at each iteration
L08061: of SGD (figure 9.8). This makes the network less dependent on any given hidden unit and
L08062: encourages the weights to have smaller magnitudes so that the change in the function
L08063: due to the presence or absence of any specific hidden unit is reduced.
L08064: This technique has the positive benefit that it can eliminate undesirable “kinks” in
L08065: the function that are far from the training data and don’t affect the loss. For example,
L08066: consider three hidden units that become active sequentially as we move along the curve
L08067: (figure 9.9a). The first hidden unit causes a large increase in the slope. A second hidden
L08068: Draft: please send errata to udlbookmail@gmail.com.
L08071: <!-- page 162 -->
L08072: 148
L08073: 9
L08074: Regularization
L08075: Figure 9.8 Dropout.
L08076: a) Original network.
L08077: b–d) At each training iteration, a
L08078: random subset of hidden units is clamped to zero (gray nodes). The result is
L08079: that the incoming and outgoing weights from these units have no effect, so we are
L08080: training with a slightly different network each time.
L08081: unit decreases the slope, so the function goes back down. Finally, the third unit cancels
L08082: out this decrease and returns the curve to its original trajectory.
L08083: These three units
L08084: conspire to make an undesirable local change in the function. This will not change the
L08085: training loss but is unlikely to generalize well.
L08086: When several units conspire in this way, eliminating one (as would happen in dropout)
L08087: causes a considerable change to the output function in the half-space where that unit
L08088: was active (figure 9.9b). A subsequent gradient descent step will attempt to compensate
L08089: for the change that this induces, and such dependencies will be eliminated over time.
L08090: The overall effect is that large unnecessary changes between training data points are
L08091: gradually removed even though they contribute nothing to the loss (figure 9.9).
L08092: At test time, we can run the network as usual with all the hidden units active;
L08093: however, the network now has more hidden units than it was trained with at any given
L08094: iteration, so we multiply the weights by one minus the dropout probability to compensate.
L08095: This is known as the weight scaling inference rule. A different approach to inference is
L08096: to use Monte Carlo dropout, in which we run the network multiple times with different
L08097: random subsets of units clamped to zero (as in training) and combine the results. This
L08098: is closely related to ensembling in that every random version of the network is a different
L08099: model; however, we do not have to train or store multiple networks here.
L08100: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L08103: <!-- page 163 -->
L08104: 9.3
L08105: Heuristics to improve performance
L08106: 149
L08107: Figure 9.9 Dropout mechanism. a) An undesirable kink in the curve is caused
L08108: by a sequential increase in the slope, decrease in the slope (at circled joint), and
L08109: then another increase to return the curve to its original trajectory. Here we are
L08110: using full-batch gradient descent, and the model (from figure 8.4) fits the data
L08111: as well as possible, so further training won’t remove the kink. b) Consider what
L08112: happens if we remove the eighth hidden unit that produced the circled joint in
L08113: panel (a), as might happen using dropout. Without the decrease in the slope,
L08114: the right-hand side of the function takes an upwards trajectory, and a subsequent
L08115: gradient descent step will aim to compensate for this change. c) Curve after 2000
L08116: iterations of (i) randomly removing one of the three hidden units that cause the
L08117: kink and (ii) performing a gradient descent step. The kink does not affect the loss
L08118: but is nonetheless removed by this approximation of the dropout mechanism.
L08119: 9.3.4
L08120: Applying noise
L08121: Dropout can be interpreted as applying multiplicative Bernoulli noise to the network
L08122: activations. This leads to the idea of applying noise to other parts of the network during
L08123: training to make the final model more robust.
L08124: One option is to add noise to the input data; this smooths out the learned function
L08125: Problem 9.3
L08126: (figure 9.10). For regression problems, it can be shown to be equivalent to adding a
L08127: regularizing term that penalizes the derivatives of the network’s output with respect to
L08128: its input. An extreme variant is adversarial training, in which the optimization algorithm
L08129: actively searches for small perturbations of the input that cause large changes to the
L08130: output. These can be thought of as worst-case additive noise vectors.
L08131: A second possibility is to add noise to the weights. This encourages the network to
L08132: make sensible predictions even for small perturbations of the weights. The result is that
L08133: the training converges to local minima in the middle of wide, flat regions, where changing
L08134: the individual weights does not matter much.
L08135: Finally, we can perturb the labels. The maximum-likelihood criterion for multiclass
L08136: classification aims to predict the correct class with absolute certainty (equation 5.24).
L08137: To this end, the final network activations (i.e., before the softmax function) are pushed
L08138: to very large values for the correct class and very small values for the wrong classes.
L08139: We could discourage this overconfident behavior by assuming that a proportion ρ of
L08140: Draft: please send errata to udlbookmail@gmail.com.
L08143: <!-- page 164 -->
L08144: 150
L08145: 9
L08146: Regularization
L08147: Figure 9.10 Adding noise to inputs. At each step of SGD, random noise with
L08148: variance σ2
L08149: x is added to the batch data. a–c) Fitted model with different noise
L08150: levels (small dots represent ten samples). Adding more noise smooths out the
L08151: fitted function (cyan line).
L08152: the training labels are incorrect and belong with equal probability to the other classes.
L08153: This could be done by randomly changing the labels at each training iteration. However,
L08154: the same end can be achieved by changing the loss function to minimize the cross-
L08155: entropy between the predicted distribution and a distribution where the true label has
L08156: Problem 9.4
L08157: probability 1 −ρ, and the other classes have equal probability. This is known as label
L08158: smoothing and improves generalization in diverse scenarios.
L08159: 9.3.5
L08160: Bayesian inference
L08161: The maximum likelihood approach is generally overconfident; it selects the most likely
L08162: parameters during training and uses these to make predictions. However, many param-
L08163: eter values may be broadly compatible with the data and only slightly less likely. The
L08164: Bayesian approach treats the parameters as unknown variables and computes a distri-
L08165: Appendix C.1.4
L08166: Bayes’ rule
L08167: bution Pr(ϕ|{xi, yi}) over these parameters ϕ conditioned on the training data {xi, yi}
L08168: using Bayes’ rule:
L08169: Pr(ϕ|{xi, yi}) =
L08170: QI
L08171: i=1 Pr(yi|xi, ϕ)Pr(ϕ)
L08172: R QI
L08173: i=1 Pr(yi|xi, ϕ)Pr(ϕ)dϕ
L08174: ,
L08175: (9.11)
L08176: where Pr(ϕ) is the prior probability of the parameters, and the denominator is a nor-
L08177: malizing term. Hence, every parameter choice is assigned a probability (figure 9.11).
L08178: The prediction y for new input x is an infinite weighted sum (i.e., an integral) of the
L08179: predictions for each parameter set, where the weights are the associated probabilities:
L08180: Pr(y|x, {xi, yi}) =
L08181: Z
L08182: Pr(y|x, ϕ)Pr(ϕ|{xi, yi})dϕ.
L08183: (9.12)
L08184: This is effectively an infinite weighted ensemble, where the weight depends on (i) the
L08185: prior probability of the parameters and (ii) their agreement with the data.
L08186: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L08189: <!-- page 165 -->
L08190: 9.3
L08191: Heuristics to improve performance
L08192: 151
L08193: Figure 9.11 Bayesian approach for simplified network model (see figure 8.4). The
L08194: parameters are treated as uncertain. The posterior probability Pr(ϕ|{xi, yi}) for
L08195: a set of parameters is determined by their compatibility with the data {xi, yi}
L08196: and a prior distribution Pr(ϕ).
L08197: a–c) Two sets of parameters (cyan and gray
L08198: curves) sampled from the posterior using normally distributed priors with mean
L08199: zero and three variances. When the prior variance σ2
L08200: ϕ is small, the parameters
L08201: also tend to be small, and the functions smoother. d–f) Inference proceeds by
L08202: taking a weighted sum over all possible parameter values where the weights are
L08203: the posterior probabilities. This produces both a prediction of the mean (cyan
L08204: curves) and the associated uncertainty (gray region is two standard deviations).
L08205: The Bayesian approach is elegant and can provide more robust predictions than
L08206: those that derive from maximum likelihood.
L08207: Unfortunately, for complex models like
L08208: neural networks, there is no practical way to represent the full probability distribution
L08209: Notebook 9.4
L08210: Bayesian
L08211: approach
L08212: over the parameters or to integrate over it during the inference phase. Consequently, all
L08213: current methods of this type make approximations of some kind, and typically these add
L08214: considerable complexity to learning and inference.
L08215: 9.3.6
L08216: Transfer learning and multi-task learning
L08217: When training data are limited, other datasets can be exploited to improve performance.
L08218: In transfer learning (figure 9.12a), the network is pre-trained to perform a related sec-
L08219: Draft: please send errata to udlbookmail@gmail.com.
L08222: <!-- page 166 -->
L08223: 152
L08224: 9
L08225: Regularization
L08226: ondary task for which data are more plentiful. The resulting model is then adapted to
L08227: the original task. This is typically done by removing the last layer and adding one or
L08228: more layers that produce a suitable output. The main model may be fixed, and the new
L08229: layers trained for the original task, or we may fine-tune the entire model.
L08230: The principle is that the network will build a good internal representation of the
L08231: data from the secondary task, which can subsequently be exploited for the original task.
L08232: Equivalently, transfer learning can be viewed as initializing most of the parameters of
L08233: the final network in a sensible part of the space that is likely to produce a good solution.
L08234: Multi-task learning (figure 9.12b) is a related technique in which the network is trained
L08235: to solve several problems concurrently. For example, the network might take an image
L08236: and simultaneously learn to segment the scene, estimate the pixel-wise depth, and predict
L08237: a caption describing the image. All of these tasks require some understanding of the
L08238: image and, when learned simultaneously, the model performance for each may improve.
L08239: 9.3.7
L08240: Self-supervised learning
L08241: The above discussion assumes that we have plentiful data for a secondary task or data for
L08242: multiple tasks to be learned concurrently. If not, we can create large amounts of “free”
L08243: labeled data using self-supervised learning and use this for transfer learning. There are
L08244: two families of methods for self-supervised learning: generative and contrastive.
L08245: In generative self-supervised learning, part of each data example is masked, and the
L08246: secondary task is to predict the missing part (figure 9.12c). For example, we might use
L08247: a corpus of unlabeled images and a secondary task that aims to inpaint (fill in) missing
L08248: parts of the image (figure 9.12c). Similarly, we might use a large corpus of text and mask
L08249: some words. We train the network to predict the missing words and then fine-tune it for
L08250: the actual language task we are interested in (see chapter 12).
L08251: In contrastive self-supervised learning, pairs of examples with commonalities are com-
L08252: pared to unrelated pairs. For images, the secondary task might be to identify whether a
L08253: pair of images are transformed versions of one another or are unconnected. For text, the
L08254: secondary task might be to determine whether two sentences followed one another in the
L08255: original document. Sometimes, the precise relationship between a connected pair must
L08256: be identified (e.g., finding the relative position of two patches from the same image).
L08257: 9.3.8
L08258: Augmentation
L08259: Transfer learning improves performance by exploiting a different dataset.
L08260: Multi-task
L08261: learning improves performance using additional labels. A third option is to expand the
L08262: dataset. We can often transform each input data example in such a way that the label
L08263: stays the same. For example, we might aim to determine if there is a bird in an image
L08264: (figure 9.13). Here, we could rotate, flip, blur, or manipulate the color balance of the
L08265: image, and the label “bird” remains valid. Similarly, for tasks where the input is text,
L08266: Notebook 9.5
L08267: Augmentation
L08268: we can substitute synonyms or translate to another language and back again. For tasks
L08269: where the input is audio, we can amplify or attenuate different frequency bands.
L08270: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L08273: <!-- page 167 -->
L08274: 9.3
L08275: Heuristics to improve performance
L08276: 153
L08277: Figure 9.12 Transfer, multi-task, and self-supervised learning. a) Transfer learn-
L08278: ing is used when we have limited labeled data for the primary task (here depth
L08279: estimation) but plentiful data for a secondary task (here segmentation). We train
L08280: a model for the secondary task, remove the final layers, and replace them with
L08281: new layers appropriate to the primary task. We then train only the new layers
L08282: or fine-tune the entire network for the primary task. The network learns a good
L08283: internal representation from the secondary task that is then exploited for the pri-
L08284: mary task. b) In multi-task learning, we train a model to perform multiple tasks
L08285: simultaneously, hoping that performance on each will improve. c) In generative
L08286: self-supervised learning, we remove part of the data and train the network to
L08287: complete the missing information. Here, the task is to fill in (inpaint) a masked
L08288: portion of the image. This permits transfer learning when no labels are available.
L08289: Images from Cordts et al. (2016).
L08290: Draft: please send errata to udlbookmail@gmail.com.
L08293: <!-- page 168 -->
L08294: 154
L08295: 9
L08296: Regularization
L08297: Figure 9.13 Data augmentation. For some problems, each data example can be
L08298: transformed to augment the dataset. a) Original image. b–h) Various geometric
L08299: and photometric transformations of this image. For image classification, all these
L08300: images still have the same label, “bird.” Adapted from Wu et al. (2015a).
L08301: Generating extra training data in this way is known as data augmentation. The aim
L08302: is to teach the model to be indifferent to these irrelevant data transformations.
L08303: 9.4
L08304: Summary
L08305: Explicit regularization involves adding an extra term to the loss function that changes
L08306: the position of the minimum. The term can be interpreted as a prior probability over
L08307: the parameters. Stochastic gradient descent with a finite step size does not neutrally
L08308: descend to the minimum of the loss function. This bias can be interpreted as adding
L08309: additional terms to the loss function, and this is known as implicit regularization.
L08310: There are also many heuristics for improving generalization, including early stopping,
L08311: dropout, ensembling, the Bayesian approach, adding noise, transfer learning, multi-task
L08312: learning, and data augmentation. There are four main principles behind these methods
L08313: (figure 9.14). We can (i) encourage the function to be smoother (e.g., L2 regularization),
L08314: (ii) increase the amount of data (e.g., data augmentation), (iii) combine models (e.g.,
L08315: ensembling), or (iv) search for wider minima (e.g., applying noise to network weights).
L08316: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L08319: <!-- page 169 -->
L08320: Notes
L08321: 155
L08322: Figure 9.14 Regularization methods. The regularization methods discussed in this
L08323: chapter aim to improve generalization by one of four mechanisms. Some methods
L08324: aim to make the modeled function smoother. Other methods increase the effective
L08325: amount of data. The third group of methods combine multiple models and hence
L08326: mitigate against uncertainty in the fitting process. Finally, the fourth group of
L08327: methods encourages the training process to converge to a wide minimum where
L08328: small errors in the estimated parameters are less important (see also figure 20.11).
L08329: Another way to improve generalization is to choose the model architecture to suit the
L08330: task. For example, in image segmentation, we can share parameters within the model,
L08331: so we don’t need to independently learn what a tree looks like at every image location.
L08332: Chapters 10–13 consider architectural variations designed for different tasks.
L08333: Notes
L08334: An overview and taxonomy of regularization techniques in deep learning can be found in
L08335: Kukačka et al. (2017).
L08336: Notably missing from the discussion in this chapter is BatchNorm
L08337: (Szegedy et al., 2016) and its variants, which are described in chapter 11.
L08338: Regularization:
L08339: L2 regularization penalizes the sum of squares of the network weights. This
L08340: encourages the output function to change slowly (i.e., become smoother) and is the most used
L08341: regularization term. It is sometimes referred to as Frobenius norm regularization as it penalizes
L08342: the Frobenius norms of the weight matrices. It is often also mistakenly referred to as “weight
L08343: decay,” although this is a separate technique devised by Hanson & Pratt (1988) in which the
L08344: parameters ϕ are updated as:
L08345: ϕ ←−(1 −λ′)ϕ −α ∂L
L08346: ∂ϕ,
L08347: (9.13)
L08348: Draft: please send errata to udlbookmail@gmail.com.
