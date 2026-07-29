L07162: <!-- page 141 -->
L07163: 8.4
L07164: Double descent
L07165: 127
L07166: Figure 8.7 Bias and variance as a function of model capacity. a–c) As we in-
L07167: crease the number of hidden units of the toy model, the number of linear regions
L07168: increases, and the model becomes able to fit the true function closely; the bias
L07169: (gray region) decreases. d–f) Unfortunately, increasing the model capacity has
L07170: the side-effect of increasing the variance term (gray region). This is known as the
L07171: bias-variance trade-off.
L07172: 8.4
L07173: Double descent
L07174: In the previous section, we examined the bias-variance trade-off as we increased the
L07175: capacity of a model. Let’s now return to the MNIST-1D dataset and see whether this
L07176: happens in practice. We use 10,000 training examples, test with another 5,000 examples
L07177: and examine the training and test performance as we increase the capacity (number of
L07178: parameters) in the model. We train the model with Adam and a step size of 0.005 using
L07179: a full batch of 10,000 examples for 4000 steps.
L07180: Figure 8.10a shows the training and test error for a neural network with two hid-
L07181: den layers as the number of hidden units increases. The training error decreases as the
L07182: capacity grows and quickly becomes close to zero. The vertical dashed line represents
L07183: the capacity where the model has the same number of parameters as there are training
L07184: examples, but the model memorizes the dataset before this point. The test error de-
L07185: creases as we add model capacity but does not increase as predicted by the bias-variance
L07186: trade-off curve; it keeps decreasing.
L07187: In figure 8.10b, we repeat this experiment, but this time, we randomize 15% of the
L07188: Draft: please send errata to udlbookmail@gmail.com.
L07191: <!-- page 142 -->
L07192: 128
L07193: 8
L07194: Measuring performance
L07195: Figure 8.8 Overfitting. a–c) A model with three regions is fit to three different
L07196: datasets of fifteen points each. The result is similar in all three cases (i.e., the
L07197: variance is low). d–f) A model with ten regions is fit to the same datasets. The
L07198: additional flexibility does not necessarily produce better predictions. While these
L07199: three models each describe the training data better, they are not necessarily closer
L07200: to the true underlying function (black curve). Instead, they overfit the data and
L07201: describe the noise, and the variance (difference between fitted curves) is larger.
L07202: Figure 8.9 Bias-variance trade-off. The
L07203: bias and variance terms from equa-
L07204: tion 8.7 are plotted as a function of
L07205: the model capacity (number of hidden
L07206: units / linear regions in range of data)
L07207: in the simplified model using training
L07208: data from figure 8.8.
L07209: As the capacity
L07210: increases, the bias (solid orange line) de-
L07211: creases, but the variance (solid cyan line)
L07212: increases. The sum of these two terms
L07213: (dashed gray line) is minimized when the
L07214: capacity is four.
L07215: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L07218: <!-- page 143 -->
L07219: 8.4
L07220: Double descent
L07221: 129
L07222: training labels. Once more, the training error decreases to zero. This time, there is
L07223: more randomness, and the model requires almost as many parameters as there are data
L07224: points to memorize the data. The test error does show the typical bias-variance trade-off
L07225: as we increase the capacity to the point where the model fits the training data exactly.
L07226: However, then it does something unexpected; it starts to decrease again. Indeed, if we
L07227: add enough capacity, the test loss reduces to below the minimal level that we achieved
L07228: in the first part of the curve.
L07229: This phenomenon is known as double descent. For some datasets like MNIST, it is
L07230: present with the original data (figure 8.10c). For others, like MNIST-1D and CIFAR-100
L07231: (figure 8.10d), it emerges or becomes more prominent when we add noise to the labels.
L07232: Notebook 8.3
L07233: Double descent
L07234: The first part of the curve is referred to as the classical or under-parameterized regime,
L07235: and the second part as the modern or over-parameterized regime. The central part where
L07236: the error increases is termed the critical regime.
L07237: 8.4.1
L07238: Explanation
L07239: The discovery of double descent is recent, unexpected, and somewhat puzzling. It results
L07240: from an interaction of two phenomena. First, the test performance becomes temporarily
L07241: worse when the model has just enough capacity to memorize the data. Second, the test
L07242: performance continues to improve with capacity even when this exceeds the point where
L07243: the training data are all classified correctly. The first phenomenon is exactly as predicted
L07244: by the bias-variance trade-off. The second phenomenon is more confusing; it’s unclear
L07245: why performance should be better in the over-parameterized regime, given that there are
L07246: now not even enough training data points to constrain the model parameters uniquely.
L07247: To understand why performance continues to improve as we add more parameters,
L07248: note that once the model has enough capacity to drive the training loss to near zero,
L07249: the model fits the training data almost perfectly. This implies that further capacity
L07250: Problems 8.4–8.5
L07251: cannot help the model fit the training data any better; any change must occur between
L07252: the training points. The tendency of a model to prioritize one solution over another
L07253: between data points is known as its inductive bias.
L07254: The model’s behavior between data points is critical because, in high-dimensional
L07255: space, the training data are extremely sparse. The MNIST-1D dataset has 40 dimensions,
L07256: and we trained with 10,000 examples. If this seems like plenty of data, consider what
L07257: would happen if we quantized each input dimension into 10 bins. There would be 1040
L07258: bins in total, constrained by only 104 examples. Even with this coarse quantization,
L07259: there will only be one data point in every 1036 bins! The tendency of the volume of
L07260: high-dimensional space to overwhelm the number of training points is termed the curse
L07261: of dimensionality.
L07262: The implication is that problems in high dimensions might look more like figure 8.11a;
L07263: there are small regions of the input space where we observe data with significant gaps
L07264: between them. The putative explanation for double descent is that as we add capacity
L07265: to the model, it interpolates between the nearest data points increasingly smoothly. In
L07266: the absence of information about what happens between the training points, assuming
L07267: smoothness is sensible and will probably generalize reasonably to new data.
L07268: Draft: please send errata to udlbookmail@gmail.com.
L07271: <!-- page 144 -->
L07272: 130
L07273: 8
L07274: Measuring performance
L07275: Figure 8.10 Double descent.
L07276: a) Training and test error on MNIST-1D for a
L07277: two-hidden layer network as we increase the number of hidden units (and hence
L07278: parameters) in each layer. The training error decreases to zero as the number of
L07279: parameters approaches the number of training examples (vertical dashed line).
L07280: The test error does not show the expected bias-variance trade-off but continues
L07281: to decrease even after the model has memorized the dataset. b) The same exper-
L07282: iment is repeated with noisier training data. Again, the training error reduces
L07283: to zero, although it now takes almost as many parameters as training points to
L07284: memorize the dataset. The test error shows the predicted bias/variance trade-off;
L07285: it decreases as the capacity increases but then increases again as we near the
L07286: point where the training data is exactly memorized. However, it subsequently
L07287: decreases again and ultimately reaches a better performance level. This is known
L07288: as double descent. Depending on the loss function, the model, and the amount
L07289: of noise in the data, the double descent pattern can be seen to a greater or lesser
L07290: degree across many datasets. c) Results on MNIST (without label noise) with
L07291: shallow neural network from Belkin et al. (2019). d) Results on CIFAR-100 with
L07292: ResNet18 network (see chapter 11) from Nakkiran et al. (2021).
L07293: See original
L07294: papers for details.
L07295: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L07298: <!-- page 145 -->
L07299: 8.4
L07300: Double descent
L07301: 131
L07302: Figure 8.11 Increasing capacity (hidden units) allows smoother interpolation be-
L07303: tween sparse data points.
L07304: a) Consider this situation where the training data
L07305: (orange circles) are sparse; there is a large region in the center with no data ex-
L07306: amples to constrain the model to mimic the true function (black curve). b) If we
L07307: fit a model with just enough capacity to fit the training data (cyan curve), then it
L07308: has to contort itself to pass through the training data, and the output predictions
L07309: will not be smooth. c–f) However, as we add more hidden units, the model has
L07310: the ability to interpolate between the points more smoothly (smoothest possible
L07311: curve plotted in each case). However, unlike in this figure, it is not obliged to.
L07312: This argument is plausible. It’s certainly true that as we add more capacity to the
L07313: model, it will have the capability to create smoother functions. Figures 8.11b–f show the
L07314: smoothest possible functions that still pass through the data points as we increase the
L07315: number of hidden units. When the number of parameters is very close to the number
L07316: of training data examples (figure 8.11b), the model is forced to contort itself to fit the
L07317: training data exactly, resulting in erratic predictions. This explains why the peak in the
L07318: double descent curve is so pronounced. As we add more hidden units, the model has the
L07319: ability to construct smoother functions that are likely to generalize better to new data.
L07320: However, this does not explain why over-parameterized models should produce smooth
L07321: functions. Figure 8.12 shows three functions that can be created by the simplified model
L07322: with 50 hidden units. In each case, the model fits the data exactly, so the loss is zero. If
L07323: the modern regime of double descent is explained by increasing smoothness, then what
L07324: exactly is encouraging this smoothness?
L07325: Draft: please send errata to udlbookmail@gmail.com.
L07328: <!-- page 146 -->
L07329: 132
L07330: 8
L07331: Measuring performance
L07332: Figure 8.12 Regularization. a–c) Each of the three fitted curves passes through
L07333: the data points exactly, so the training loss for each is zero. However, we might
L07334: expect the smooth curve in panel (a) to generalize much better to new data than
L07335: the erratic curves in panels (b) and (c). Any factor that biases a model toward
L07336: a subset of the solutions with a similar training loss is known as a regularizer.
L07337: It is thought that the initialization and/or fitting of neural networks have an
L07338: implicit regularizing effect. Consequently, in the over-parameterized regime, more
L07339: reasonable solutions, such as that in panel (a), are encouraged.
L07340: The answer to this question is uncertain, but there are two likely possibilities. First,
L07341: the network initialization may encourage smoothness, and the model never departs from
L07342: the sub-domain of smooth function during the training process. Second, the training
L07343: algorithm may somehow “prefer” to converge to smooth functions.
L07344: Any factor that
L07345: biases a solution toward a subset of equivalent solutions is known as a regularizer, so one
L07346: possibility is that the training algorithm acts as an implicit regularizer (see section 9.2).
L07347: 8.5
L07348: Choosing hyperparameters
L07349: In the previous section, we discussed how test performance changes with model capac-
L07350: ity. Unfortunately, in the classical regime, we don’t have access to either the bias (which
L07351: requires knowledge of the true underlying function) or the variance (which requires mul-
L07352: tiple independently sampled datasets to estimate). In the modern regime, there is no
L07353: way to tell how much capacity should be added before the test error stops improving.
L07354: This raises the question of exactly how we should choose model capacity in practice.
L07355: For a deep network, the model capacity depends on the numbers of hidden layers
L07356: and hidden units per layer as well as other aspects of architecture that we have yet to
L07357: introduce. Furthermore, the choice of learning algorithm and any associated parameters
L07358: (learning rate, etc.) also affects the test performance. These elements are collectively
L07359: termed hyperparameters.
L07360: The process of finding the best hyperparameters is termed
L07361: hyperparameter search or (when focused on network structure) neural architecture search.
L07362: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L07365: <!-- page 147 -->
L07366: 8.6
L07367: Summary
L07368: 133
L07369: Hyperparameters are typically chosen empirically; we train many models with differ-
L07370: ent hyperparameters on the same training set, measure their performance, and retain the
L07371: best model. However, we do not measure their performance on the test set; this would
L07372: admit the possibility that these hyperparameters just happen to work well for the test
L07373: set but don’t generalize to further data. Instead, we introduce a third dataset known
L07374: as a validation set. For every choice of hyperparameters, we train the associated model
L07375: using the training set and evaluate performance on the validation set. Finally, we select
L07376: the model that worked best on the validation set and measure its performance on the
L07377: test set. In principle, this should give a reasonable estimate of the true performance.
L07378: The hyperparameter space is generally smaller than the parameter space but still
L07379: too large to try every combination exhaustively. Unfortunately, many hyperparameters
L07380: are discrete (e.g., the number of hidden layers), and others may be conditional on one
L07381: another (e.g., we only need to specify the number of hidden units in the tenth hidden
L07382: layer if there are ten or more layers). Hence, we cannot rely on gradient descent methods
L07383: as we did for learning the model parameters. Hyperparameter optimization algorithms
L07384: intelligently sample the space of hyperparameters, contingent on previous results. This
L07385: procedure is computationally expensive since we must train an entire model and measure
L07386: the validation performance for each combination of hyperparameters.
L07387: 8.6
L07388: Summary
L07389: To measure performance, we use a separate test set. The degree to which performance is
L07390: maintained on this test set is known as generalization. Test errors can be explained by
L07391: three factors: noise, bias, and variance. These combine additively in regression problems
L07392: with least squares losses. Adding training data decreases the variance. When the model
L07393: capacity is less than the number of training examples, increasing the capacity decreases
L07394: bias but increases variance. This is known as the bias-variance trade-off, and there is a
L07395: capacity where the trade-off is optimal.
L07396: However, this is balanced against a tendency for performance to improve with ca-
L07397: pacity, even when the parameters exceed the training examples. Together, these two
L07398: phenomena create the double descent curve. It is thought that the model interpolates
L07399: more smoothly between the training data points in the over-parameterized “modern
L07400: regime,” although it is unclear what drives this. To choose the capacity and other model
L07401: and training algorithm hyperparameters, we fit multiple models and evaluate their per-
L07402: formance using a separate validation set.
L07403: Notes
L07404: Bias-variance trade-off:
L07405: We showed that the test error for regression problems with least
L07406: squares loss decomposes into the sum of noise, bias, and variance terms.
L07407: These factors are
L07408: all present for models with other losses, but their interaction is typically more complicated
L07409: (Friedman, 1997; Domingos, 2000). For classification problems, there are some counter-intuitive
L07410: Draft: please send errata to udlbookmail@gmail.com.
L07413: <!-- page 148 -->
L07414: 134
L07415: 8
L07416: Measuring performance
L07417: predictions; for example, if the model is biased toward selecting the wrong class in a region of
L07418: the input space, then increasing the variance can improve the classification rate as this pushes
L07419: some of the predictions over the threshold to be classified correctly.
L07420: Cross-validation:
L07421: We saw that it is typical to divide the data into three parts: training data
L07422: (to learn the model parameters), validation data (to choose the hyperparameters), and test data
L07423: (to estimate the final performance). However, this division may cause problems where the total
L07424: number of data examples is limited; if the number of training examples is comparable to the
L07425: model capacity, then the variance will be large.
L07426: One way to mitigate this problem is to use k-fold cross-validation. The training and validation
L07427: data are partitioned into K disjoint subsets. For example, we might divide these data into
L07428: five parts. We train with four and validate with the fifth for each of the five permutations
L07429: and choose the hyperparameters based on the average validation performance. The final test
L07430: performance is assessed using the average of the predictions from the five models with the best
L07431: hyperparameters on an entirely different test set. There are many variations of this idea, but
L07432: all share the general goal of using a larger proportion of the data to train the model, thereby
L07433: reducing variance.
L07434: Capacity:
L07435: We have used the term capacity informally to mean the number of parameters or
L07436: hidden units in the model (and hence indirectly, the ability of the model to fit functions of
L07437: increasing complexity). The representational capacity of a model describes the space of possible
L07438: functions it can construct when we consider all possible parameter values. When we take into
L07439: account the fact that an optimization algorithm may not be able to reach all of these solutions,
L07440: what is left is the effective capacity.
L07441: The Vapnik-Chervonenkis (VC) dimension (Vapnik & Chervonenkis, 1971) is a more formal
L07442: measure of capacity. It is the largest number of training examples that a binary classifier can
L07443: label arbitrarily. Bartlett et al. (2019) derive upper and lower bounds for the VC dimension in
L07444: terms of the number of layers and weights. An alternative measure of capacity is the Rademacher
L07445: complexity, which is the expected empirical performance of a classification model (with optimal
L07446: parameters) for data with random labels. Neyshabur et al. (2017) derive a lower bound on the
L07447: generalization error in terms of the Rademacher complexity.
L07448: Double descent:
L07449: The term “double descent” was coined by Belkin et al. (2019), who demon-
L07450: strated that the test error decreases again in the over-parameterized regime for two-layer neural
L07451: networks and random features. They also claimed that this occurs in decision trees, although
L07452: Buschjäger & Morik (2021) subsequently provided evidence to the contrary. Nakkiran et al.
L07453: (2021) show that double descent occurs for various modern datasets (CIFAR-10, CIFAR-100,
L07454: IWSLT’14 de-en), architectures (CNNs, ResNets, transformers), and optimizers (SGD, Adam).
L07455: The phenomenon is more pronounced when noise is added to the target labels (Nakkiran et al.,
L07456: 2021) and when some regularization techniques are used (Ishida et al., 2020).
L07457: Nakkiran et al. (2021) also provide empirical evidence that test performance depends on effective
L07458: model capacity (the largest number of samples for which a given model and training method can
L07459: achieve zero training error). At this point, the model starts to devote its efforts to interpolating
L07460: smoothly. As such, the test performance depends not just on the model but also on the training
L07461: algorithm and length of training. They observe the same pattern when they study a model with
L07462: fixed capacity and increase the number of training iterations. They term this epoch-wise double
L07463: descent. This phenomenon has been modeled by Pezeshki et al. (2022) in terms of different
L07464: features in the model being learned at different speeds.
L07465: Double descent makes the rather strange prediction that adding training data can sometimes
L07466: worsen test performance. Consider an over-parameterized model in the second descending part
L07467: of the curve. If we increase the training data to match the model capacity, we will now be in
L07468: the critical region of the new test error curve, and the test loss may increase.
L07469: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L07472: <!-- page 149 -->
L07473: Notes
L07474: 135
L07475: Bubeck & Sellke (2021) prove that overparameterization is necessary to interpolate data smoothly
L07476: in high dimensions. They demonstrate a trade-off between the number of parameters and the
L07477: Appendix B.1.1
L07478: Lipschitz constant
L07479: Lipschitz constant of a model (the fastest the output can change for a small input change). A
L07480: review of the theory of over-parameterized machine learning can be found in Dar et al. (2021).
L07481: Curse of dimensionality:
L07482: As dimensionality increases, the volume of space grows so fast that
L07483: the amount of data needed to densely sample it increases exponentially. This phenomenon is
L07484: known as the curse of dimensionality. High-dimensional space has many unexpected properties,
L07485: and caution should be used when trying to reason about it based on low-dimensional exam-
L07486: ples. This book visualizes many aspects of deep learning in one or two dimensions, but these
L07487: visualizations should be treated with healthy skepticism.
L07488: Surprising properties of high-dimensional spaces include: (i) Two randomly sampled data points
L07489: from a standard normal distribution are very close to orthogonal to one another (relative to
L07490: Problems 8.6–8.9
L07491: the origin) with high likelihood. (ii) The distance from the origin of samples from a standard
L07492: normal distribution is roughly constant. (iii) Most of a volume of a high-dimensional sphere
L07493: (hypersphere) is adjacent to its surface (a common metaphor is that most of the volume of a high-
L07494: dimensional orange is in the peel, not in the pulp). (iv) If we place a unit-diameter hypersphere
L07495: inside a hypercube with unit-length sides, then the hypersphere takes up a decreasing proportion
L07496: of the volume of the cube as the dimension increases. Since the volume of the cube is fixed at
L07497: Notebook 8.4
L07498: High-dimensional
L07499: spaces
L07500: size one, this implies that the volume of a high-dimensional hypersphere becomes close to zero.
L07501: (v) For random points drawn from a uniform distribution in a high-dimensional hypercube, the
L07502: ratio of the Euclidean distance between the nearest and furthest points becomes close to one.
L07503: For further information, consult Beyer et al. (1999) and Aggarwal et al. (2001).
L07504: Real-world performance:
L07505: In this chapter, we argued that model performance could be evalu-
L07506: ated using a held-out test set. However, the result won’t be indicative of real-world performance
L07507: if the statistics of the test set don’t match those of real-world data. Moreover, the statistics
L07508: of real-world data may change over time, causing the model to become increasingly stale and
L07509: performance to decrease. This is known as data drift and means that deployed models must be
L07510: carefully monitored.
L07511: There are three main reasons why real-world performance may be worse than the test perfor-
L07512: mance implies. First, the statistics of the input data x may change; we may now be observing
L07513: parts of the function that were sparsely sampled or not sampled at all during training. This
L07514: is known as covariate shift. Second, the statistics of the output data y may change; if some
L07515: output values are infrequent during training, then the model may learn not to predict these in
L07516: ambiguous situations and will make mistakes if they are more common in the real world. This
L07517: is known as prior shift. Third, the relationship between input and output may change. This is
L07518: known as concept shift. These issues are discussed in Moreno-Torres et al. (2012).
L07519: Hyperparameter search:
L07520: Finding the best hyperparameters is a challenging optimization
L07521: task. Testing a single configuration of hyperparameters is expensive; we must train an entire
L07522: model and measure its performance. We have no easy way to access the derivatives (i.e., how
L07523: performance changes when we make a small change to a hyperparameter). Moreover, many of
L07524: the hyperparameters are discrete, so we cannot use gradient descent methods. There are multiple
L07525: local minima and no way to tell if we are close to the global minimum. The noise level is high
L07526: since each training/validation cycle uses a stochastic training algorithm; we expect different
L07527: results if we train a model twice with the same hyperparameters. Finally, some variables are
L07528: conditional and only exist if others are set. For example, the number of hidden units in the
L07529: third hidden layer is only relevant if we have at least three hidden layers.
L07530: A simple approach is to sample the space randomly (Bergstra & Bengio, 2012).
L07531: However,
L07532: for continuous variables, it is better to build a model of performance as a function of the
L07533: hyperparameters and the uncertainty in this function. This can be exploited to test where the
L07534: uncertainty is great (explore the space) or home in on regions where performance looks promising
L07535: Draft: please send errata to udlbookmail@gmail.com.
L07538: <!-- page 150 -->
L07539: 136
L07540: 8
L07541: Measuring performance
L07542: (exploit previous knowledge). Bayesian optimization is a framework based on Gaussian processes
L07543: that does just this, and its application to hyperparameter search is described in Snoek et al.
L07544: (2012). The Beta-Bernoulli bandit (see Lattimore & Szepesvári, 2020) is a roughly equivalent
L07545: model for describing uncertainty in results due to discrete variables.
L07546: The sequential model-based configuration (SMAC) algorithm (Hutter et al., 2011) can cope with
L07547: continuous, discrete, and conditional parameters. The basic approach is to use a random forest
L07548: to model the objective function where the mean of the tree predictions is the best guess about
L07549: the objective function, and their variance represents the uncertainty. A completely different
L07550: approach that can also cope with combinations of continuous, discrete, and conditional param-
L07551: eters is Tree-Parzen Estimators (Bergstra et al., 2011). The previous methods modeled the
L07552: probability of the model performance given the hyperparameters. In contrast, the Tree-Parzen
L07553: estimator models the probability of the hyperparameters given the model performance.
L07554: Hyperband (Li et al., 2017b) is a multi-armed bandit strategy for hyperparameter optimization.
L07555: It assumes that there are computationally cheap but approximate ways to measure performance
L07556: (e.g., by not training to completion) and that these can be associated with a budget (e.g., by
L07557: training for a fixed number of iterations). A number of random configurations are sampled and
L07558: run until the budget is used up. Then the best fraction η of runs is kept, and the budget is
L07559: multiplied by 1/η. This is repeated until the maximum budget is reached. This approach has
L07560: the advantage of eﬀiciency; for bad configurations, it does not need to run the experiment to the
L07561: end. However, each sample is just chosen randomly, which is ineﬀicient. The BOHB algorithm
L07562: (Falkner et al., 2018) combines the eﬀiciency of Hyperband with the more sensible choice of
L07563: hyperparameters from Tree Parzen estimators to construct an even better method.
L07564: Problems
L07565: Problem 8.1 Will the multiclass cross-entropy training loss in figure 8.2 ever reach zero? Explain
L07566: your reasoning.
L07567: Problem 8.2 What values should we choose for the three weights and biases in the first layer of
L07568: the model in figure 8.4a so that the hidden unit’s responses are as depicted in figures 8.4b–d?
L07569: Problem 8.3∗Given a training dataset consisting of I input/output pairs {xi, yi}, show how
L07570: the parameters {β, ω1, ω2, ω3} for the model in figure 8.4a using the least squares loss function
L07571: can be found in closed form.
L07572: Problem 8.4 Consider the curve in figure 8.10b at the point where we train a model with a
L07573: hidden layer of size 200, which would have 50,410 parameters. What do you predict will happen
L07574: to the training and test performance if we increase the number of training examples from 10,000
L07575: to 50,410?
L07576: Problem 8.5 Consider the case where the model capacity exceeds the number of training data
L07577: points, and the model is flexible enough to reduce the training loss to zero.
L07578: What are the
L07579: implications of this for fitting a heteroscedastic model?
L07580: Propose a method to resolve any
L07581: problems that you identify.
L07582: Problem 8.6 Show that two random points drawn from a 1000-dimensional standard Gaussian
L07583: distribution are orthogonal relative to the origin with high probability.
L07584: Problem 8.7 The volume of a hypersphere with radius r in D dimensions is:
L07585: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L07588: <!-- page 151 -->
L07589: Notes
L07590: 137
L07591: Figure 8.13 Typical sets. a) Standard normal distribution in two dimensions.
L07592: Circles are four samples from this distribution. As the distance from the cen-
L07593: ter increases, the probability decreases, but the volume of space at that radius
L07594: (i.e., the area between adjacent evenly spaced circles) increases. b) These fac-
L07595: tors trade off so that the histogram of distances of samples from the center has
L07596: a pronounced peak. c) In higher dimensions, this effect becomes more extreme,
L07597: and the probability of observing a sample close to the mean becomes vanishingly
L07598: small.
L07599: Although the most likely point is at the mean of the distribution, the
L07600: typical samples are found in a relatively narrow shell.
L07601: Vol[r] =
L07602: rDπD/2
L07603: Γ[D/2 + 1],
L07604: (8.8)
L07605: where Γ[•] is the Gamma function. Show using Stirling’s formula that the volume of a hyper-
L07606: Appendix B.1.3
L07607: Gamma function
L07608: Appendix B.1.4
L07609: Stirling’s formula
L07610: sphere of diameter one (radius r=0.5) becomes zero as the dimension increases.
L07611: Problem 8.8∗Consider a hypersphere of radius r = 1. Find an expression for the proportion
L07612: of the total volume that lies in the outermost 1% of the distance from the center (i.e., in the
L07613: outermost shell of thickness 0.01). Show that this becomes one as the dimension increases.
L07614: Problem 8.9 Figure 8.13c shows the distribution of distances of samples of a standard normal
L07615: distribution as the dimension increases. Empirically verify this finding by sampling from the
L07616: standard normal distributions in 25, 100, and 500 dimensions and plotting a histogram of the
L07617: distances from the center. What closed-form probability distribution describes these distances?
L07618: Draft: please send errata to udlbookmail@gmail.com.
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
