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
L08351: <!-- page 170 -->
L08352: 156
L08353: 9
L08354: Regularization
L08355: where, as usual, α is the learning rate, and L is the loss. This is identical to gradient descent,
L08356: except that the weights are reduced by a factor of 1−λ′ before the gradient update. For standard
L08357: SGD, weight decay is equivalent to L2 regularization (equation 9.5) with coeﬀicient λ = λ′/2α.
L08358: Problem 9.5
L08359: However, for Adam, the learning rate α is different for each parameter, so L2 regularization
L08360: and weight decay differ. Loshchilov & Hutter (2019) present AdamW, which modifies Adam to
L08361: implement weight decay correctly and show that this improves performance.
L08362: Other choices of vector norm encourage sparsity in the weights. The L0 regularization term
L08363: Appendix B.3.2
L08364: Vector norms
L08365: applies a fixed penalty for every non-zero weight. The effect is to “prune” the network. L0
L08366: regularization can also be used to encourage group sparsity; this might apply a fixed penalty if
L08367: any of the weights contributing to a given hidden unit are non-zero. If they are all zero, we can
L08368: remove the unit, decreasing the model size and making inference faster.
L08369: Unfortunately, L0 regularization is challenging to implement since the derivative of the regular-
L08370: ization term is not smooth, and more sophisticated fitting methods are required (see Louizos
L08371: et al., 2018).
L08372: Somewhere between L2 and L0 regularization is L1 regularization or LASSO
L08373: (least absolute shrinkage and selection operator), which imposes a penalty on the absolute val-
L08374: ues of the weights. L2 regularization somewhat discourages sparsity in that the derivative of
L08375: the squared penalty decreases as the weight becomes smaller, lowering the pressure to make it
L08376: smaller still. L1 regularization does not have this disadvantage, as the derivative of the penalty
L08377: is constant. This can produce sparser solutions than L2 regularization but is much easier to
L08378: Problem 9.6
L08379: optimize than L0 regularization.
L08380: Sometimes both L1 and L2 regularization terms are used,
L08381: which is termed an elastic net penalty (Zou & Hastie, 2005).
L08382: A different approach to regularization is to modify the gradients of the learning algorithm
L08383: without ever explicitly formulating a new loss function (e.g., equation 9.13). This approach has
L08384: been used to promote sparsity during backpropagation (Schwarz et al., 2021).
L08385: The evidence on the effectiveness of explicit regularization is mixed. Zhang et al. (2017a) showed
L08386: that L2 regularization contributes little to generalization. It has been proven that the Lipschitz
L08387: constant of the network (how fast the function can change as we modify the input) bounds
L08388: Appendix B.1.1
L08389: Lipschitz constant
L08390: the generalization error (Bartlett et al., 2017; Neyshabur et al., 2018). However, the Lipschitz
L08391: constant depends on the product of the spectral norms of the weight matrices Ωk, which are
L08392: Appendix B.3.7
L08393: Spectral norm
L08394: only indirectly dependent on the magnitudes of the individual weights. Bartlett et al. (2017),
L08395: Neyshabur et al. (2018), and Yoshida & Miyato (2017) all add terms that indirectly encourage
L08396: the spectral norms to be smaller. Gouk et al. (2021) take a different approach and develop an
L08397: algorithm that constrains the Lipschitz constant of the network to be below a particular value.
L08398: Implicit regularization in gradient descent:
L08399: The gradient descent step is:
L08400: ϕ1 = ϕ0 + α · g[ϕ0],
L08401: (9.14)
L08402: where g[ϕ0] is the negative of the gradient of the loss function, and α is the step size. As α →0,
L08403: the gradient descent process can be described by a differential equation:
L08404: dϕ
L08405: dt = g[ϕ].
L08406: (9.15)
L08407: For typical step sizes α, the discrete and continuous versions converge to different solutions. We
L08408: can use backward error analysis to find a correction g1[ϕ] to the continuous version:
L08409: dϕ
L08410: dt ≈g[ϕ] + αg1[ϕ] + . . . ,
L08411: (9.16)
L08412: so that it gives the same result as the discrete version.
L08413: Consider the first two terms of a Taylor expansion of the modified continuous solution ϕ around
L08414: initial position ϕ0:
L08415: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L08418: <!-- page 171 -->
L08419: Notes
L08420: 157
L08421: ϕ[α]
L08422: ≈
L08423: ϕ + αdϕ
L08424: dt + α2
L08425: 2
L08426: d2ϕ
L08427: dt2
L08433: ϕ=ϕ0
L08434: ≈
L08435: ϕ + α (g[ϕ] + αg1[ϕ]) + α2
L08436: 2
L08437: ∂g[ϕ]
L08438: ∂ϕ
L08439: dϕ
L08440: dt + α∂g1[ϕ]
L08441: ∂ϕ
L08442: dϕ
L08443: dt
L08444: 
L08449: ϕ=ϕ0
L08450: =
L08451: ϕ + α (g[ϕ] + αg1[ϕ]) + α2
L08452: 2
L08453: ∂g[ϕ]
L08454: ∂ϕ g[ϕ] + α∂g1[ϕ]
L08455: ∂ϕ
L08456: g[ϕ]
L08457: 
L08462: ϕ=ϕ0
L08463: ≈
L08464: ϕ + αg[ϕ] + α2
L08465: 
L08466: g1[ϕ] + 1
L08467: 2
L08468: ∂g[ϕ]
L08469: ∂ϕ g[ϕ]
L08470: 
L08475: ϕ=ϕ0
L08476: ,
L08477: (9.17)
L08478: where in the second line, we have introduced the correction term (equation 9.16), and in the
L08479: final line, we have removed terms of greater order than α2.
L08480: Note that the first two terms on the right-hand side ϕ0 + αg[ϕ0] are the same as the discrete
L08481: update (equation 9.14). Hence, to make the continuous and discrete versions arrive at the same
L08482: place, the third term on the right-hand side must equal zero, allowing us to solve for g1[ϕ]:
L08483: g1[ϕ] = −1
L08484: 2
L08485: ∂g[ϕ]
L08486: ∂ϕ g[ϕ].
L08487: (9.18)
L08488: During training, the evolution function g[ϕ] is the negative of the gradient of the loss:
L08489: dϕ
L08490: dt
L08491: ≈
L08492: g[ϕ] + αg1[ϕ]
L08493: =
L08494: −∂L
L08495: ∂ϕ −α
L08496: 2
L08497: ∂2L
L08498: ∂ϕ2
L08499:  ∂L
L08500: ∂ϕ.
L08501: (9.19)
L08502: This is equivalent to performing continuous gradient descent on the loss function:
L08503: LGD[ϕ] = L[ϕ] + α
L08504: 4
L08509: ∂L
L08510: ∂ϕ
L08515: 2
L08516: ,
L08517: (9.20)
L08518: because the right-hand side of equation 9.19 is the derivative of that in equation 9.20.
L08519: This formulation of implicit regularization was developed by Barrett & Dherin (2021) and
L08520: extended to stochastic gradient descent by Smith et al. (2021). Smith et al. (2020) and others
L08521: have shown that stochastic gradient descent with small or moderate batch sizes outperforms full
L08522: batch gradient descent on the test set, and this may in part be due to implicit regularization.
L08523: Relatedly, Jastrzębski et al. (2021) and Cohen et al. (2021) both show that using a large learn-
L08524: ing rate reduces the tendency of typical optimization trajectories to move to “sharper” parts of
L08525: the loss function (i.e., where at least one direction has high curvature). This implicit regular-
L08526: ization effect of large learning rates can be approximated by penalizing the trace of the Fisher
L08527: Information Matrix, which is closely related to penalizing the gradient norm in equation 9.20
L08528: (Jastrzębski et al., 2021).
L08529: Early stopping:
L08530: Bishop (1995) and Sjöberg & Ljung (1995) argued that early stopping limits
L08531: the effective solution space that the training procedure can explore; given that the weights are
L08532: initialized to small values, this leads to the idea that early stopping helps prevent the weights
L08533: from getting too large. Goodfellow et al. (2016) show that under a quadratic approximation
L08534: of the loss function with parameters initialized to zero, early stopping is equivalent to L2 reg-
L08535: ularization in gradient descent. The effective regularization weight λ is approximately 1/(τα)
L08536: where α is the learning rate, and τ is the early stopping time.
L08537: Draft: please send errata to udlbookmail@gmail.com.
L08540: <!-- page 172 -->
L08541: 158
L08542: 9
L08543: Regularization
L08544: Ensembling:
L08545: Ensembles can be trained using different random seeds (Lakshminarayanan
L08546: et al., 2017), hyperparameters (Wenzel et al., 2020b), or even entirely different families of
L08547: models. The models can be combined by averaging their predictions, weighting the predictions,
L08548: or stacking (Wolpert, 1992), in which the results are combined using another machine learning
L08549: model. Lakshminarayanan et al. (2017) showed that averaging the output of independently
L08550: trained networks can improve accuracy, calibration, and robustness. Conversely, Frankle et al.
L08551: (2020) showed that if we average together the weights to make one model, the network fails.
L08552: Fort et al. (2019) compared ensembling solutions that resulted from different initializations
L08553: with ensembling solutions that were generated from the same original model. For example, in
L08554: the latter case, they consider exploring around the solution in a limited subspace to find other
L08555: Appendix B.3.6
L08556: Subspaces
L08557: good nearby points. They found that both techniques provide complementary benefits but that
L08558: genuine ensembling from different random starting points provides a bigger improvement.
L08559: An eﬀicient way of ensembling is to combine models from intermediate stages of training. To this
L08560: end, Izmailov et al. (2018) introduce stochastic weight averaging, in which the model weights
L08561: are sampled at different time steps and averaged together. As the name suggests, snapshot
L08562: ensembles (Huang et al., 2017a) also store the models from different time steps and average
L08563: their predictions. The diversity of these models can be improved by cyclically increasing and
L08564: decreasing the learning rate. Garipov et al. (2018) observed that different minima of the loss
L08565: function are often connected by a low-energy path (i.e., a path with a low loss everywhere along
L08566: it). Motivated by this observation, they developed a method that explores low-energy regions
L08567: around an initial solution to provide diverse models without retraining. This is known as fast
L08568: geometric ensembling. A review of ensembling methods can be found in Ganaie et al. (2022).
L08569: Dropout:
L08570: Dropout was first introduced by Hinton et al. (2012b) and Srivastava et al. (2014).
L08571: Dropout is applied at the level of hidden units. Dropping a hidden unit has the same effect
L08572: as temporarily setting all the incoming and outgoing weights and the bias to zero. Wan et al.
L08573: (2013) generalized dropout by randomly setting individual weights to zero. Gal & Ghahramani
L08574: (2016) and Kendall & Gal (2017) proposed Monte Carlo dropout, in which inference is computed
L08575: with several dropout patterns, and the results are averaged together. Gal & Ghahramani (2016)
L08576: argued that this could be interpreted as approximating Bayesian inference.
L08577: Dropout is equivalent to applying multiplicative Bernoulli noise to the hidden units. Similar
L08578: benefits derive from using other distributions, including the normal (Srivastava et al., 2014;
L08579: Shen et al., 2017), uniform (Shen et al., 2017), and beta distributions (Liu et al., 2019b).
L08580: Adding noise:
L08581: Bishop (1995) and An (1996) added Gaussian noise to the network inputs to
L08582: improve performance. Bishop (1995) showed that this is equivalent to weight decay. An (1996)
L08583: also investigated adding noise to the weights. DeVries & Taylor (2017a) added Gaussian noise
L08584: to the hidden units. The randomized ReLU (Xu et al., 2015) applies noise in a different way by
L08585: making the activation functions stochastic.
L08586: Label smoothing:
L08587: Label smoothing was introduced by Szegedy et al. (2016) for image classi-
L08588: fication but has since been shown to be helpful in speech recognition (Chorowski & Jaitly, 2017),
L08589: machine translation (Vaswani et al., 2017), and language modeling (Pereyra et al., 2017). The
L08590: precise mechanism by which label smoothing improves test performance isn’t well understood,
L08591: although Müller et al. (2019a) show that it improves the calibration of the predicted output
L08592: probabilities. A closely related technique is DisturbLabel (Xie et al., 2016), in which a certain
L08593: percentage of the labels in each batch are randomly switched at each training iteration.
L08594: Finding wider minima:
L08595: It is thought that wider minima generalize better (see figure 20.11).
L08596: Here, the exact values of the weights are less important, so performance should be robust to
L08597: errors in their estimates. One of the reasons that applying noise to parts of the network during
L08598: training is effective is that it encourages the network to be indifferent to their exact values.
L08599: Chaudhari et al. (2019) developed a variant of SGD that biases the optimization toward flat
L08600: minima, which they call entropy SGD. The idea is to incorporate local entropy as a term in the
L08601: loss function. In practice, this takes the form of one SGD-like update within another. Keskar
L08602: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L08605: <!-- page 173 -->
L08606: Notes
L08607: 159
L08608: et al. (2017) showed that SGD finds wider minima as the batch size is reduced. This may be
L08609: because of the batch variance term that results from implicit regularization by SGD.
L08610: Ishida et al. (2020) use a technique named flooding, in which they intentionally prevent the
L08611: training loss from becoming zero. This encourages the solution to perform a random walk over
L08612: the loss landscape and drift into a flatter area with better generalization.
L08613: Bayesian approaches:
L08614: For some models, including the simplified neural network model in
L08615: figure 9.11, the Bayesian predictive distribution can be computed in closed form (see Bishop,
L08616: 2006; Prince, 2012). For neural networks, the posterior distribution over the parameters can-
L08617: not be represented in closed form and must be approximated. The two main approaches are
L08618: variational Bayes (Hinton & van Camp, 1993; MacKay, 1995; Barber & Bishop, 1997; Blundell
L08619: et al., 2015), in which the posterior is approximated by a simpler tractable distribution, and
L08620: Markov Chain Monte Carlo (MCMC) methods, which approximate the distribution by drawing
L08621: a set of samples (Neal, 1995; Welling & Teh, 2011; Chen et al., 2014; Ma et al., 2015; Li et al.,
L08622: 2016a). The generation of samples can be integrated into SGD, and this is known as stochas-
L08623: tic gradient MCMC (see Ma et al., 2015). It has recently been discovered that “cooling” the
L08624: posterior distribution over the parameters (making it sharper) improves predictions from these
L08625: models (Wenzel et al., 2020a), but this is not currently fully understood (see Noci et al., 2021).
L08626: Transfer learning:
L08627: Transfer learning for visual tasks works extremely well (Sharif Razavian
L08628: et al., 2014) and has supported rapid progress in computer vision, including the original AlexNet
L08629: results (Krizhevsky et al., 2012). Transfer learning has also impacted natural language process-
L08630: ing (NLP), where many models are based on pre-trained features from the BERT model (Devlin
L08631: et al., 2019). More information can be found in Zhuang et al. (2020) and Yang et al. (2020b).
L08632: Self-supervised learning:
L08633: Self-supervised learning techniques for images have included in-
L08634: painting masked image regions (Pathak et al., 2016), predicting the relative position of patches
L08635: in an image (Doersch et al., 2015), re-arranging permuted image tiles back into their original
L08636: configuration (Noroozi & Favaro, 2016), colorizing grayscale images (Zhang et al., 2016b), and
L08637: transforming rotated images back to their original orientation (Gidaris et al., 2018). In Sim-
L08638: CLR (Chen et al., 2020c), a network is learned that maps versions of the same image that
L08639: have been photometrically and geometrically transformed to the same representation while re-
L08640: pelling versions of different images, with the goal of becoming indifferent to irrelevant image
L08641: transformations. Jing & Tian (2020) present a survey of self-supervised learning in images.
L08642: Self-supervised learning in NLP can be based on predicting masked words (Devlin et al., 2019),
L08643: predicting the next word in a sentence (Radford et al., 2019; Brown et al., 2020), or predicting
L08644: whether two sentences follow one another (Devlin et al., 2019). In automatic speech recognition,
L08645: the Wav2Vec model (Schneider et al., 2019) aims to distinguish an original audio sample from
L08646: one where 10ms of audio has been swapped out from elsewhere in the clip. Self-supervision
L08647: has also been applied to graph neural networks (chapter 13). Tasks include recovering masked
L08648: features (You et al., 2020) and recovering the adjacency structure of the graph (Kipf & Welling,
L08649: 2016). Liu et al. (2023a) review self-supervised learning for graph models.
L08650: Data augmentation:
L08651: Data augmentation for images dates back to at least LeCun et al.
L08652: (1998) and contributed to the success of AlexNet (Krizhevsky et al., 2012), in which the dataset
L08653: was increased by a factor of 2048. Image augmentation approaches include geometric transfor-
L08654: mations, changing or manipulating the color space, noise injection, and applying spatial filters.
L08655: More elaborate techniques include randomly mixing images (Inoue, 2018; Summers & Dinneen,
L08656: 2019), randomly erasing parts of the image (Zhong et al., 2020), style transfer (Jackson et al.,
L08657: 2019), and randomly swapping image patches (Kang et al., 2017). In addition, many studies
L08658: have used generative adversarial networks or GANs (see chapter 15) to produce novel but plau-
L08659: sible data examples (e.g., Calimeri et al., 2017). In other cases, the data have been augmented
L08660: with adversarial examples (Goodfellow et al., 2015a), which are minor perturbations of the
L08661: training data that cause the example to be misclassified. A review of data augmentation for
L08662: images can be found in Shorten & Khoshgoftaar (2019).
L08663: Draft: please send errata to udlbookmail@gmail.com.
L08666: <!-- page 174 -->
L08667: 160
L08668: 9
L08669: Regularization
L08670: Augmentation methods for acoustic data include pitch shifting, time stretching, dynamic range
L08671: compression, and adding random noise (e.g., Abeßer et al., 2017; Salamon & Bello, 2017; Xu
L08672: et al., 2015; Lasseck, 2018), as well as mixing data pairs (Zhang et al., 2017c; Yun et al., 2019),
L08673: masking features (Park et al., 2019), and using GANs to generate new data (Mun et al., 2017).
L08674: Augmentation for speech data includes vocal tract length perturbation (Jaitly & Hinton, 2013;
L08675: Kanda et al., 2013), style transfer (Gales, 1998; Ye & Young, 2004), adding noise (Hannun et al.,
L08676: 2014), and synthesizing speech (Gales et al., 2009).
L08677: Augmentation methods for text include adding noise at a character level by switching, deleting,
L08678: and inserting letters (Belinkov & Bisk, 2018; Feng et al., 2020), or by generating adversarial
L08679: examples (Ebrahimi et al., 2018), using common spelling mistakes (Coulombe, 2018), randomly
L08680: swapping or deleting words (Wei & Zou, 2019), using synonyms (Kolomiyets et al., 2011),
L08681: altering adjectives (Li et al., 2017c), passivization (Min et al., 2020), using generative models
L08682: to create new data (Qiu et al., 2020), and round-trip translation to another language and back
L08683: (Aiken & Park, 2010). Augmentation methods for text are reviewed by Bayer et al. (2022).
L08684: Problems
L08685: Problem 9.1 Consider a model where the prior distribution over the parameters is a normal
L08686: distribution with mean zero and variance σ2
L08687: ϕ so that
L08688: Pr(ϕ) =
L08689: J
L08690: Y
L08691: j=1
L08692: Normϕj[0, σ2
L08693: ϕ],
L08694: (9.21)
L08695: where j indexes the model parameters. We now maximize QI
L08696: i=1 Pr(yi|xi, ϕ)Pr(ϕ). Show that
L08697: the associated loss function of this model is equivalent to L2 regularization.
L08698: Problem 9.2 How do the gradients of the loss function change when L2 regularization (equa-
L08699: tion 9.5) is added?
L08700: Problem 9.3∗Consider a linear regression model y = ϕ0 + ϕ1x with input x, output y, and
L08701: parameters ϕ0 and ϕ1. Assume we have I training examples {xi, yi} and use a least squares
L08702: loss. Consider adding Gaussian noise with mean zero and variance σ2
L08703: x to the inputs xi at each
L08704: training iteration. Derive an expression for the expected loss.
L08705: Problem 9.4∗Derive the loss function for multiclass classification when we use label smooth-
L08706: ing so that the target probability distribution has 0.9 at the correct class and the remaining
L08707: probability mass of 0.1 is divided between the remaining Do −1 classes.
L08708: Problem 9.5 Show that the weight decay parameter update with decay rate λ:
L08709: ϕ ←−(1 −λ)ϕ −α ∂L
L08710: ∂ϕ,
L08711: (9.22)
L08712: on the original loss function L[ϕ] is equivalent to a standard gradient update using L2 regular-
L08713: ization so that the modified loss function ˜L[ϕ] is:
L08714: ˜L[ϕ] = L[ϕ] + λ
L08715: 2α
L08716: X
L08717: k
L08718: ϕ2
L08719: k,
L08720: (9.23)
L08721: where ϕ are the parameters, and α is the learning rate.
L08722: Problem 9.6 Consider a model with parameters ϕ = [ϕ0, ϕ1]T .
L08723: Draw the L0, L 1
L08724: 2, and L1
L08725: regularization terms in a similar form to figure 9.1b. The LP regularization term is PD
L08726: d=1 |ϕd|P .
L08727: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L08730: <!-- page 175 -->
L08731: Chapter 10
L08732: Convolutional networks
L08733: Chapters 2–9 introduced the supervised learning pipeline for deep neural networks. How-
L08734: ever, these chapters only considered fully connected networks with a single path from
L08735: input to output. Chapters 10–13 introduce more specialized network components with
L08736: sparser connections, shared weights, and parallel processing paths.
L08737: This chapter de-
L08738: scribes convolutional layers, which are mainly used for processing image data.
L08739: Images have three properties that suggest the need for specialized model architec-
L08740: ture. First, they are high-dimensional. A typical image for a classification task contains
L08741: 224×224 RGB values (i.e., 150,528 input dimensions). Hidden layers in fully connected
L08742: networks are generally larger than the input size, so even for a shallow network, the
L08743: number of weights would exceed 150, 5282, or 22 billion. This poses obvious practical
L08744: problems in terms of the required training data, memory, and computation.
L08745: Second, nearby image pixels are statistically related. However, fully connected net-
L08746: works have no notion of “nearby” and treat the relationship between every input equally.
L08747: If the pixels of the training and test images were randomly permuted in the same way,
L08748: the network could still be trained with no practical difference. Third, the interpretation
L08749: of an image is stable under geometric transformations. An image of a tree is still an
L08750: image of a tree if we shift it leftwards by a few pixels. However, this shift changes every
L08751: input to the network. Hence, a fully connected model must learn the patterns of pixels
L08752: that signify a tree separately at every position, which is clearly ineﬀicient.
L08753: Convolutional layers process each local image region independently, using parameters
L08754: shared across the whole image. They use fewer parameters than fully connected layers,
L08755: exploit the spatial relationships between nearby pixels, and don’t have to re-learn the
L08756: interpretation of the pixels at every position. A network predominantly consisting of
L08757: convolutional layers is known as a convolutional neural network or CNN.
L08758: 10.1
L08759: Invariance and equivariance
L08760: We argued above that some properties of images (e.g., tree texture) are stable under
L08761: transformations. In this section, we make this idea more mathematically precise. A
L08762: Draft: please send errata to udlbookmail@gmail.com.
L08765: <!-- page 176 -->
L08766: 162
L08767: 10
L08768: Convolutional networks
L08769: Figure 10.1 Invariance and equivariance for translation. a–b) In image classi-
L08770: fication, the goal is to categorize both images as “mountain” regardless of the
L08771: horizontal shift that has occurred. In other words, we require the network pre-
L08772: diction to be invariant to translation. c,e) The goal of semantic segmentation is
L08773: to associate a label with each pixel. d,f) When the input image is translated, we
L08774: want the output (colored overlay) to translate in the same way. In other words,
L08775: we require the output to be equivariant with respect to translation. Panels c–f)
L08776: adapted from Bousselham et al. (2021).
L08777: function f[x] of an image x is invariant to a transformation t[x] if:
L08778: f
L08779: 
L08780: t[x]
L08781: 
L08782: = f[x].
L08783: (10.1)
L08784: In other words, the output of the function f[x] is the same regardless of the transfor-
L08785: mation t[x]. Networks for image classification should be invariant to geometric trans-
L08786: formations of the image (figure 10.1a–b). The network f[x] should identify an image as
L08787: containing the same object, even if it has been translated, rotated, flipped, or warped.
L08788: A function f[x] of an image x is equivariant or covariant to a transformation t[x] if:
L08789: f
L08790: 
L08791: t[x]
L08792: 
L08793: = t
L08794: 
L08795: f[x]
L08796: 
L08797: .
L08798: (10.2)
L08799: In other words, f[x] is equivariant to the transformation t[x] if its output changes in
L08800: the same way under the transformation as the input.
L08801: Networks for per-pixel image
L08802: segmentation should be equivariant to transformations (figure 10.1c–f); if the image is
L08803: translated, rotated, or flipped, the network f[x] should return a segmentation that has
L08804: been transformed in the same way.
L08805: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L08808: <!-- page 177 -->
L08809: 10.2
L08810: Convolutional networks for 1D inputs
L08811: 163
L08812: Figure 10.2 1D convolution with kernel size three. Each output zi is a weighted
L08813: sum of the nearest three inputs xi−1, xi, and xi+1, where the weights are ω =
L08814: [ω1, ω2, ω3]. a) Output z2 is computed as z2 = ω1x1 + ω2x2 + ω3x3. b) Output z3
L08815: is computed as z3 = ω1x2 + ω2x3 + ω3x4. c) At position z1, the kernel extends
L08816: beyond the first input x1. This can be handled by zero-padding, in which we
L08817: assume values outside the input are zero. The final output is treated similarly.
L08818: d) Alternatively, we could only compute outputs where the kernel fits within the
L08819: input range (“valid” convolution); now, the output will be smaller than the input.
L08820: 10.2
L08821: Convolutional networks for 1D inputs
L08822: Convolutional networks consist of a series of convolutional layers, each of which is equiv-
L08823: ariant to translation. They also typically include pooling mechanisms that induce partial
L08824: invariance to translation. For clarity of exposition, we first consider convolutional net-
L08825: works for 1D data, which are easier to visualize. In section 10.3, we progress to 2D
L08826: convolution, which can be applied to image data.
L08827: 10.2.1
L08828: 1D convolution operation
L08829: Convolutional layers are network layers based on the convolution operation. In 1D, a
L08830: convolution transforms an input vector x into an output vector z so that each output zi
L08831: is a weighted sum of nearby inputs. The same weights are used at every position and
L08832: are collectively called the convolution kernel or filter. The size of the region over which
L08833: inputs are combined is termed the kernel size. For a kernel size of three, we have:
L08834: zi = ω1xi−1 + ω2xi + ω3xi+1,
L08835: (10.3)
L08836: where ω = [ω1, ω2, ω3]T is the kernel (figure 10.2).1 Notice that the convolution oper-
L08837: Problem 10.1
L08838: ation is equivariant with respect to translation. If we translate the input x, then the
L08839: corresponding output z is translated in the same way.
L08840: 1Strictly speaking, this is a cross-correlation and not a convolution, in which the weights would be
L08841: flipped relative to the input (so we would switch xi−1 with xi+1). Regardless, this (incorrect) definition
L08842: is the usual convention in machine learning.
L08843: Draft: please send errata to udlbookmail@gmail.com.
L08846: <!-- page 178 -->
L08847: 164
L08848: 10
L08849: Convolutional networks
L08850: Figure 10.3 Stride, kernel size, and dilation. a) With a stride of two, we evaluate
L08851: the kernel at every other position, so the first output z1 is computed from a
L08852: weighted sum centered at x1, and b) the second output z2 is computed from a
L08853: weighted sum centered at x3 and so on. c) The kernel size can also be changed.
L08854: With a kernel size of five, we take a weighted sum of the nearest five inputs. d)
L08855: In dilated or atrous convolution (from the French “à trous” – with holes), we
L08856: intersperse zeros in the weight vector to allow us to combine information over a
L08857: large area using fewer weights.
L08858: 10.2.2
L08859: Padding
L08860: Equation 10.3 shows that each output is computed by taking a weighted sum of the
L08861: previous, current, and subsequent positions in the input. This begs the question of how
L08862: to deal with the first output (where there is no previous input) and the final output
L08863: (where there is no subsequent input).
L08864: There are two common approaches. The first is to pad the edges of the inputs with
L08865: new values and proceed as usual. Zero-padding assumes the input is zero outside its
L08866: valid range (figure 10.2c). Other possibilities include treating the input as circular or
L08867: reflecting it at the boundaries. The second approach is to discard the output positions
L08868: where the kernel exceeds the range of input positions. These valid convolutions have the
L08869: advantage of introducing no extra information at the edges of the input. However, they
L08870: have the disadvantage that the representation decreases in size.
L08871: 10.2.3
L08872: Stride, kernel size, and dilation
L08873: In the example above, each output was a sum of the nearest three inputs. However,
L08874: this is just one of a larger family of convolution operations, the members of which are
L08875: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L08878: <!-- page 179 -->
L08879: 10.2
L08880: Convolutional networks for 1D inputs
L08881: 165
L08882: distinguished by their stride, kernel size, and dilation rate. When we evaluate the output
L08883: at every position, we term this a stride of one. However, it is also possible to shift the
L08884: kernel by a stride greater than one. If we have a stride of two, we create roughly half
L08885: the number of outputs (figure 10.3a–b).
L08886: The kernel size can be increased to integrate over a larger area (figure 10.3c). How-
L08887: ever, it typically remains an odd number so that it can be centered around the current
L08888: position. Increasing the kernel size has the disadvantage of requiring more weights. This
L08889: leads to the idea of dilated or atrous convolutions, in which the kernel values are inter-
L08890: spersed with zeros. For example, we can turn a kernel of size five into a dilated kernel of
L08891: size three by setting the second and fourth elements to zero. We still integrate informa-
L08892: Problems 10.2–10.4
L08893: tion from a larger input region but only require three weights to do this (figure 10.3d).
L08894: The dilation rate is the number of zeros interspersed between the weights plus one.
L08895: 10.2.4
L08896: Convolutional layers
L08897: A convolutional layer computes its output by convolving the input, adding a bias β, and
L08898: passing each result through an activation function a[•]. With kernel size three, stride
L08899: one, and dilation rate one, the ith hidden unit hi would be computed as:
L08900: hi
L08901: =
L08902: a [β + ω1xi−1 + ω2xi + ω3xi+1]
L08903: =
L08904: a
L08905: 
L08906: β +
L08907: 3
L08908: X
L08909: j=1
L08910: ωjxi+j−2
L08911: 
L08912: ,
L08913: (10.4)
L08914: where the bias β and kernel weights ω1, ω2, ω3 are trainable parameters, and (with zero-
L08915: padding) we treat the input x as zero when it is out of the valid range. This is a special
L08916: case of a fully connected layer that computes the ith hidden unit as:
L08917: hi
L08918: =
L08919: a
L08920: 
L08921: βi +
L08922: D
L08923: X
L08924: j=1
L08925: ωijxj
L08926: 
L08927: .
L08928: (10.5)
L08929: If there are D inputs x• and D hidden units h•, this fully connected layer would have D2
L08930: weights ω•• and D biases β•. The convolutional layer only uses three weights and one
L08931: bias. A fully connected layer can reproduce this exactly if most weights are set to zero
L08932: Problem 10.5
L08933: and others are constrained to be identical (figure 10.4).
L08934: 10.2.5
L08935: Channels
L08936: If we only apply a single convolution, information will likely be lost; we are averaging
L08937: nearby inputs, and the ReLU activation function clips results that are less than zero.
L08938: Hence, it is usual to compute several convolutions in parallel. Each convolution produces
L08939: a new set of hidden variables, termed a feature map or channel.
L08940: Draft: please send errata to udlbookmail@gmail.com.
L08943: <!-- page 180 -->
L08944: 166
L08945: 10
L08946: Convolutional networks
L08947: Figure 10.4 Fully connected vs. convolutional layers. a) A fully connected layer
L08948: has a weight connecting each input x to each hidden unit h (colored arrows)
L08949: and a bias for each hidden unit (not shown). b) Hence, the associated weight
L08950: matrix Ωcontains 36 weights relating the six inputs to the six hidden units. c) A
L08951: convolutional layer with kernel size three computes each hidden unit as the same
L08952: weighted sum of the three neighboring inputs (arrows) plus a bias (not shown).
L08953: d) The weight matrix is a special case of the fully connected matrix where many
L08954: weights are zero and others are repeated (same colors indicate same value, white
L08955: indicates zero weight). e) A convolutional layer with kernel size three and stride
L08956: two computes a weighted sum at every other position. f) This is also a special
L08957: case of a fully connected network with a different sparse weight structure.
L08958: Figure 10.5 Channels. Typically, multiple convolutions are applied to the input x
L08959: and stored in channels. a) A convolution is applied to create hidden units h1
L08960: to h6, which form the first channel. b) A second convolution operation is applied
L08961: to create hidden units h7 to h12, which form the second channel. The channels
L08962: are stored in a 2D array H1 that contains all the hidden units in the first hidden
L08963: layer. c) If we add a further convolutional layer, there are now two channels at
L08964: each input position. Here, the 1D convolution defines a weighted sum over both
L08965: input channels at the three closest positions to create each new output channel.
L08966: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
