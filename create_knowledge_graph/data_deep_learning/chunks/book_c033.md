L21842: <!-- page 422 -->
L21843: 408
L21844: 20
L21845: Why does deep learning work?
L21846: the choice of activation function are both important. Surprisingly, the choice of dataset,
L21847: the randomness of the fitting algorithm, and the use of regularization don’t seem impor-
L21848: tant. There is no definitive evidence that (for a fixed parameter count) the depth of the
L21849: network matters (other than numerical problems due to exploding/vanishing/shattered
L21850: gradients). This section tackles the same topic from a different angle by considering the
L21851: empirical properties of loss functions. Most of this evidence comes from fully connected
L21852: networks and CNNs; loss functions of transformer networks are less well understood.
L21853: 20.3.1
L21854: Multiple global minima
L21855: We expect loss functions for deep networks to have a large family of equivalent global
L21856: minima. In fully connected networks, the hidden units at each layer and their associated
L21857: weights can be permuted without changing the output. In convolutional networks, per-
L21858: muting the channels and convolution kernels appropriately doesn’t change the output.
L21859: We can multiply the weight before any ReLU function and divide the weight after by a
L21860: positive number without changing the output. Using BatchNorm induces another set of
L21861: redundancies because the mean and variance of each hidden unit or channel are reset.
L21862: The above modifications all produce the same output for every input. However, the
L21863: global minimum only depends on the output at the training data points. In overparam-
L21864: eterized networks, there will also be families of solutions that behave identically at the
L21865: data points but differently between them. All of these are also global minima.
L21866: 20.3.2
L21867: Route to the minimum
L21868: Goodfellow et al. (2015b) considered a straight line between the initial parameters and
L21869: the final values.
L21870: They show that the loss function along this line usually decreases
L21871: monotonically (except for a small bump near the start sometimes). This phenomenon is
L21872: observed for several different types of networks and activation functions (figure 20.5a).
L21873: Of course, real optimization trajectories do not proceed in a straight line. However,
L21874: Li et al. (2018b) find that they do lie in low-dimensional subspaces. They attribute this
L21875: to the existence of large, nearly convex regions in the loss landscape that capture the
L21876: trajectory early on and funnel it in a few important directions. Surprisingly, Li et al.
L21877: (2018a) showed that networks still train well if optimization is constrained to lie in a
L21878: random low-dimensional subspace (figure 20.6).
L21879: Li & Liang (2018) show that the relative change in the parameters during training
L21880: decreases as network width increases; for larger widths, the parameters start at smaller
L21881: values, change by a smaller proportion of those values, and converge in fewer steps.
L21882: 20.3.3
L21883: Connections between minima
L21884: Goodfellow et al. (2015b) examined the loss function along a straight line between two
L21885: minima that were found independently. They saw a pronounced increase in the loss be-
L21886: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L21889: <!-- page 423 -->
L21890: 20.3
L21891: Properties of loss functions
L21892: 409
L21893: Figure 20.5 Linear slices through loss function. a) A two-layer fully connected
L21894: ReLU network is trained on MNIST. The loss along a straight line starting at the
L21895: initial parameters (δ=0) and finishing at the trained parameters (δ=1) descends
L21896: monotonically. b) However, in this two-layer fully connected MaxOut network on
L21897: MNIST, there is an increase in the loss along a straight line between one solution
L21898: (δ=0) and another (δ=1). Adapted from Goodfellow et al. (2015b).
L21899: Figure 20.6 Subspace training.
L21900: A fully
L21901: connected network with two hidden lay-
L21902: ers, each with 200 units was trained on
L21903: MNIST. Parameters were initialized us-
L21904: ing a standard method but then con-
L21905: strained to lie within a random sub-
L21906: space. Performance reaches 90% of the
L21907: unconstrained level when this subspace is
L21908: 750D (termed the intrinsic dimension),
L21909: which is 0.4% of the original parameters.
L21910: Adapted from Li et al. (2018a).
L21911: tween them (figure 20.5b); good minima are not generally linearly connected. However,
L21912: Frankle et al. (2020) showed that this increase vanishes if the networks are identically
L21913: trained initially and later allowed to diverge by using different SGD noise and augmen-
L21914: tation. This suggests that the solution is constrained early in training and that some
L21915: families of minima are linearly connected.
L21916: Draxler et al. (2018) found minima with good (but different) performance on the
L21917: CIFAR-10 dataset. They then showed that it is possible to construct paths from one to
L21918: the other, where the loss function remains low along this path. They conclude that there
L21919: is a single connected manifold of low loss (figure 20.7). This seems to be increasingly
L21920: true as the width and depth of the network increase. Garipov et al. (2018) and Fort &
L21921: Jastrzębski (2019) present other schemes for connecting minima.
L21922: Draft: please send errata to udlbookmail@gmail.com.
L21925: <!-- page 424 -->
L21926: 410
L21927: 20
L21928: Why does deep learning work?
L21929: Figure 20.7 Connections between min-
L21930: ima.
L21931: A slice through the loss function
L21932: of DenseNet on CIFAR-10. Parameters
L21933: ϕ1 and ϕ2 are two independently discov-
L21934: ered minima.
L21935: Linear interpolation be-
L21936: tween these parameters reveals an en-
L21937: ergy barrier (dashed line). However, for
L21938: suﬀiciently deep and wide networks, it
L21939: is possible to find a curved path of low
L21940: energy between two minima (cyan line).
L21941: Adapted from Draxler et al. (2018).
L21942: Figure 20.8 Critical points vs. loss. a) In random Gaussian functions, the number
L21943: of directions in which the function curves down at points with zero gradient (i.e.,
L21944: saddle points) decreases with the height of the function, so minima all appear
L21945: at lower function values.
L21946: b) Dauphin et al. (2014) found critical points on a
L21947: neural network loss surface (i.e., points with zero gradient). They showed that
L21948: the proportion of negative eigenvalues (directions that point down) decreases with
L21949: the loss. The implication is that all minima (points with zero gradient where no
L21950: directions point down) have low losses. Adapted from Dauphin et al. (2014) and
L21951: Bahri et al. (2020).
L21952: Figure 20.9 Goldilocks zone.
L21953: The pro-
L21954: portion of eigenvalues of the Hessian that
L21955: are greater than zero (a measure of pos-
L21956: itive curvature/convexity) within a ran-
L21957: dom subspace of dimension Ds in a two-
L21958: layer fully connected network with ReLU
L21959: functions applied to MNIST as a func-
L21960: tion of the squared radius r2 of the pa-
L21961: rameters relative to Xavier initialization.
L21962: There is a pronounced region of positive
L21963: curvature known as the Goldilocks zone.
L21964: Adapted from Fort & Scherlis (2019).
L21965: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L21968: <!-- page 425 -->
L21969: 20.4
L21970: Factors that determine generalization
L21971: 411
L21972: Figure 20.10 Batch size to learning rate
L21973: ratio.
L21974: Generalization of two models
L21975: on the CIFAR-10 database depends on
L21976: the ratio of batch size to the learning
L21977: rate.
L21978: As the batch size increases, gen-
L21979: eralization decreases.
L21980: As the learning
L21981: rate increases, generalization increases.
L21982: Adapted from He et al. (2019).
L21983: 20.3.4
L21984: Curvature of loss surface
L21985: Random Gaussian functions (in which points are jointly distributed with covariance
L21986: given by a kernel function of their distance) have an interesting property: for points
L21987: where the gradient is zero, the fraction of directions where the function curves down
L21988: becomes smaller when these points occur at lower loss values (see Bahri et al., 2020).
L21989: Dauphin et al. (2014) searched for saddle points in a neural network loss function and
L21990: similarly found a correlation between the loss and the number of negative eigenvalues
L21991: (figure 20.8). Baldi & Hornik (1989) analyzed the error surface of a shallow network and
L21992: found that there were no local minima but only saddle points. These results suggest that
L21993: there are few or no bad local minima.
L21994: Fort & Scherlis (2019) measured the curvature at random points on a neural network
L21995: loss surface; they showed that the curvature of the surface is unusually positive when
L21996: the ℓ2 norm of the weights lies within a certain range (figure 20.9), which they term the
L21997: Goldilocks zone. He and Xavier initialization fall within this range.
L21998: 20.4
L21999: Factors that determine generalization
L22000: The last two sections considered factors that determine whether the network trains suc-
L22001: cessfully and what is known about neural network loss functions. This section considers
L22002: factors that determine how well the network generalizes. This complements the discus-
L22003: sion of regularization (chapter 9), which explicitly aims to encourage generalization.
L22004: 20.4.1
L22005: Training algorithms
L22006: Since deep networks are usually overparameterized, the details of the training process
L22007: determine which of the degenerate family of minima the algorithm converges to. Some
L22008: of these details reliably improve generalization.
L22009: LeCun et al. (2012) show that SGD generalizes better than full-batch gradient de-
L22010: scent. It has been argued that SGD generalizes better than Adam (e.g., Wilson et al.,
L22011: 2017; Keskar & Socher, 2017), but more recent studies suggest that there is little dif-
L22012: Draft: please send errata to udlbookmail@gmail.com.
L22015: <!-- page 426 -->
L22016: 412
L22017: 20
L22018: Why does deep learning work?
L22019: Figure 20.11 Flat vs. sharp minima.
L22020: Flat minima are expected to generalize
L22021: better. Small errors in estimating the pa-
L22022: rameters or in the alignment of the train
L22023: and test loss functions are less problem-
L22024: atic in flat regions. Adapted from Keskar
L22025: et al. (2017).
L22026: ference when the hyperparameter search is done carefully (Choi et al., 2019). Keskar
L22027: et al. (2017) show that deep nets generalize better with smaller batch-size when no other
L22028: form of regularization is used. It is also well-known that larger learning rates tend to
L22029: generalize better (e.g., figure 9.5). Jastrzębski et al. (2018), Goyal et al. (2018), and He
L22030: et al. (2019) argue that the batch size/learning rate ratio is important. He et al. (2019)
L22031: show a significant correlation between this ratio and the degree of generalization and
L22032: prove a generalization bound for neural networks, which has a positive correlation with
L22033: this ratio (figure 20.10).
L22034: These observations are aligned with the discovery that SGD implicitly adds regu-
L22035: larization terms to the loss function (section 9.2), and their magnitude depends on the
L22036: learning rate. The trajectory of the parameters is changed by this regularization, and
L22037: they converge to a part of the loss function that generalizes well.
L22038: 20.4.2
L22039: Flatness of minimum
L22040: There has been speculation dating at least to Hochreiter & Schmidhuber (1997a) that
L22041: flat minima in the loss function generalize better than sharp minima (figure 20.11).
L22042: Informally, if the minimum is flatter, then small errors in the estimated parameters are
L22043: less important. This can also be motivated from various theoretical viewpoints. For
L22044: example, minimum description length theory suggests models specified by fewer bits
L22045: generalize better (Rissanen, 1983). For wide minima, the precision needed to store the
L22046: weights is lower, so they should generalize better.
L22047: Flatness can be measured by (i) the size of the connected region around the minimum
L22048: for which training loss is similar (Hochreiter & Schmidhuber, 1997a), (ii) the second-
L22049: order curvature around the minimum (Chaudhari et al., 2019), or (iii) the maximum
L22050: loss within a neighborhood of the minimum (Keskar et al., 2017). However, caution is
L22051: required; estimated flatness can be affected by trivial reparameterizations of the network
L22052: due to the non-negative homogeneity property of the ReLU function (Dinh et al., 2017).
L22053: Nonetheless, Keskar et al. (2017) varied the batch size and learning rate and showed
L22054: that flatness correlates with generalization.
L22055: Izmailov et al. (2018) average together
L22056: weights from multiple points in a learning trajectory. This both results in flatter test
L22057: and training surfaces at the minimum and improves generalization. Other regularization
L22058: techniques can also be viewed through this lens. For example, averaging model outputs
L22059: (ensembling) may also make the test loss surface flatter. Kleinberg et al. (2018) showed
L22060: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L22063: <!-- page 427 -->
L22064: 20.4
L22065: Factors that determine generalization
L22066: 413
L22067: that large gradient variance during training helps avoid sharp regions. This may explain
L22068: why reducing the batch size and adding noise helps generalization.
L22069: The above studies consider flatness for a single model and training set. However,
L22070: sharpness alone is not a good criterion to predict generalization between datasets; when
L22071: the labels in the CIFAR dataset are randomized (making generalization impossible),
L22072: there is no commensurate sharpening of the minimum (Neyshabur et al., 2017).
L22073: 20.4.3
L22074: Architecture
L22075: The inductive bias of a network is determined by its architecture, and judicious choices
L22076: of model can drastically improve generalization. Chapter 10 introduced convolutional
L22077: networks, which are designed to process data on regular grids; they implicitly assume
L22078: that the input statistics are the same across the input, so they share parameters across
L22079: position. Similarly, transformers are suited for modeling data that is invariant to permu-
L22080: tations, and graph neural networks are suited to data represented on irregular graphs.
L22081: Matching the architecture to the properties of the data improves generalization over
L22082: generic, fully connected architectures (see figure 10.8).
L22083: 20.4.4
L22084: Norm of weights
L22085: Section 20.3.4 reviewed the finding of Fort & Scherlis (2019) that the curvature of the loss
L22086: surface is unusually positive when the ℓ2 norm of the weights lies within a certain range.
L22087: The same authors provided evidence that generalization is also good when the ℓ2 weight
L22088: norm falls within this Goldilocks zone (figure 20.12). This is perhaps unsurprising. The
L22089: norm of the weights is (indirectly) related to the Lipschitz constant of the model. If this
L22090: norm is too small, then the model will not be able to change fast enough to capture the
L22091: variation in the underlying function. If the norm is too large, then the model will be
L22092: unnecessarily variable between training points and will not interpolate smoothly.
L22093: This finding was used by Liu et al. (2023c) to explain the phenomenon of grokking
L22094: (Power et al., 2022), in which a sudden improvement in generalization can occur many
L22095: epochs after the training error is already zero (figure 20.13). It is proposed that grokking
L22096: occurs when the norm of the weights is initially too large; the training data fits well,
L22097: but the variation of the model between the data points is large. Over time, implicit or
L22098: explicit regularization decreases the norm of the weights until they reach the Goldilocks
L22099: zone, and generalization suddenly improves.
L22100: 20.4.5
L22101: Overparameterization
L22102: Figure 8.10 showed that generalization performance tends to improve with the degree
L22103: of overparameterization. When combined with the bias/variance trade-off curve, this
L22104: results in double descent. The putative explanation for this improvement is that the
L22105: network has more latitude to become smoother between the training data points when
L22106: Draft: please send errata to udlbookmail@gmail.com.
L22109: <!-- page 428 -->
L22110: 414
L22111: 20
L22112: Why does deep learning work?
L22113: Figure 20.12 Generalization on hyper-
L22114: spheres. A fully connected network with
L22115: two hidden layers, each with 200 units
L22116: (199,210 parameters) was trained on the
L22117: MNIST database.
L22118: The parameters are
L22119: initialized to a given ℓ2 norm and then
L22120: constrained to maintain this norm and
L22121: to lie in a subspace (vertical direction).
L22122: The network generalizes well in a small
L22123: range around the radius r defined by
L22124: Xavier initialization (cyan dotted line).
L22125: Adapted from Fort & Scherlis (2019).
L22126: Figure 20.13 Grokking.
L22127: When the pa-
L22128: rameters are initialized so that their
L22129: ℓ2 norm (radius) is considerably larger
L22130: than is specified by He initialization,
L22131: training takes longer (dashed lines), and
L22132: generalization takes much longer (solid
L22133: lines).
L22134: The lag in generalization is at-
L22135: tributed to the time taken for the norm
L22136: of the weights to decrease back to the
L22137: Goldilocks zone. Adapted from Liu et al.
L22138: (2023c).
L22139: the model is overparameterized.
L22140: It follows that the norm of the weights can also be used to explain double descent.
L22141: The norm of the weights increases when the number of parameters is similar to the
L22142: number of data points (as the model contorts itself to fit these points exactly), causing
L22143: generalization to reduce.
L22144: As the network becomes wider and the number of weights
L22145: increases, the overall norm of these weights decreases; the weights are initialized with a
L22146: variance that is inversely proportional to the width (i.e., with He or Glorot initialization),
L22147: and the weights need not change as drastically to fit the data well.
L22148: 20.4.6
L22149: Leaving the data manifold
L22150: Until this point, we have discussed how models generalize to new data that is drawn from
L22151: the same distribution as the training data. This is a reasonable assumption for experi-
L22152: mentation. However, systems deployed in the real world may encounter unexpected data
L22153: due to noise, changes in the data statistics over time, or deliberate attacks. Of course,
L22154: it is harder to make definite statements about this scenario, but D’Amour et al. (2020)
L22155: show that the variability of identical models trained with different seeds on corrupted
L22156: data can be enormous and unpredictable.
L22157: Goodfellow et al. (2015a) showed that deep learning models are susceptible to adver-
L22158: sarial attacks. Consider perturbing an image that is correctly classified by the network
L22159: Notebook 20.4
L22160: Adversarial attacks
L22161: as “dog” so that the probability of the correct class decreases as fast as possible un-
L22162: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L22165: <!-- page 429 -->
L22166: 20.5
L22167: Do we need so many parameters?
L22168: 415
L22169: Figure 20.14 Adversarial examples.
L22170: In
L22171: each case, the left image is correctly clas-
L22172: sified by AlexNet.
L22173: By considering the
L22174: gradients of the network output with re-
L22175: spect to the input, it’s possible to find
L22176: a small perturbation (center, magnified
L22177: by 10 for visibility) that, when added
L22178: to the original image (right), causes the
L22179: network to misclassify it as an ostrich.
L22180: This is despite the fact that the original
L22181: and perturbed images are almost indis-
L22182: tinguishable to humans. Adapted from
L22183: Szegedy et al. (2014).
L22184: til the class flips. If this image is now classified as an airplane, you might expect the
L22185: perturbed image to look like a cross between a dog and an airplane. However, in prac-
L22186: tice, the perturbed image looks almost indistinguishable from the original dog image
L22187: (figure 20.14).
L22188: The conclusion is that there are positions that are close to but not on the data man-
L22189: ifold that are misclassified. These are known as adversarial examples. Their existence
L22190: is surprising; how can such a small change to the network input make such a drastic
L22191: change to the output? The best current explanation is that adversarial examples aren’t
L22192: due to a lack of robustness to data from outside the training data manifold. Instead,
L22193: they are exploiting a source of information that is in the training distribution but which
L22194: has a small norm and is imperceptible to humans (Ilyas et al., 2019).
L22195: 20.5
L22196: Do we need so many parameters?
L22197: Section 20.4 argued that models generalize better when over-parameterized.
L22198: Indeed,
L22199: there are almost no examples of state-of-the-art test performance on complex datasets
L22200: where the model has significantly fewer parameters than there were training data points.
L22201: However, section 20.2 reviewed evidence that training becomes easier as the number
L22202: of parameters increases. Hence, it’s not clear if some fundamental property of smaller
L22203: models prevents them from performing as well or whether the training algorithms can’t
L22204: find good solutions for small models. Pruning and distilling are two methods for reducing
L22205: the size of trained models. This section examines whether these methods can produce
L22206: underparameterized models which retain the performance of overparameterized ones.
L22207: 20.5.1
L22208: Pruning
L22209: Pruning trained models reduces their size and hence storage requirements (figure 20.15).
L22210: The simplest approach is to remove individual weights. This can be done based on the
L22211: second derivatives of the loss function (LeCun et al., 1990; Hassibi & Stork, 1993) or
L22212: Draft: please send errata to udlbookmail@gmail.com.
L22215: <!-- page 430 -->
L22216: 416
L22217: 20
L22218: Why does deep learning work?
L22219: Figure 20.15 Pruning neural networks. The goal is to remove as many weights
L22220: as possible without decreasing performance. This is often done just based on the
L22221: magnitude of the weights. Typically, the network is fine-tuned after pruning. a)
L22222: Example fully connected network. b) After pruning.
L22223: (more practically) based on the absolute value of the weight (Han et al., 2016, 2015).
L22224: Other work prunes hidden units (Zhou et al., 2016a; Alvarez & Salzmann, 2016), channels
L22225: in convolutional networks (Li et al., 2017a; Luo et al., 2017b; He et al., 2017; Liu et al.,
L22226: 2019a), or entire layers in residual nets (Huang & Wang, 2018). Often, the network is
L22227: fine-tuned after pruning, and sometimes this process is repeated.
L22228: For example, Han et al. (2016) maintained good performance for the VGG network
L22229: on ImageNet classification when 8% of the weights were retained.
L22230: This significantly
L22231: decreases the model size but isn’t enough to show that overparameterization is not re-
L22232: quired; the VGG network has ∼100 times as many parameters as there are ImageNet
L22233: training data (disregarding augmentation).
L22234: Pruning is a form of architecture search. In their work on lottery tickets (see sec-
L22235: tion 20.2.7), Frankle & Carbin (2019) (i) trained a network, (ii) pruned the weights with
L22236: the smallest magnitudes, and (iii) retrained the remaining network from the same ini-
L22237: tial weights. By iterating this procedure, they reduced the size of the VGG-19 network
L22238: (originally 138 million parameters) by 98.5% on the CIFAR-10 database (60,000 exam-
L22239: ples) while maintaining good performance. For ResNet-50 (25.6 million parameters),
L22240: they reduced the parameters by 80% without reducing the performance on ImageNet
L22241: (1.28 million examples). These demonstrations are impressive but (disregarding data
L22242: augmentation) these networks are still over-parameterized after pruning.
L22243: 20.5.2
L22244: Knowledge distillation
L22245: The parameters can also be reduced by training a smaller network (the student) to
L22246: replicate the performance of a larger one (the teacher). This is known as knowledge
L22247: distillation and dates back to at least Buciluǎ et al. (2006). Hinton et al. (2015) showed
L22248: that the pattern of information across the output classes is important and trained a
L22249: smaller network to approximate the pre-softmax logits of the larger one (figure 20.16).
L22250: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L22253: <!-- page 431 -->
L22254: 20.5
L22255: Do we need so many parameters?
L22256: 417
L22257: Figure 20.16 Knowledge distillation. a) A teacher network for image classification
L22258: is trained as usual, using a multiclass cross-entropy classification loss. b) A smaller
L22259: student network is trained with the same loss, plus also a distillation loss that
L22260: encourages the pre-softmax activations to be the same as for the teacher.
L22261: Zagoruyko & Komodakis (2017) further encouraged the spatial maps of the activa-
L22262: tions of the student network to be similar to the teacher network at various points. They
L22263: use this attention transfer method to approximate the performance of a 34-layer residual
L22264: network (∼63 million parameters) with an 18-layer residual network (∼11 million param-
L22265: eters) on the ImageNet classification task. However, this is still larger than the number
L22266: of training examples (∼1 million images). Modern methods (e.g. Chen et al., 2021a) can
L22267: improve on this result, but distillation has not yet provided convincing evidence that
L22268: under-parameterized models can perform well.
L22269: 20.5.3
L22270: Discussion
L22271: Current evidence suggests that overparameterization is needed for generalization — at
L22272: least for the size and complexity of datasets that are currently used.
L22273: There are no
L22274: demonstrations of state-of-the-art performance on complex datasets where there are sig-
L22275: nificantly fewer parameters than training examples. Attempts to reduce model size by
L22276: pruning or distilling trained networks have not changed this picture.
L22277: Moreover, recent theory shows that there is a trade-off between the model’s Lipschitz
L22278: constant and overparameterization; Bubeck & Sellke (2021) proved that in D dimensions,
L22279: Draft: please send errata to udlbookmail@gmail.com.
L22282: <!-- page 432 -->
L22283: 418
L22284: 20
L22285: Why does deep learning work?
L22286: smooth interpolation requires D times more parameters than mere interpolation. They
L22287: argue that current models for large datasets (e.g., ImageNet) aren’t overparameterized
L22288: enough; increasing model capacity further may be key to improving performance.
L22289: 20.6
L22290: Do networks have to be deep?
L22291: Chapter 3 discussed the universal approximation theorem.
L22292: This states that shallow
L22293: neural networks can approximate any function to arbitrary accuracy given enough hidden
L22294: units. This raises the obvious question of whether networks need to be deep.
L22295: First, let’s consider the evidence that depth is required. Historically, there has been
L22296: a definite correlation between performance and depth. For example, performance on the
L22297: ImageNet benchmark initially improved as a function of network depth until training
L22298: became diﬀicult.
L22299: Subsequently, residual connections and batch normalization (chap-
L22300: ter 11) allowed training of deeper networks with commensurate gains in performance.
L22301: At the time of writing, almost all state-of-the-art applications, including image classifica-
L22302: tion (e.g., the vision transformer), text generation (e.g., GPT3), and text-guided image
L22303: synthesis (e.g., DALL·E-2), are based on deep networks with tens or hundreds of layers.
L22304: Despite this trend, there have been efforts to use shallower networks. Zagoruyko &
L22305: Komodakis (2016) constructed shallower but wider residual neural networks and achieved
L22306: similar performance to ResNet. More recently, Goyal et al. (2021) constructed a network
L22307: that used parallel convolutional channels and achieved performance similar to deeper net-
L22308: works with only 12 layers. Furthermore, Veit et al. (2016) showed that it is predominantly
L22309: shorter paths of 5–17 layers that drive performance in residual networks.
L22310: Nonetheless, the balance of evidence suggests that depth is critical; even the shallow-
L22311: est networks with good image classification performance require >10 layers. However,
L22312: there is no definitive explanation for why. Three possible explanations are that (i) deep
L22313: networks can represent more complex functions than shallow ones, (ii) deep networks
L22314: are easier to train, and (iii) deep networks impose better inductive biases.
L22315: 20.6.1
L22316: Complexity of modeled function
L22317: Chapter 4 showed that deep networks make functions with many more linear regions than
L22318: shallow ones for the same parameter count. We also saw that “pathological” functions
L22319: have been identified that require exponentially more hidden units to model with a shallow
L22320: network than a deep one (e.g., Eldan & Shamir, 2016; Telgarsky, 2016). Indeed Liang &
L22321: Srikant (2016) found quite general families of functions that are more eﬀiciently modeled
L22322: by deep networks.
L22323: However, Nye & Saxe (2018) found that some of these functions
L22324: cannot easily be fit by deep networks in practice. Moreover, there is little evidence that
L22325: the real-world functions that we are approximating have these pathological properties.
L22326: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L22329: <!-- page 433 -->
L22330: 20.7
L22331: Summary
L22332: 419
L22333: 20.6.2
L22334: Tractability of training
L22335: An alternative explanation is that shallow networks with a practical number of hidden
L22336: units could support state-of-the-art performance, but it is just diﬀicult to find a good
L22337: solution that both fits the training data well and interpolates sensibly.
L22338: One way to show this is to distill successful deep networks into shallower (but wider)
L22339: student models and see if performance can be maintained.
L22340: Urban et al. (2017) dis-
L22341: tilled an ensemble of 16 convolutional networks for image classification on the CIFAR-10
L22342: dataset into student models of varying depths. They found that shallow networks could
L22343: not replicate the performance of the deeper teacher and that the student performance
L22344: increased as a function of depth for a constant parameter budget.
L22345: 20.6.3
L22346: Inductive bias
L22347: Most current models rely on convolutional blocks or transformers. These networks share
L22348: parameters for local regions of the input data, and often they gradually integrate this
L22349: information across the whole input.
L22350: These constraints mean that the functions that
L22351: these networks can represent are not general. One explanation for the supremacy of
L22352: deep networks, then, is that these constraints have a good inductive bias and that it is
L22353: diﬀicult to induce shallow networks to obey these constraints.
L22354: Multi-layer convolutional architectures seem to be inherently helpful, even without
L22355: training. Ulyanov et al. (2018) demonstrated that the structure of an untrained CNN
L22356: can be used as a prior in low-level tasks such as denoising and super-resolution. Frankle
L22357: et al. (2021) achieved good performance in image classification by initializing the kernels
L22358: randomly, fixing their values, and just training the batch normalization offset and scaling
L22359: factors. Zhang et al. (2017a) show that features from randomly initialized convolutional
L22360: filters can support subsequent image classification using a kernel model.
L22361: Additional evidence that convolutional networks provide a useful inductive bias comes
L22362: from Urban et al. (2017), who attempted to distill convolutional networks into shal-
L22363: lower networks. They found that distilling into convolutional architectures systemat-
L22364: ically worked better than distilling into fully connected networks. This suggests that
L22365: the convolutional architecture has some inherent advantages. Since the sequential local
L22366: processing of convolutional networks cannot easily be replicated by shallower networks,
L22367: this argues that depth is indeed important.
L22368: 20.7
L22369: Summary
L22370: This chapter has made the case that the success of deep learning is surprising.
L22371: We
L22372: discussed the challenges of optimizing high-dimensional loss functions and argued that
L22373: overparameterization and the choice of activation function are the two most important
L22374: factors that make this tractable in deep networks. We saw that, during training, the
L22375: parameters move through a low-dimensional subspace to one of a family of connected
L22376: Draft: please send errata to udlbookmail@gmail.com.
L22379: <!-- page 434 -->
L22380: 420
L22381: 20
L22382: Why does deep learning work?
L22383: global minima and that local minima are not apparent.
L22384: Generalization of neural networks also improves with overparameterization, although
L22385: other factors, such as the flatness of the minimum and the inductive bias of the architec-
L22386: ture, are also important. It appears that both a large number of parameters and multiple
L22387: network layers are required for good generalization, although we do not yet know why.
L22388: Many questions remain unanswered. We do not currently have any prescriptive theory
L22389: that will allow us to predict the circumstances in which training and generalization will
L22390: succeed or fail. We do not know the limits of learning in deep networks or whether
L22391: much more eﬀicient models are possible. We do not know if there are parameters that
L22392: would generalize better within the same model. The study of deep learning is still driven
L22393: by empirical demonstrations. These are undeniably impressive, but they are not yet
L22394: matched by our understanding of deep learning mechanisms.
L22395: Problems
L22396: Problem 20.1 Consider the ImageNet image classification task in which the input images contain
L22397: 224×224×3 RGB values. Consider coarsely quantizing these inputs into ten bins per RGB value
L22398: and training with ∼107 training examples. How many possible inputs are there per training
L22399: data point?
L22400: Problem 20.2 Consider figure 20.1. Why do you think that the algorithm fits the data faster
L22401: when the pixels are randomized relative to when the labels are randomized?
L22402: Problem 20.3 Figure 20.2 shows a non-stochastic fitting process with a fixed learning rate
L22403: successfully fitting random data. Does this imply that the loss function has no local minima?
L22404: Does this imply that the function is convex? Justify your answer and give a counter-example if
L22405: you think either statement is false.
L22406: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L22409: <!-- page 435 -->
L22410: Chapter 21
L22411: Deep learning and ethics
L22412: This chapter was written by Travis LaCroix and Simon J.D. Prince.
L22413: AI is poised to change society for better or worse. These technologies have enormous
L22414: potential for social good (Taddeo & Floridi, 2018; Tomašev et al., 2020), including im-
L22415: portant roles in healthcare (Rajpurkar et al., 2022) and the fight against climate change
L22416: (Rolnick et al., 2023). However, they also have the potential for misuse and unintended
L22417: harm. This has led to the emergence of the field of AI ethics.
L22418: The modern era of deep learning started in 2012 with AlexNet, but sustained interest
L22419: in AI ethics did not follow immediately.
L22420: Indeed, a workshop on fairness in machine
L22421: learning was rejected from NeurIPS 2013 for want of material. It wasn’t until 2016 that
L22422: AI Ethics had its “AlexNet” moment, with ProPublica’s exposé on bias in the COMPAS
L22423: recidivism-prediction model (Angwin et al., 2016) and Cathy O’Neil’s book Weapons
L22424: of Math Destruction (O’Neil, 2016). Interest has swelled ever since; submissions to the
L22425: Conference on Fairness, Accountability, and Transparency (FAccT) have increased nearly
L22426: ten-fold in the five years since its inception in 2018.
L22427: In parallel, many organizations have proposed policy recommendations for responsible
L22428: AI. Jobin et al. (2019) found 84 documents containing AI ethics principles, with 88%
L22429: released since 2016. This proliferation of non-legislative policy agreements, which depend
L22430: on voluntary, non-binding cooperation, calls into question their eﬀicacy (McNamara
L22431: et al., 2018; Hagendorff, 2020; LaCroix & Mohseni, 2022). In short, AI Ethics is in its
L22432: infancy, and ethical considerations are often reactive rather than proactive.
L22433: This chapter considers potential harms arising from the design and use of AI systems.
L22434: These include algorithmic bias, lack of explainability, data privacy violations, militariza-
L22435: tion, fraud, and environmental concerns. The aim is not to provide advice on being more
L22436: ethical. Instead, the goal is to express ideas and start conversations in key areas that
L22437: have received attention in philosophy, political science, and the broader social sciences.
L22438: 21.1
L22439: Value alignment
L22440: When we design AI systems, we wish to ensure that their “values” (objectives) are aligned
L22441: with those of humanity. This is sometimes called the value alignment problem (Russell,
L22442: Problem 21.1
L22443: Draft: please send errata to udlbookmail@gmail.com.
