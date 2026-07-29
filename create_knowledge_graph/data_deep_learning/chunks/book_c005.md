L02408: <!-- page 58 -->
L02409: 44
L02410: 4
L02411: Deep neural networks
L02412: Figure 4.2 Composing neural networks with a 2D input. a) The first network
L02413: (from figure 3.8) has three hidden units and takes two inputs x1 and x2 and returns
L02414: a scalar output y. This is passed into a second network with two hidden units to
L02415: produce y′. b) The first network produces a function consisting of seven linear
L02416: regions, one of which is flat. c) The second network defines a function comprising
L02417: two linear regions in y ∈[−1, 1]. d) When these networks are composed, each of
L02418: the six non-flat regions from the first network is divided into two new regions by
L02419: the second network to create a total of 13 linear regions.
L02420: Figure 4.3 Deep networks as folding input space. a) One way to think about
L02421: the first network from figure 4.1 is that it “folds” the input space back on top
L02422: of itself. b) The second network applies its function to the folded space. c) The
L02423: final output is revealed by “unfolding” again.
L02424: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L02427: <!-- page 59 -->
L02428: 4.3
L02429: Deep neural networks
L02430: 45
L02431: Figure 4.4 Neural network with one input, one output, and two hidden layers,
L02432: each containing three hidden units.
L02433: where ψ10 = θ′
L02434: 10 + θ′
L02435: 11ϕ0, ψ11 = θ′
L02436: 11ϕ1, ψ12 = θ′
L02437: 11ϕ2 and so on. The result is a network
L02438: with two hidden layers (figure 4.4).
L02439: It follows that a network with two layers can represent the family of functions created
L02440: by passing the output of one single-layer network into another. In fact, it represents a
L02441: broader family because in equation 4.6, the nine slope parameters ψ11, ψ21, . . . , ψ33 can
L02442: take arbitrary values, whereas, in equation 4.5, these parameters are constrained to be
L02443: the outer product [θ′
L02444: 11, θ′
L02445: 21, θ′
L02446: 31]T [ϕ1, ϕ2, ϕ3].
L02447: 4.3
L02448: Deep neural networks
L02449: In the previous section, we showed that composing two shallow networks yields a special
L02450: case of a deep network with two hidden layers. Now we consider the general case of a
L02451: deep network with two hidden layers, each containing three hidden units (figure 4.4).
L02452: The first layer is defined by:
L02453: h1
L02454: =
L02455: a[θ10 + θ11x]
L02456: h2
L02457: =
L02458: a[θ20 + θ21x]
L02459: h3
L02460: =
L02461: a[θ30 + θ31x],
L02462: (4.7)
L02463: the second layer by:
L02464: h′
L02465: 1
L02466: =
L02467: a[ψ10 + ψ11h1 + ψ12h2 + ψ13h3]
L02468: h′
L02469: 2
L02470: =
L02471: a[ψ20 + ψ21h1 + ψ22h2 + ψ23h3]
L02472: h′
L02473: 3
L02474: =
L02475: a[ψ30 + ψ31h1 + ψ32h2 + ψ33h3],
L02476: (4.8)
L02477: and the output by:
L02478: y′ = ϕ′
L02479: 0 + ϕ′
L02480: 1h′
L02481: 1 + ϕ′
L02482: 2h′
L02483: 2 + ϕ′
L02484: 3h′
L02485: 3.
L02486: (4.9)
L02487: Draft: please send errata to udlbookmail@gmail.com.
L02490: <!-- page 60 -->
L02491: 46
L02492: 4
L02493: Deep neural networks
L02494: Considering these equations leads to another way to think about how the network con-
L02495: Notebook 4.2
L02496: Clipping
L02497: functions
L02498: structs an increasingly complicated function (figure 4.5):
L02499: 1. The three hidden units h1, h2, and h3 in the first layer are computed as usual by
L02500: forming linear functions of the input and passing these through ReLU activation
L02501: functions (equation 4.7).
L02502: 2. The pre-activations at the second layer are computed by taking three new linear
L02503: functions of these hidden units (arguments of the activation functions in equa-
L02504: tion 4.8). At this point, we effectively have a shallow network with three outputs;
L02505: we have computed three piecewise linear functions with the “joints” between linear
L02506: regions in the same places (see figure 3.6).
L02507: 3. At the second hidden layer, another ReLU function a[•] is applied to each function
L02508: (equation 4.8), which clips them and adds new “joints” to each.
L02509: 4. The final output is a linear combination of these hidden units (equation 4.9).
L02510: In conclusion, we can either think of each layer as “folding” the input space or as cre-
L02511: ating new functions, which are clipped (creating new regions) and then recombined. The
L02512: former view emphasizes the dependencies in the output function but not how clipping
L02513: creates new joints, and the latter has the opposite emphasis. Ultimately, both descrip-
L02514: tions provide only partial insight into how deep neural networks operate. Regardless,
L02515: it’s important not to lose sight of the fact that this is still merely an equation relating
L02516: input x to output y′. Indeed, we can combine equations 4.7–4.9 to get one expression:
L02517: y′
L02518: =
L02519: ϕ′
L02520: 0 + ϕ′
L02521: 1a [ψ10 + ψ11a[θ10 + θ11x] + ψ12a[θ20 + θ21x] + ψ13a[θ30 + θ31x]]
L02522: +ϕ′
L02523: 2a[ψ20 + ψ21a[θ10 + θ11x] + ψ22a[θ20 + θ21x] + ψ23a[θ30 + θ31x]]
L02524: +ϕ′
L02525: 3a[ψ30 + ψ31a[θ10 + θ11x] + ψ32a[θ20 + θ21x] + ψ33a[θ30 + θ31x]],
L02526: (4.10)
L02527: although this is admittedly rather diﬀicult to understand.
L02528: 4.3.1
L02529: Hyperparameters
L02530: We can extend the deep network construction to more than two hidden layers; modern
L02531: networks might have more than a hundred layers with thousands of hidden units at each
L02532: layer. The number of hidden units in each layer is referred to as the width of the network,
L02533: and the number of hidden layers as the depth. The total number of hidden units is a
L02534: measure of the network’s capacity.
L02535: We denote the number of layers as K and the number of hidden units in each layer
L02536: as D1, D2, . . . , DK. These are examples of hyperparameters. They are quantities chosen
L02537: Problem 4.2
L02538: before we learn the model parameters (i.e., the slope and intercept terms). For fixed
L02539: hyperparameters (e.g., K = 2 layers with Dk = 3 hidden units in each), the model
L02540: describes a family of functions, and the parameters determine the particular function.
L02541: Hence, when we also consider the hyperparameters, we can think of neural networks as
L02542: representing a family of families of functions relating input to output.
L02543: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L02546: <!-- page 61 -->
L02547: 4.3
L02548: Deep neural networks
L02549: 47
L02550: Figure 4.5 Computation for the deep network in figure 4.4.
L02551: a–c) The inputs
L02552: to the second hidden layer (i.e., the pre-activations) are three piecewise linear
L02553: functions where the “joints” between the linear regions are at the same places
L02554: (see figure 3.6).
L02555: d–f) Each piecewise linear function is clipped to zero by the
L02556: ReLU activation function. g–i) These clipped functions are then weighted with
L02557: parameters ϕ′
L02558: 1, ϕ′
L02559: 2, and ϕ′
L02560: 3, respectively.
L02561: j) Finally, the clipped and weighted
L02562: functions are summed and an offset ϕ′
L02563: 0 that controls the overall height is added.
L02564: (Interactive figure)
L02565: Draft: please send errata to udlbookmail@gmail.com.
L02568: <!-- page 62 -->
L02569: 48
L02570: 4
L02571: Deep neural networks
L02572: Figure 4.6 Matrix notation for network with Di = 3-dimensional input x, Do = 2-
L02573: dimensional output y, and K = 3 hidden layers h1, h2, and h3 of dimensions
L02574: D1 = 4, D2 = 2, and D3 = 3 respectively. The weights are stored in matrices Ωk
L02575: that multiply the activations from the preceding layer to create the pre-activations
L02576: at the subsequent layer. For example, the weight matrix Ω1 that computes the
L02577: pre-activations at h2 from the activations at h1 has dimension 2×4. It is applied
L02578: to the four hidden units in layer one and creates the inputs to the two hidden
L02579: units at layer two. The biases are stored in vectors βk and have the dimension
L02580: of the layer into which they feed. For example, the bias vector β2 is length three
L02581: because layer h3 contains three hidden units.
L02582: 4.4
L02583: Matrix notation
L02584: We have seen that a deep neural network consists of linear transformations alternating
L02585: Appendix B.3
L02586: Matrices
L02587: with activation functions. We could equivalently describe equations 4.7–4.9 in matrix
L02588: notation as:
L02589: 
L02590: 
L02591: h1
L02592: h2
L02593: h3
L02594: 
L02595: = a
L02596: 
L02597: 
L02598: 
L02599: 
L02600: θ10
L02601: θ20
L02602: θ30
L02603: 
L02604: +
L02605: 
L02606: 
L02607: θ11
L02608: θ21
L02609: θ31
L02610: 
L02611: x
L02612: 
L02613: ,
L02614: (4.11)
L02615: 
L02616: 
L02617: h′
L02618: 1
L02619: h′
L02620: 2
L02621: h′
L02622: 3
L02623: 
L02624: = a
L02625: 
L02626: 
L02627: 
L02628: 
L02629: ψ10
L02630: ψ20
L02631: ψ30
L02632: 
L02633: +
L02634: 
L02635: 
L02636: ψ11
L02637: ψ12
L02638: ψ13
L02639: ψ21
L02640: ψ22
L02641: ψ23
L02642: ψ31
L02643: ψ32
L02644: ψ33
L02645: 
L02646: 
L02647: 
L02648: 
L02649: h1
L02650: h2
L02651: h3
L02652: 
L02653: 
L02654: 
L02655: ,
L02656: (4.12)
L02657: and
L02658: y′ = ϕ′
L02659: 0 +
L02660: ϕ′
L02661: 1
L02662: ϕ′
L02663: 2
L02664: ϕ′
L02665: 3
L02666: 
L02667: 
L02668: 
L02669: h′
L02670: 1
L02671: h′
L02672: 2
L02673: h′
L02674: 3
L02675: 
L02676: ,
L02677: (4.13)
L02678: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L02681: <!-- page 63 -->
L02682: 4.5
L02683: Shallow vs. deep neural networks
L02684: 49
L02685: or even more compactly in matrix notation as:
L02686: h
L02687: =
L02688: a [θ0 + θx]
L02689: h′
L02690: =
L02691: a [ψ0 + Ψh]
L02692: y′
L02693: =
L02694: ϕ′
L02695: 0 + ϕ′h′,
L02696: (4.14)
L02697: where, in each case, the function a[•] applies the activation function separately to every
L02698: element of its vector input.
L02699: 4.4.1
L02700: General formulation
L02701: This notation becomes cumbersome for networks with many layers. Hence, from now
L02702: on, we will describe the vector of hidden units at layer k as hk, the vector of biases
L02703: (intercepts) that contribute to hidden layer k+1 as βk, and the weights (slopes) that
L02704: are applied to the kth layer and contribute to the (k+1)th layer as Ωk. A general deep
L02705: network y = f[x, ϕ] with K layers can now be written as:
L02706: h1
L02707: =
L02708: a[β0 + Ω0x]
L02709: h2
L02710: =
L02711: a[β1 + Ω1h1]
L02712: h3
L02713: =
L02714: a[β2 + Ω2h2]
L02715: ...
L02716: hK
L02717: =
L02718: a[βK−1 + ΩK−1hK−1]
L02719: y
L02720: =
L02721: βK + ΩKhK.
L02722: (4.15)
L02723: The parameters ϕ of this model comprise all of these weight matrices and bias vectors
L02724: ϕ = {βk, Ωk}K
L02725: k=0.
L02726: If the kth layer has Dk hidden units, then the bias vector βk−1 will be of size Dk.
L02727: The last bias vector βK has the size Do of the output. The first weight matrix Ω0 has
L02728: Notebook 4.3
L02729: Deep networks
L02730: size D1 × Di where Di is the size of the input. The last weight matrix ΩK is Do × DK,
L02731: and the remaining matrices Ωk are Dk+1 × Dk (figure 4.6).
L02732: We can equivalently write the network as a single function:
L02733: Problems 4.3–4.6
L02734: y = βK + ΩKa
L02735: 
L02736: βK−1 + ΩK−1a [. . . β2 + Ω2a [β1 + Ω1a [β0 + Ω0x]] . . .]
L02737: 
L02738: .
L02739: (4.16)
L02740: 4.5
L02741: Shallow vs. deep neural networks
L02742: Chapter 3 discussed shallow networks (with a single hidden layer), and here we have
L02743: described deep networks (with multiple hidden layers). We now compare these models.
L02744: Draft: please send errata to udlbookmail@gmail.com.
L02747: <!-- page 64 -->
L02748: 50
L02749: 4
L02750: Deep neural networks
L02751: 4.5.1
L02752: Ability to approximate different functions
L02753: In section 3.2, we argued that shallow neural networks with enough capacity (hidden
L02754: units) could model any continuous function arbitrarily closely. In this chapter, we saw
L02755: that a deep network with two hidden layers could represent the composition of two
L02756: shallow networks. If the second of these networks computes the identity function, then
L02757: this deep network replicates a single shallow network. Hence, it can also approximate
L02758: any continuous function arbitrarily closely given suﬀicient capacity.
L02759: Problem 4.7
L02760: 4.5.2
L02761: Number of linear regions per parameter
L02762: A shallow network with one input, one output, and D > 2 hidden units can create up
L02763: to D + 1 linear regions and is defined by 3D + 1 parameters. A deep network with one
L02764: Problems 4.8–4.11
L02765: input, one output, and K layers of D > 2 hidden units can create a function with up to
L02766: (D + 1)K linear regions using 3D + 1 + (K −1)D(D + 1) parameters.
L02767: Figure 4.7a shows how the maximum number of linear regions increases as a function
L02768: of the number of parameters for networks mapping scalar input x to scalar output y.
L02769: Deep neural networks create much more complex functions for a fixed parameter budget.
L02770: This effect is magnified as the number of input dimensions Di increases (figure 4.7b),
L02771: although computing the maximum number of regions is less straightforward.
L02772: This seems attractive, but the flexibility of the functions is still limited by the number
L02773: of parameters. Deep networks can create extremely large numbers of linear regions, but
L02774: these contain complex dependencies and symmetries. We saw some of these when we
L02775: considered deep networks as “folding” the input space (figure 4.3). So, it’s not clear that
L02776: the greater number of regions is an advantage unless (i) there are similar symmetries in
L02777: the real-world functions that we wish to approximate or (ii) we have reason to believe
L02778: that the mapping from input to output really does involve a composition of simpler
L02779: functions.
L02780: 4.5.3
L02781: Depth eﬀiciency
L02782: Both deep and shallow networks can model arbitrary functions, but some functions
L02783: can be approximated much more eﬀiciently with deep networks. Functions have been
L02784: identified that require a shallow network with exponentially more hidden units to achieve
L02785: an equivalent approximation to that of a deep network. This phenomenon is referred to
L02786: as the depth eﬀiciency of neural networks. This property is also attractive, but it’s not
L02787: clear that the real-world functions that we want to approximate fall into this category.
L02788: 4.5.4
L02789: Large, structured inputs
L02790: We have discussed fully connected networks where every element of each layer contributes
L02791: to every element of the subsequent one.
L02792: However, these are not practical for large,
L02793: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L02796: <!-- page 65 -->
L02797: 4.5
L02798: Shallow vs. deep neural networks
L02799: 51
L02800: Figure 4.7 The maximum number of linear regions for neural networks increases
L02801: rapidly with the network depth. a) Network with Di = 1 input. Each curve rep-
L02802: resents a fixed number of hidden layers K, as we vary the number of hidden units
L02803: D per layer. For a fixed parameter budget (horizontal position), deeper networks
L02804: produce more linear regions than shallower ones. A network with K = 5 layers
L02805: and D = 10 hidden units per layer has 471 parameters (highlighted point) and
L02806: can produce 161,051 regions. b) Network with Di = 10 inputs. Each subsequent
L02807: point along a curve represents ten hidden units. Here, a model with K = 5 layers
L02808: and D = 50 hidden units per layer has 10,801 parameters (highlighted point) and
L02809: can create more than 1040 linear regions.
L02810: structured inputs like images, where the input might comprise ∼106 pixels. The number
L02811: of parameters would be prohibitive, and moreover, we want different parts of the image
L02812: to be processed similarly; there is no point in independently learning to recognize the
L02813: same object at every possible position in the image.
L02814: The solution is to process local image regions in parallel and then gradually integrate
L02815: information from increasingly large regions. This kind of local-to-global processing is
L02816: diﬀicult to specify without using multiple layers (see chapter 10).
L02817: 4.5.5
L02818: Training and generalization
L02819: A further possible advantage of deep networks over shallow networks is their ease of fit-
L02820: ting; it is usually easier to train moderately deep networks than to train shallow ones (see
L02821: figure 20.2). It may be that over-parameterized deep models (i.e., those with more pa-
L02822: rameters than training examples) have a large family of roughly equivalent solutions that
L02823: are easy to find. However, as we add more hidden layers, training becomes more diﬀicult
L02824: again. Many methods have been developed to mitigate this problem (see chapter 11).
L02825: Deep neural networks also seem to generalize to new data better than shallow ones.
L02826: In practice, the best results for most tasks have been achieved using networks with tens
L02827: or hundreds of layers. Neither of these phenomena are well understood, and we return
L02828: to them in chapter 20.
L02829: Draft: please send errata to udlbookmail@gmail.com.
L02832: <!-- page 66 -->
L02833: 52
L02834: 4
L02835: Deep neural networks
L02836: 4.6
L02837: Summary
L02838: In this chapter, we first considered what happens when we compose two shallow networks.
L02839: We argued that the first network “folds” the input space, and the second network then
L02840: applies a piecewise linear function. The effects of the second network are duplicated
L02841: where the input space is folded onto itself.
L02842: We then showed that this composition of shallow networks is a special case of a deep
L02843: network with two layers. We interpreted the ReLU functions in each layer as clipping
L02844: the input functions in multiple places and creating more “joints” in the output function.
L02845: We introduced the idea of hyperparameters, which for the networks we’ve seen so far,
L02846: comprise the number of hidden layers and the number of hidden units in each.
L02847: Finally, we compared shallow and deep networks. We saw that (i) both networks
L02848: can approximate any function given enough capacity, (ii) deep networks produce many
L02849: more linear regions per parameter, (iii) some functions can be approximated much more
L02850: eﬀiciently by deep networks, (iv) large, structured inputs like images are best processed
L02851: in multiple stages, and (v) in practice, the best results for most tasks are achieved using
L02852: deep networks with many layers.
L02853: Now that we understand deep and shallow network models, we turn our attention to
L02854: training them. In the next chapter, we discuss loss functions. For any given parameter
L02855: values ϕ, the loss function returns a single number that indicates the mismatch between
L02856: the model outputs and the ground truth predictions for a training dataset. In chapters 6
L02857: and 7, we deal with the training process itself, in which we seek the parameter values
L02858: that minimize this loss.
L02859: Notes
L02860: Deep learning:
L02861: It has long been understood that it is possible to build more complex functions
L02862: by composing shallow neural networks or developing networks with more than one hidden layer.
L02863: Indeed, the term “deep learning” was first used by Dechter (1986). However, interest was limited
L02864: due to practical concerns; it was not possible to train such networks well. The modern era of
L02865: deep learning was kick-started by startling improvements in image classification reported by
L02866: Krizhevsky et al. (2012).
L02867: This sudden progress was arguably due to the confluence of four
L02868: factors: larger training datasets, improved processing power for training, the use of the ReLU
L02869: activation function, and the use of stochastic gradient descent (see chapter 6). LeCun et al.
L02870: (2015) present an overview of early advances in the modern era of deep learning.
L02871: Number of linear regions:
L02872: For deep networks using a total of D hidden units with ReLU
L02873: activations, the upper bound on the number of regions is 2D (Montúfar et al., 2014).
L02874: The
L02875: same authors show that a deep ReLU network with Di-dimensional input and K layers, each
L02876: containing D ≥Di hidden units, has O
L02877: 
L02878: (D/Di)(K−1)DiDDi
L02879: 
L02880: linear regions. Montúfar (2017),
L02881: Arora et al. (2016) and Serra et al. (2018) all provide tighter upper bounds that consider the
L02882: possibility that each layer has different numbers of hidden units. Serra et al. (2018) provide
L02883: an algorithm that counts the number of linear regions in a neural network, although it is only
L02884: practical for very small networks.
L02885: If the number of hidden units D in each of the K layers is the same, and D is an integer
L02886: multiple of the input dimensionality Di, then the maximum number of linear regions Nr can be
L02887: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L02890: <!-- page 67 -->
L02891: Notes
L02892: 53
L02893: computed exactly and is:
L02894: Nr =
L02895:  D
L02896: Di + 1
L02897: Di(K−1)
L02898: ·
L02899: Di
L02900: X
L02901: j=0
L02903: D
L02904: j
L02905: !
L02906: .
L02907: (4.17)
L02908: The first term in this expression corresponds to the first K −1 layers of the network, which can
L02909: be thought of as repeatedly folding the input space. However, we now need to devote D/Di
L02910: hidden units to each input dimension to create these folds. The last term in this equation (a
L02911: sum of binomial coeﬀicients) is the number of regions that a shallow network can create and is
L02912: Appendix B.2
L02913: Binomial coeﬀicient
L02914: attributable to the last layer. For further information, consult Montúfar et al. (2014), Pascanu
L02915: et al. (2013), and Montúfar (2017).
L02916: Universal approximation theorem:
L02917: We argued in section 4.5.1 that if the layers of a deep
L02918: network have enough hidden units, then the width version of the universal approximation the-
L02919: orem applies: there exists an approximating for any given continuous function on a compact
L02920: subset of RDi and for an arbitrary specified accuracy. Lu et al. (2017) proved that for any
L02921: Di-dimensional Lebesgue integrable function and for an arbitrary accuracy, if enough hidden
L02922: layers are available, then there exists a network with ReLU activation functions and at least
L02923: Di +4 hidden units in each layer that can approximate the given function to the given accuracy.
L02924: This is known as the depth version of the universal approximation theorem.
L02925: Depth eﬀiciency:
L02926: Several results show that there are functions that can be realized by deep
L02927: networks but not by any shallow network whose capacity is bounded above exponentially. In
L02928: other words, it would take an exponentially larger number of units in a shallow network to
L02929: describe these functions accurately. This is known as the depth eﬀiciency of neural networks.
L02930: Telgarsky (2016) shows that for any integer k, it is possible to construct networks with one input,
L02931: one output, and O[k3] layers of constant width, which cannot be realized with O[k] layers and
L02932: less than 2k width. Perhaps surprisingly, Eldan & Shamir (2016) showed that when there are
L02933: multivariate inputs, there is a three-layer network that cannot be realized by any two-layer
L02934: network if the capacity is sub-exponential in the input dimension. Cohen et al. (2016), Safran
L02935: & Shamir (2017), and Poggio et al. (2017) also demonstrate functions that deep networks can
L02936: approximate eﬀiciently, but shallow ones cannot. Liang & Srikant (2016) show that for a broad
L02937: class of functions, including univariate functions, shallow networks require exponentially more
L02938: hidden units than deep networks for a given upper bound on the approximation error.
L02939: Width eﬀiciency:
L02940: Lu et al. (2017) investigate whether there are wide shallow networks (i.e.,
L02941: shallow networks with lots of hidden units) that cannot be realized by narrow networks whose
L02942: depth is not substantially larger. They show that there exist classes of wide, shallow networks
L02943: that can only be expressed by narrow networks with polynomial depth. This is known as the
L02944: width eﬀiciency of neural networks. This polynomial lower bound on width is less restrictive
L02945: than the exponential lower bound on depth, suggesting that depth is more important. Vardi
L02946: et al. (2022) subsequently showed that the price for making the width small is only a linear
L02947: increase in the network depth for networks with ReLU activations.
L02948: Problems
L02949: Problem 4.1∗Consider composing the two neural networks in figure 4.8. Draw a plot of the
L02950: relationship between the input x and output y′ for x ∈[−1, 1].
L02951: Problem 4.2 Identify the four hyperparameters in figure 4.6.
L02952: Draft: please send errata to udlbookmail@gmail.com.
L02955: <!-- page 68 -->
L02956: 54
L02957: 4
L02958: Deep neural networks
L02959: Figure 4.8 Composition of two networks for problem 4.1. a) The output y of the
L02960: first network becomes the input to the second. b) The first network computes
L02961: this function with output values y ∈[−1, 1]. c) The second network computes
L02962: this function on the input range y ∈[−1, 1].
L02963: Problem 4.3 Using the non-negative homogeneity property of the ReLU function (see prob-
L02964: lem 3.5), show that:
L02965: ReLU
L02966: h
L02967: β1+λ1·Ω1ReLU [β0+λ0 · Ω0x]
L02968: i
L02969: =λ0λ1 · ReLU
L02970: 
L02971: 1
L02972: λ0λ1 β1+Ω1ReLU
L02973:  1
L02974: λ0 β0+Ω0x
L02975: 
L02976: ,
L02977: (4.18)
L02978: where λ0 and λ1 are non-negative scalars. From this, we see that the weight matrices can be
L02979: rescaled by any magnitude as long as the biases are also adjusted, and the scale factors can be
L02980: re-applied at the end of the network.
L02981: Problem 4.4 Write out the equations for a deep neural network that takes Di = 5 inputs, Do = 4
L02982: outputs and has three hidden layers of sizes D1 = 20, D2 = 10, and D3 = 7, respectively, in
L02983: both the forms of equations 4.15 and 4.16. What are the sizes of each weight matrix Ω• and
L02984: bias vector β•?
L02985: Problem 4.5 Consider a deep neural network with Di = 5 inputs, Do = 1 output, and K = 20
L02986: hidden layers containing D = 30 hidden units each. What is the depth of this network? What
L02987: is the width?
L02988: Problem 4.6 Consider a network with Di = 1 input, Do = 1 output, and K = 10 layers, with
L02989: D = 10 hidden units in each. Would the number of weights increase more if we increased the
L02990: depth by one or the width by one? Provide your reasoning.
L02991: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L02994: <!-- page 69 -->
L02995: Notes
L02996: 55
L02997: Problem 4.7 Choose values for the parameters ϕ = {ϕ0, ϕ1, ϕ2, ϕ3, θ10, θ11, θ20, θ21, θ30, θ31} for
L02998: the shallow neural network in equation 3.1 (with ReLU activation functions) that will define an
L02999: identity function over a finite range x ∈[a, b].
L03000: Problem 4.8∗Figure 4.9 shows the activations in the three hidden units of a shallow network
L03001: (as in figure 3.3). The slopes in the hidden units are 1.0, 1.0, and -1.0, respectively, and the
L03002: “joints” in the hidden units are at positions 1/6, 2/6, and 4/6. Find values of ϕ0, ϕ1, ϕ2, and ϕ3
L03003: that will combine the hidden unit activations as ϕ0 + ϕ1h1 + ϕ2h2 + ϕ3h3 to create a function
L03004: with four linear regions that oscillate between output values of zero and one. The slope of the
L03005: leftmost region should be positive, the next one negative, and so on. How many linear regions
L03006: will we create if we compose this network with itself? How many will we create if we compose
L03007: it with itself K times?
L03008: Problem 4.9∗Following problem 4.8, is it possible to create a function with three linear regions
L03009: that oscillates back and forth between output values of zero and one using a shallow network
L03010: with two hidden units? Is it possible to create a function with five linear regions that oscillates
L03011: in the same way using a shallow network with four hidden units?
L03012: Figure 4.9 Hidden unit activations for problem 4.8. a) First hidden unit has a
L03013: joint at position x = 1/6 and a slope of one in the active region. b) Second hidden
L03014: unit has a joint at position x = 2/6 and a slope of one in the active region. c)
L03015: Third hidden unit has a joint at position x = 4/6 and a slope of minus one in the
L03016: active region.
L03017: Problem 4.10 Consider a deep neural network with a single input, a single output, and K
L03018: hidden layers, each of which contains D hidden units. Show that this network will have a total
L03019: of 3D + 1 + (K −1)D(D + 1) parameters.
L03020: Problem 4.11∗Consider two neural networks that map a scalar input x to a scalar output y.
L03021: The first network is shallow and has D = 95 hidden units. The second is deep and has K = 10
L03022: layers, each containing D = 5 hidden units. How many parameters does each network have?
L03023: How many linear regions can each network make (see equation 4.17)? Which would run faster?
L03024: Draft: please send errata to udlbookmail@gmail.com.
L03027: <!-- page 70 -->
L03028: Chapter 5
L03029: Loss functions
L03030: The last three chapters described linear regression, shallow neural networks, and deep
L03031: neural networks. Each represents a family of functions that map input to output, where
L03032: the particular member of the family is determined by the model parameters ϕ. When
L03033: we train these models, we seek the parameters that produce the best possible mapping
L03034: from input to output for the task we are considering. This chapter defines what is meant
L03035: by the “best possible” mapping.
L03036: That definition requires a training dataset {xi, yi} of input/output pairs.
L03037: A loss
L03038: function or cost function L[ϕ] returns a single number that describes the mismatch
L03039: between the model predictions f[xi, ϕ] and their corresponding ground-truth outputs yi.
L03040: During training, we seek parameter values ϕ that minimize the loss and hence map the
L03041: training inputs to the outputs as closely as possible.
L03042: We saw one example of a loss
L03043: function in chapter 2; the least squares loss function is suitable for univariate regression
L03044: problems for which the target is a real number y ∈R. It computes the sum of the squares
L03045: Appendix A
L03046: Sets
L03047: of the deviations between the model predictions f[xi, ϕ] and the true values yi.
L03048: This chapter provides a framework that both justifies the choice of the least squares
L03049: criterion for real-valued outputs and allows us to build loss functions for other prediction
L03050: types. We consider binary classification, where the prediction y ∈{0, 1} is one of two
L03051: categories, multiclass classification, where the prediction y ∈{1, 2, . . . , K} is one of K
L03052: categories, and more complex cases. In the following two chapters, we address model
L03053: training, where the goal is to find the parameter values that minimize these loss functions.
L03054: 5.1
L03055: Maximum likelihood
L03056: In this section, we develop a recipe for constructing loss functions. Consider a model
L03057: f[x, ϕ] with parameters ϕ that computes an output from input x. Until now, we have
L03058: Appendix C.1.3
L03059: Conditional
L03060: probability
L03061: implied that the model directly computes a prediction y. We now shift perspective and
L03062: consider the model as computing a conditional probability distribution Pr(y|x) over
L03063: possible outputs y given input x. The loss encourages each training output yi to have
L03064: a high probability under the distribution Pr(yi|xi) computed from the corresponding
L03065: input xi (figure 5.1).
L03066: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L03069: <!-- page 71 -->
L03070: 5.1
L03071: Maximum likelihood
L03072: 57
L03073: Figure 5.1 Predicting distributions over outputs. a) Regression task, where the
L03074: goal is to predict a real-valued output y from the input x based on training data
L03075: {xi, yi} (orange points). For each input value x, the machine learning model pre-
L03076: dicts a distribution Pr(y|x) over the output y ∈R (cyan curves show distributions
L03077: for x=2.0 and x=7.0). Minimizing the loss function corresponds to maximizing
L03078: the probability of the training outputs yi under the distribution predicted from
L03079: the corresponding inputs xi. b) To predict discrete classes y ∈{1, 2, 3, 4} in a
L03080: classification task, we use a discrete probability distribution, so the model pre-
L03081: dicts a different histogram over the four possible values of yi for each value of
L03082: xi. c) To predict counts y ∈{0, 1, 2, . . .} and d) direction y ∈(−π, π], we use
L03083: distributions defined over positive integers and circular domains, respectively.
L03084: Draft: please send errata to udlbookmail@gmail.com.
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
