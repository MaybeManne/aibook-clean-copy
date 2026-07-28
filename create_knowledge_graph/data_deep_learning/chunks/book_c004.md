L01695: <!-- page 43 -->
L01696: 3.2
L01697: Universal approximation theorem
L01698: 29
L01699: Figure 3.4 Depicting neural networks. a) The input x is on the left, the hidden
L01700: units h1, h2, and h3 in the center, and the output y on the right. Computation
L01701: flows from left to right. The input is used to compute the hidden units, which are
L01702: combined to create the output. Each of the ten arrows represents a parameter
L01703: (intercepts in orange and slopes in black). Each parameter multiplies its source
L01704: and adds the result to its target. For example, we multiply the parameter ϕ1
L01705: by source h1 and add it to y. We introduce additional nodes containing ones
L01706: (orange circles) to incorporate the offsets into this scheme, so we multiply ϕ0 by
L01707: one (with no effect) and add it to y. ReLU functions are applied at the hidden
L01708: units. b) More typically, the intercepts, ReLU functions, and parameter names
L01709: are omitted; this simpler depiction represents the same network.
L01710: 3.2
L01711: Universal approximation theorem
L01712: In the previous section, we introduced an example neural network with one input, one
L01713: output, ReLU activation functions, and three hidden units. Let’s now generalize this
L01714: slightly and consider the case with D hidden units where the dth hidden unit is:
L01715: hd = a[θd0 + θd1x],
L01716: (3.5)
L01717: and these are combined linearly to create the output:
L01718: y = ϕ0 +
L01719: D
L01720: X
L01721: d=1
L01722: ϕdhd.
L01723: (3.6)
L01724: The number of hidden units in a shallow network is a measure of the network capacity.
L01725: With ReLU activation functions, the output of a network with D hidden units has at
L01726: Problem 3.10
L01727: most D joints and so is a piecewise linear function with at most D + 1 linear regions. As
L01728: we add more hidden units, the model can approximate more complex functions.
L01729: Indeed, with enough capacity (hidden units), a shallow network can describe any
L01730: continuous 1D function defined on a compact subset of the real line to arbitrary precision.
L01731: To see this, consider that every time we add a hidden unit, we add another linear region to
L01732: the function. As these regions become more numerous, they represent smaller sections
L01733: of the function, which are increasingly well approximated by a line (figure 3.5). The
L01734: universal approximation theorem proves that for any continuous function, there exists a
L01735: shallow network that can approximate this function to any specified precision.
L01736: Draft: please send errata to udlbookmail@gmail.com.
L01739: <!-- page 44 -->
L01740: 30
L01741: 3
L01742: Shallow neural networks
L01743: Figure 3.5 Approximation of a 1D function (dashed line) by a piecewise linear
L01744: model. a–c) As the number of regions increases, the model becomes closer and
L01745: closer to the continuous function. A neural network with a scalar input creates
L01746: one extra linear region per hidden unit.
L01747: This idea generalizes to functions in
L01748: Di dimensions. The universal approximation theorem proves that, with enough
L01749: hidden units, there exists a shallow neural network that can describe any given
L01750: continuous function defined on a compact subset of RDi to arbitrary precision.
L01751: 3.3
L01752: Multivariate inputs and outputs
L01753: In the above example, the network has a single scalar input x and a single scalar output y.
L01754: However, the universal approximation theorem also holds for the more general case
L01755: where the network maps multivariate inputs x = [x1, x2, . . . , xDi]T to multivariate output
L01756: predictions y = [y1, y2, . . . , yDo]T . We first explore how to extend the model to predict
L01757: multivariate outputs. Then we consider multivariate inputs. Finally, in section 3.4, we
L01758: present a general definition of a shallow neural network.
L01759: 3.3.1
L01760: Visualizing multivariate outputs
L01761: To extend the network to multivariate outputs y, we simply use a different linear function
L01762: of the hidden units for each output. So, a network with a scalar input x, four hidden
L01763: units h1, h2, h3, and h4, and a 2D multivariate output y = [y1, y2]T would be defined as:
L01764: h1
L01765: =
L01766: a[θ10 + θ11x]
L01767: h2
L01768: =
L01769: a[θ20 + θ21x]
L01770: h3
L01771: =
L01772: a[θ30 + θ31x]
L01773: h4
L01774: =
L01775: a[θ40 + θ41x],
L01776: (3.7)
L01777: and
L01778: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L01781: <!-- page 45 -->
L01782: 3.3
L01783: Multivariate inputs and outputs
L01784: 31
L01785: Figure 3.6 Network with one input, four hidden units, and two outputs.
L01786: a)
L01787: Visualization of network structure. b) This network produces two piecewise linear
L01788: functions, y1[x] and y2[x]. The four “joints” of these functions (at vertical dotted
L01789: lines) are constrained to be in the same places since they share the same hidden
L01790: units, but the slopes and overall height may differ.
L01791: Figure 3.7 Visualization of neural net-
L01792: work with 2D multivariate input x =
L01793: [x1, x2]T and scalar output y.
L01794: y1
L01795: =
L01796: ϕ10 + ϕ11h1 + ϕ12h2 + ϕ13h3 + ϕ14h4
L01797: y2
L01798: =
L01799: ϕ20 + ϕ21h1 + ϕ22h2 + ϕ23h3 + ϕ24h4.
L01800: (3.8)
L01801: The two outputs are two different linear functions of the hidden units.
L01802: As we saw in figure 3.3, the “joints” in the piecewise functions depend on where the
L01803: initial linear functions θ•0 + θ•1x are clipped by the ReLU functions a[•] at the hidden
L01804: units. Since both outputs y1 and y2 are different linear functions of the same four hidden
L01805: Problem 3.11
L01806: units, the four “joints” in each must be in the same places. However, the slopes of the
L01807: linear regions and the overall vertical offset can differ (figure 3.6).
L01808: 3.3.2
L01809: Visualizing multivariate inputs
L01810: To cope with multivariate inputs x, we extend the linear relations between the input
L01811: and the hidden units. So a network with two inputs x = [x1, x2]T and a scalar output y
L01812: (figure 3.7) might have three hidden units defined by:
L01813: Draft: please send errata to udlbookmail@gmail.com.
L01816: <!-- page 46 -->
L01817: 32
L01818: 3
L01819: Shallow neural networks
L01820: Figure 3.8 Processing in network with two inputs x = [x1, x2]T , three hidden
L01821: units h1, h2, h3, and one output y.
L01822: a–c) The input to each hidden unit is a
L01823: linear function of the two inputs, which corresponds to an oriented plane. Bright-
L01824: ness indicates function output. For example, in panel (a), the brightness repre-
L01825: sents θ10 + θ11x1 + θ12x2. Thin lines are contours. d–f) Each plane is clipped by
L01826: the ReLU activation function (cyan lines are equivalent to “joints” in figures 3.3d–
L01827: f). g-i) The clipped planes are then weighted, and j) summed together with an
L01828: offset that determines the overall height of the surface. The result is a continuous
L01829: surface made up of convex piecewise linear polygonal regions. (Interactive figure)
L01830: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L01833: <!-- page 47 -->
L01834: 3.4
L01835: Shallow neural networks: general case
L01836: 33
L01837: h1
L01838: =
L01839: a[θ10 + θ11x1 + θ12x2]
L01840: h2
L01841: =
L01842: a[θ20 + θ21x1 + θ22x2]
L01843: h3
L01844: =
L01845: a[θ30 + θ31x1 + θ32x2],
L01846: (3.9)
L01847: where there is now one slope parameter for each input. The hidden units are combined
L01848: to form the output in the usual way:
L01849: y = ϕ0 + ϕ1h1 + ϕ2h2 + ϕ3h3.
L01850: (3.10)
L01851: Figure 3.8 illustrates the processing of this network. Each hidden unit receives a linear
L01852: Problems 3.12–3.13
L01853: combination of the two inputs, which forms an oriented plane in the 3D input/output
L01854: Notebook 3.2
L01855: Shallow networks II
L01856: space. The activation function clips the negative values of these planes to zero. The
L01857: clipped planes are then recombined in a second linear function (equation 3.10) to create
L01858: a continuous piecewise linear surface consisting of convex polygonal regions (figure 3.8j).
L01859: Appendix B.1.2
L01860: Convex region
L01861: Each region corresponds to a different activation pattern. For example, in the central
L01862: triangular region, the first and third hidden units are active, and the second is inactive.
L01863: When there are more than two inputs to the model, it becomes diﬀicult to visualize.
L01864: However, the interpretation is similar. The output will be a continuous piecewise linear
L01865: function of the input, where the linear regions are now convex polytopes in the multi-
L01866: dimensional input space.
L01867: Note that as the input dimensions grow, the number of linear regions increases rapidly
L01868: (figure 3.9). To get a feeling for how rapidly, consider that each hidden unit defines a
L01869: hyperplane that delineates the part of space where this unit is active from the part
L01870: Notebook 3.3
L01871: Shallow network
L01872: regions
L01873: where it is not (cyan lines in 3.8d–f). If we had the same number of hidden units as
L01874: input dimensions Di, we could align each hyperplane with one of the coordinate axes
L01875: (figure 3.10). For two input dimensions, this would divide the space into four quadrants.
L01876: For three dimensions, this would create eight octants, and for Di dimensions, this would
L01877: create 2Di orthants. Shallow neural networks usually have more hidden units than input
L01878: dimensions, so they typically create more than 2Di linear regions.
L01879: 3.4
L01880: Shallow neural networks: general case
L01881: We have described several example shallow networks to help develop intuition about how
L01882: they work. We now define a general equation for a shallow neural network y = f[x, ϕ]
L01883: that maps a multi-dimensional input x ∈RDi to a multi-dimensional output y ∈RDo
L01884: using D hidden units. Each hidden unit is computed as:
L01885: hd = a
L01886: "
L01887: θd0 +
L01888: Di
L01889: X
L01890: i=1
L01891: θdixi
L01892: #
L01893: ,
L01894: (3.11)
L01895: and these are combined linearly to create the output:
L01896: Draft: please send errata to udlbookmail@gmail.com.
L01899: <!-- page 48 -->
L01900: 34
L01901: 3
L01902: Shallow neural networks
L01903: Figure 3.9 Linear regions vs. hidden units. a) Maximum possible regions as a
L01904: function of the number of hidden units for five different input dimensions Di =
L01905: {1, 5, 10, 50, 100}. The number of regions increases rapidly in high dimensions;
L01906: with D = 500 units and input size Di = 100, there can be greater than 10107
L01907: regions (solid circle). b) The same data are plotted as a function of the number of
L01908: parameters. The solid circle represents the same model as in panel (a) with D =
L01909: 500 hidden units. This network has 51, 001 parameters and would be considered
L01910: very small by modern standards.
L01911: Figure 3.10 Number of linear regions vs. input dimensions. a) With a single input
L01912: dimension, a model with one hidden unit creates one joint, which divides the axis
L01913: into two linear regions. b) With two input dimensions, a model with two hidden
L01914: units can divide the input space using two lines (here aligned with axes) to create
L01915: four regions. c) With three input dimensions, a model with three hidden units
L01916: can divide the input space using three planes (again aligned with axes) to create
L01917: eight regions. Continuing this argument, it follows that a model with Di input
L01918: dimensions and Di hidden units can divide the input space with Di hyperplanes
L01919: to create 2Di linear regions.
L01920: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L01923: <!-- page 49 -->
L01924: 3.5
L01925: Terminology
L01926: 35
L01927: Figure 3.11 Visualization of neural net-
L01928: work with three inputs and two out-
L01929: puts. This network has twenty param-
L01930: eters. There are fifteen slopes (indicated
L01931: by arrows) and five offsets (not shown).
L01932: yj = ϕj0 +
L01933: D
L01934: X
L01935: d=1
L01936: ϕjdhd,
L01937: (3.12)
L01938: where a[•] is a nonlinear activation function. The model has parameters ϕ = {θ••, ϕ••}.
L01939: Figure 3.11 shows an example with three inputs, three hidden units, and two outputs.
L01940: Problems 3.14–3.17
L01941: The activation function permits the model to describe nonlinear relations between
L01942: input and the output, and as such, it must be nonlinear itself; with no activation func-
L01943: tion, or a linear activation function, the overall mapping from input to output would
L01944: be restricted to be linear. Many different activation functions have been tried (see fig-
L01945: ure 3.13), but the most common choice is the ReLU (figure 3.1), which has the merit
L01946: Notebook 3.4
L01947: Activation
L01948: functions
L01949: of being easily interpretable.
L01950: With ReLU activations, the network divides the input
L01951: space into convex polytopes defined by the intersections of hyperplanes computed by
L01952: the “joints” in the ReLU functions. Each convex polytope contains a different linear
L01953: function. The polytopes are the same for each output, but the linear functions they
L01954: contain can differ.
L01955: 3.5
L01956: Terminology
L01957: We conclude this chapter by introducing some terminology. Regrettably, neural networks
L01958: have a lot of associated jargon. They are often referred to in terms of layers. The left of
L01959: figure 3.12 is the input layer, the center is the hidden layer, and to the right is the output
L01960: layer. We would say that the network in figure 3.12 has one hidden layer containing
L01961: four hidden units. The hidden units themselves are sometimes referred to as neurons.
L01962: When we pass data through the network, the values of the inputs to the hidden layer
L01963: (i.e., before the ReLU functions are applied) are termed pre-activations. The values at
L01964: the hidden layer (i.e., after the ReLU functions) are termed activations.
L01965: For historical reasons, any neural network with at least one hidden layer is also called
L01966: a multi-layer perceptron, or MLP for short. Networks with one hidden layer (as described
L01967: in this chapter) are sometimes referred to as shallow neural networks. Networks with
L01968: multiple hidden layers (as described in the next chapter) are referred to as deep neural
L01969: networks. Neural networks in which the connections form an acyclic graph (i.e., a graph
L01970: with no loops, as in all the examples in this chapter) are referred to as feed-forward
L01971: networks. If every element in one layer connects to every element in the next (as in
L01972: all the examples in this chapter), the network is fully connected.
L01973: These connections
L01974: Draft: please send errata to udlbookmail@gmail.com.
L01977: <!-- page 50 -->
L01978: 36
L01979: 3
L01980: Shallow neural networks
L01981: Figure 3.12 Terminology. A shallow network consists of an input layer, a hidden
L01982: layer, and an output layer. Each layer is connected to the next by forward con-
L01983: nections (arrows). For this reason, these models are referred to as feed-forward
L01984: networks.
L01985: When every variable in one layer connects to every variable in the
L01986: next, we call this a fully connected network. Each connection represents a slope
L01987: parameter in the underlying equation, and these parameters are termed weights.
L01988: The variables in the hidden layer are termed neurons or hidden units. The values
L01989: feeding into the hidden units are termed pre-activations, and the values at the
L01990: hidden units (i.e., after the ReLU function is applied) are termed activations.
L01991: represent slope parameters in the underlying equations and are referred to as network
L01992: weights. The offset parameters (not shown in figure 3.12) are called biases.
L01993: 3.6
L01994: Summary
L01995: Shallow neural networks have one hidden layer. They (i) compute several linear functions
L01996: of the input, (ii) pass each result through an activation function, and then (iii) take a
L01997: linear combination of these activations to form the outputs. Shallow neural networks
L01998: make predictions y based on inputs x by dividing the input space into a continuous
L01999: surface of piecewise linear regions. With enough hidden units (neurons), shallow neural
L02000: networks can approximate any continuous function to arbitrary precision.
L02001: Chapter 4 discusses deep neural networks, which extend the models from this chapter
L02002: by adding more hidden layers. Chapters 5–7 describe how to train these models.
L02003: Notes
L02004: “Neural” networks:
L02005: If the models in this chapter are just functions, why are they called
L02006: “neural networks”? The connection is, unfortunately, tenuous. Visualizations like figure 3.12
L02007: consist of nodes (inputs, hidden units, and outputs) that are densely connected to one another.
L02008: This bears a superficial similarity to neurons in the mammalian brain, which also have dense
L02009: connections. However, there is scant evidence that brain computation works in the same way
L02010: as neural networks, and it is unhelpful to think about biology going forward.
L02011: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L02014: <!-- page 51 -->
L02015: Notes
L02016: 37
L02017: Figure 3.13 Activation functions.
L02018: a) Logistic sigmoid and tanh functions.
L02019: b)
L02020: Leaky ReLU and parametric ReLU with parameter 0.25. c) SoftPlus, Gaussian
L02021: error linear unit, and sigmoid linear unit. d) Exponential linear unit with param-
L02022: eters 0.5 and 1.0, e) Scaled exponential linear unit. f) Swish with parameters 0.4,
L02023: 1.0, and 1.4.
L02024: History of neural networks:
L02025: McCulloch & Pitts (1943) first came up with the notion of an
L02026: artificial neuron that combined inputs to produce an output, but this model did not have a prac-
L02027: tical learning algorithm. Rosenblatt (1958) developed the perceptron, which linearly combined
L02028: inputs and then thresholded them to make a yes/no decision. He also provided an algorithm
L02029: to learn the weights from data. Minsky & Papert (1969) argued that the linear function was
L02030: inadequate for general classification problems but that adding hidden layers with nonlinear
L02031: activation functions (hence the term multi-layer perceptron) could allow the learning of more
L02032: general input/output relations. However, they concluded that Rosenblatt’s algorithm could not
L02033: learn the parameters of such models.
L02034: It was not until the 1980s that a practical algorithm
L02035: (backpropagation, see chapter 7) was developed, and significant work on neural networks re-
L02036: sumed. The history of neural networks is chronicled by Kurenkov (2020), Sejnowski (2018), and
L02037: Schmidhuber (2022).
L02038: Activation functions:
L02039: The ReLU function has been used as far back as Fukushima (1969).
L02040: However, in the early days of neural networks, it was more common to use the logistic sigmoid or
L02041: tanh activation functions (figure 3.13a). The ReLU was re-popularized by Jarrett et al. (2009),
L02042: Nair & Hinton (2010), and Glorot et al. (2011) and is an important part of the success story of
L02043: modern neural networks. It has the nice property that the derivative of the output with respect
L02044: to the input is always one for inputs greater than zero. This contributes to the stability and
L02045: eﬀiciency of training (see chapter 7) and contrasts with the derivatives of sigmoid activation
L02046: Draft: please send errata to udlbookmail@gmail.com.
L02049: <!-- page 52 -->
L02050: 38
L02051: 3
L02052: Shallow neural networks
L02053: functions, which saturate (become close to zero) for large positive and large negative inputs.
L02054: However, the ReLU function has the disadvantage that its derivative is zero for negative inputs.
L02055: If all the training examples produce negative inputs to a given ReLU function, then we cannot
L02056: improve the parameters feeding into this ReLU during training. The gradient with respect to
L02057: the incoming weights is locally flat, so we cannot “walk downhill.” This is known as the dying
L02058: ReLU problem.
L02059: Many variations on the ReLU have been proposed to resolve this problem
L02060: (figure 3.13b), including (i) the leaky ReLU (Maas et al., 2013), which also has a linear output
L02061: for negative values with a smaller slope of 0.1, (ii) the parametric ReLU (He et al., 2015), which
L02062: treats the slope of the negative portion as an unknown parameter, and (iii) the concatenated
L02063: ReLU (Shang et al., 2016), which produces two outputs, one of which clips below zero (i.e., like
L02064: a typical ReLU) and one of which clips above zero.
L02065: A variety of smooth functions have also been investigated (figure 3.13c–d), including the soft-
L02066: plus function (Glorot et al., 2011), Gaussian error linear unit (Hendrycks & Gimpel, 2016),
L02067: sigmoid linear unit (Hendrycks & Gimpel, 2016), and exponential linear unit (Clevert et al.,
L02068: 2015). Most of these are attempts to avoid the dying ReLU problem while limiting the gradient
L02069: for negative values. Klambauer et al. (2017) introduced the scaled exponential linear unit (fig-
L02070: ure 3.13e), which is particularly interesting as it helps stabilize the variance of the activations
L02071: when the input variance has a limited range (see section 7.5). Ramachandran et al. (2017)
L02072: adopted an empirical approach to choosing an activation function. They searched the space
L02073: of possible functions to find the one that performed best over a variety of supervised learning
L02074: tasks. The optimal function was found to be a[x] = x/(1 + exp[−βx]), where β is a learned
L02075: parameter (figure 3.13f). They termed this function Swish. Interestingly, this was a rediscovery
L02076: of activation functions previously proposed by Hendrycks & Gimpel (2016) and Elfwing et al.
L02077: (2018). Howard et al. (2019) approximated Swish by the HardSwish function, which has a very
L02078: similar shape but is faster to compute:
L02079: HardSwish[z] =
L02080: 
L02081: 
L02082: 
L02083: 
L02084: 
L02085: 0
L02086: z < −3
L02087: z(z + 3)/6
L02088: −3 ≤z ≤3
L02089: z
L02090: z > 3
L02091: .
L02092: (3.13)
L02093: There is no definitive answer as to which of these activations functions is empirically superior.
L02094: However, the leaky ReLU, parameterized ReLU, and many of the continuous functions can be
L02095: shown to provide minor performance gains over the ReLU in particular situations. We restrict
L02096: attention to neural networks with the basic ReLU function for the rest of this book because it’s
L02097: easy to characterize the functions they create in terms of the number of linear regions.
L02098: Universal approximation theorem:
L02099: The width version of this theorem states that for any
L02100: continuous function on a compact subset of Rn and for an arbitrary specified accuracy, there
L02101: exists a network with one hidden layer containing a finite number of hidden units that can
L02102: approximate the given function to that accuracy.
L02103: This was proved by Cybenko (1989) for
L02104: a class of sigmoid activations and was later shown to be true for a larger class of nonlinear
L02105: activation functions (Hornik, 1991).
L02106: Number of linear regions:
L02107: Consider a shallow network with Di ≥2-dimensional inputs
L02108: and D hidden units. The number of linear regions is determined by the intersections of the D
L02109: hyperplanes created by the “joints” in the ReLU functions (e.g., figure 3.8d–f). Each region is
L02110: created by a different combination of the ReLU functions clipping or not clipping the input.
L02111: Appendix B.2
L02112: Binomial
L02113: coeﬀicient
L02114: The number of regions created by D hyperplanes in the Di ≤D-dimensional input space was
L02115: Problem 3.18
L02116: shown by Zaslavsky (1975) to be at most PDi
L02117: j=0
L02118:  D
L02119: j
L02120: 
L02121: (i.e., a sum of binomial coeﬀicients). As a
L02122: rule of thumb, shallow neural networks almost always have a larger number D of hidden units
L02123: than input dimensions Di and create between 2Di and 2D linear regions.
L02124: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L02127: <!-- page 53 -->
L02128: Notes
L02129: 39
L02130: Linear, aﬀine, and nonlinear functions:
L02131: Technically, a linear transformation f[•] is any
L02132: function that obeys the principle of superposition, so f[a+b] = f[a]+f[b]. This definition implies
L02133: that f[2a] = 2f[a].The weighted sum f[h1, h2, h3] = ϕ1h1 + ϕ2h2 + ϕ3h3 is linear, but once the
L02134: offset (bias) is added so f[h1, h2, h3] = ϕ0 + ϕ1h1 + ϕ2h2 + ϕ3h3, this is no longer true. To see
L02135: this, consider that the output is doubled when we double the arguments of the former function.
L02136: This is not the case for the latter function, which is more properly termed an aﬀine function.
L02137: However, it is common in machine learning to conflate these terms. We follow this convention
L02138: in this book and refer to both as linear. All other functions we will encounter are nonlinear.
L02139: Problems
L02140: Problem 3.1 What kind of mapping from input to output would be created if the activation
L02141: function in equation 3.1 was linear so that a[z] = ψ0 + ψ1z? What kind of mapping would be
L02142: created if the activation function was removed, so a[z] = z?
L02143: Problem 3.2 For each of the four linear regions in figure 3.3j, indicate which hidden units are
L02144: inactive and which are active (i.e., which do and do not clip their inputs).
L02145: Problem 3.3∗Derive expressions for the positions of the “joints” in function in figure 3.3j in
L02146: terms of the ten parameters ϕ and the input x. Derive expressions for the slopes of the four
L02147: linear regions.
L02148: Problem 3.4 Draw a version of figure 3.3 where the y-intercept and slope of the third hidden
L02149: unit have changed as in figure 3.14c. Assume that the remaining parameters remain the same.
L02150: Figure 3.14 Processing in network with one input, three hidden units, and one
L02151: output for problem 3.4. a–c) The input to each hidden unit is a linear function of
L02152: the inputs. The first two are the same as in figure 3.3, but the last one differs.
L02153: Problem 3.5 Prove that the following property holds for α ∈R+:
L02154: ReLU[α · z] = α · ReLU[z].
L02155: (3.14)
L02156: This is known as the non-negative homogeneity property of the ReLU function.
L02157: Draft: please send errata to udlbookmail@gmail.com.
L02160: <!-- page 54 -->
L02161: 40
L02162: 3
L02163: Shallow neural networks
L02164: Problem 3.6 Following on from problem 3.5, what happens to the shallow network defined in
L02165: equations 3.3 and 3.4 when we multiply the parameters θ10 and θ11 by a positive constant α
L02166: and divide the slope ϕ1 by the same parameter α? What happens if α is negative?
L02167: Problem 3.7 Consider fitting the model in equation 3.1 using a least squares loss function. Does
L02168: this loss function have a unique minimum? i.e., is there a single “best” set of parameters?
L02169: Problem 3.8 Consider replacing the ReLU activation function with (i) the Heaviside step func-
L02170: tion heaviside[z], (ii) the hyperbolic tangent function tanh[z], and (iii) the rectangular func-
L02171: tion rect[z], where:
L02172: heaviside[z] =
L02173: (
L02174: 0
L02175: z < 0
L02176: 1
L02177: z ≥0
L02178: rect[z] =
L02179: 
L02180: 
L02181: 
L02182: 
L02183: 
L02184: 0
L02185: z < 0
L02186: 1
L02187: 0 ≤z ≤1
L02188: 0
L02189: z > 1
L02190: .
L02191: (3.15)
L02192: Redraw a version of figure 3.3 for each of these functions. The original parameters were: ϕ =
L02193: {ϕ0, ϕ1, ϕ2, ϕ3, θ10, θ11, θ20, θ21, θ30, θ31} = {−0.23, −1.3, 1.3, 0.66, −0.2, 0.4, −0.9, 0.9, 1.1, −0.7}.
L02194: Provide an informal description of the family of functions that can be created by neural networks
L02195: with one input, three hidden units, and one output for each activation function.
L02196: Problem 3.9∗Show that the third linear region in figure 3.3 has a slope that is the sum of the
L02197: slopes of the first and fourth linear regions.
L02198: Problem 3.10 Consider a neural network with one input, one output, and three hidden units.
L02199: The construction in figure 3.3 shows how this creates four linear regions. Under what circum-
L02200: stances could this network produce a function with fewer than four linear regions?
L02201: Problem 3.11∗How many parameters does the model in figure 3.6 have?
L02202: Problem 3.12 How many parameters does the model in figure 3.7 have?
L02203: Problem 3.13 What is the activation pattern for each of the seven regions in figure 3.8j? In
L02204: other words, which hidden units are active (pass the input) and which are inactive (clip the
L02205: input) for each region?
L02206: Problem 3.14 Write out the equations that define the network in figure 3.11. There should
L02207: be three equations to compute the three hidden units from the inputs and two equations to
L02208: compute the outputs from the hidden units.
L02209: Problem 3.15∗What is the maximum possible number of 3D linear regions that can be created
L02210: by the network in figure 3.11?
L02211: Problem 3.16 Write out the equations for a shallow network with two inputs, four hidden units,
L02212: and three outputs. Draw this model in the style of figure 3.11.
L02213: Problem 3.17∗Equations 3.11 and 3.12 define a general neural network with Di inputs, one
L02214: hidden layer containing D hidden units, and Do outputs. Find an expression for the number of
L02215: parameters in the model in terms of Di, D, and Do.
L02216: Problem 3.18∗Show that the maximum number of regions created by a shallow network
L02217: with Di = 2-dimensional input, Do = 1-dimensional output, and D = 3 hidden units is seven, as
L02218: in figure 3.8j. Use the result of Zaslavsky (1975) that the maximum number of regions created
L02219: by partitioning a Di-dimensional space with D hyperplanes is PDi
L02220: j=0
L02221:  D
L02222: j
L02223: 
L02224: . What is the maximum
L02225: number of regions if we add two more hidden units to this model, so D = 5?
L02226: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L02229: <!-- page 55 -->
L02230: Chapter 4
L02231: Deep neural networks
L02232: The last chapter described shallow neural networks, which have a single hidden layer.
L02233: This chapter introduces deep neural networks, which have more than one hidden layer.
L02234: With ReLU activation functions, both shallow and deep networks describe piecewise
L02235: linear mappings from input to output.
L02236: As the number of hidden units increases, shallow neural networks improve their
L02237: descriptive power.
L02238: Indeed, with enough hidden units, shallow networks can describe
L02239: arbitrarily complex functions in high dimensions. However, it turns out that for some
L02240: functions, the required number of hidden units is impractically large. Deep networks can
L02241: produce many more linear regions than shallow networks for a given number of parame-
L02242: ters. Hence, from a practical standpoint, they can be used to describe a broader family
L02243: of functions.
L02244: 4.1
L02245: Composing neural networks
L02246: To gain insight into the behavior of deep neural networks, we first consider composing
L02247: two shallow networks so the output of the first becomes the input of the second. Consider
L02248: two shallow networks with three hidden units each (figure 4.1a). The first network takes
L02249: an input x and returns output y and is defined by:
L02250: h1
L02251: =
L02252: a[θ10 + θ11x]
L02253: h2
L02254: =
L02255: a[θ20 + θ21x]
L02256: h3
L02257: =
L02258: a[θ30 + θ31x],
L02259: (4.1)
L02260: and
L02261: y = ϕ0 + ϕ1h1 + ϕ2h2 + ϕ3h3.
L02262: (4.2)
L02263: The second network takes y as input and returns y′ and is defined by:
L02264: Draft: please send errata to udlbookmail@gmail.com.
L02267: <!-- page 56 -->
L02268: 42
L02269: 4
L02270: Deep neural networks
L02271: Figure 4.1 Composing two single-layer networks with three hidden units each. a)
L02272: The output y of the first network constitutes the input to the second network. b)
L02273: The first network maps inputs x ∈[−1, 1] to outputs y ∈[−1, 1] using a function
L02274: comprising three linear regions that are chosen so that they alternate the sign
L02275: of their slope (fourth linear region is outside range of graph). Multiple inputs x
L02276: (gray circles) now map to the same output y (cyan circle). c) The second network
L02277: defines a function comprising three linear regions that takes y and returns y′ (i.e.,
L02278: the cyan circle is mapped to the brown circle). d) The combined effect of these
L02279: two functions when composed is that (i) three different inputs x are mapped to
L02280: any given value of y by the first network and (ii) are processed in the same way by
L02281: the second network; the result is that the function defined by the second network
L02282: in panel (c) is duplicated three times, variously flipped and rescaled according to
L02283: the slope of the regions of panel (b). (Interactive figure)
L02284: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L02287: <!-- page 57 -->
L02288: 4.2
L02289: From composing networks to deep networks
L02290: 43
L02291: h′
L02292: 1
L02293: =
L02294: a[θ′
L02295: 10 + θ′
L02296: 11y]
L02297: h′
L02298: 2
L02299: =
L02300: a[θ′
L02301: 20 + θ′
L02302: 21y]
L02303: h′
L02304: 3
L02305: =
L02306: a[θ′
L02307: 30 + θ′
L02308: 31y],
L02309: (4.3)
L02310: and
L02311: y′ = ϕ′
L02312: 0 + ϕ′
L02313: 1h′
L02314: 1 + ϕ′
L02315: 2h′
L02316: 2 + ϕ′
L02317: 3h′
L02318: 3.
L02319: (4.4)
L02320: With ReLU activations, this model also describes a family of piecewise linear functions.
L02321: However, the number of linear regions is potentially greater than for a shallow network
L02322: with six hidden units. To see this, consider choosing the first network to produce three
L02323: Problem 4.1
L02324: alternating regions of positive and negative slope (figure 4.1b). This means that three
L02325: different ranges of x are mapped to the same output range y ∈[−1, 1], and the subsequent
L02326: mapping from this range of y to y′ is applied three times. The overall effect is that the
L02327: Notebook 4.1
L02328: Composing
L02329: networks
L02330: function defined by the second network is duplicated three times to create nine linear
L02331: regions. The same principle applies in higher dimensions (figure 4.2).
L02332: A different way to think about composing networks is that the first network “folds”
L02333: the input space x back onto itself so that multiple inputs generate the same output.
L02334: Then the second network applies a function, which is replicated at all points that were
L02335: folded on top of one another (figure 4.3).
L02336: 4.2
L02337: From composing networks to deep networks
L02338: The previous section showed that we could create complex functions by passing the
L02339: output of one shallow neural network into a second network. We now show that this is
L02340: a special case of a deep network with two hidden layers.
L02341: The output of the first network (y = ϕ0 + ϕ1h1 + ϕ2h2 + ϕ3h3) is a linear combina-
L02342: tion of the activations at the hidden units. The first operations of the second network
L02343: (equation 4.3 in which we calculate θ′
L02344: 10 + θ′
L02345: 11y, θ′
L02346: 20 + θ′
L02347: 21y, and θ′
L02348: 30 + θ′
L02349: 31y) are linear in
L02350: the output of the first network. Applying one linear function to another yields another
L02351: linear function. Substituting the expression for y into equation 4.3 gives:
L02352: h′
L02353: 1
L02354: =
L02355: a[θ′
L02356: 10 + θ′
L02357: 11y]
L02358: =
L02359: a[θ′
L02360: 10 + θ′
L02361: 11ϕ0 + θ′
L02362: 11ϕ1h1 + θ′
L02363: 11ϕ2h2 + θ′
L02364: 11ϕ3h3]
L02365: h′
L02366: 2
L02367: =
L02368: a[θ′
L02369: 20 + θ′
L02370: 21y]
L02371: =
L02372: a[θ′
L02373: 20 + θ′
L02374: 21ϕ0 + θ′
L02375: 21ϕ1h1 + θ′
L02376: 21ϕ2h2 + θ′
L02377: 21ϕ3h3]
L02378: h′
L02379: 3
L02380: =
L02381: a[θ′
L02382: 30 + θ′
L02383: 31y]
L02384: =
L02385: a[θ′
L02386: 30 + θ′
L02387: 31ϕ0 + θ′
L02388: 31ϕ1h1 + θ′
L02389: 31ϕ2h2 + θ′
L02390: 31ϕ3h3], (4.5)
L02391: which we can rewrite as:
L02392: h′
L02393: 1
L02394: =
L02395: a[ψ10 + ψ11h1 + ψ12h2 + ψ13h3]
L02396: h′
L02397: 2
L02398: =
L02399: a[ψ20 + ψ21h1 + ψ22h2 + ψ23h3]
L02400: h′
L02401: 3
L02402: =
L02403: a[ψ30 + ψ31h1 + ψ32h2 + ψ33h3],
L02404: (4.6)
L02405: Draft: please send errata to udlbookmail@gmail.com.
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
