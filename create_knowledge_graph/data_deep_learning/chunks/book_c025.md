L15385: <!-- page 318 -->
L15386: Chapter 16
L15387: Normalizing flows
L15388: Chapter 15 introduced generative adversarial networks (GANs). These are generative
L15389: models that pass a latent variable through a deep network to create a new sample. GANs
L15390: are trained using the principle that the samples should be indistinguishable from real
L15391: data. However, they don’t define a distribution over data examples. Hence, assessing
L15392: the probability that a new example belongs to the same dataset isn’t straightforward.
L15393: In this chapter, we describe normalizing flows. These learn a probability model by
L15394: transforming a simple distribution into a more complicated one using a deep network.
L15395: Normalizing flows can both sample from this distribution and evaluate the probability
L15396: of new examples. However, they require specialized architecture: each layer must be
L15397: invertible. In other words, it must be able to transform data in both directions.
L15398: 16.1
L15399: 1D example
L15400: Normalizing flows are probabilistic generative models: they fit a probability distribution
L15401: to training data (figure 14.2b). Consider modeling a 1D distribution Pr(x). Normalizing
L15402: flows start with a simple tractable base distribution Pr(z) over a latent variable z and
L15403: apply a function x = f[z, ϕ], where the parameters ϕ are chosen so that Pr(x) has the
L15404: desired distribution (figure 16.1). Generating a new example x∗is easy; we draw z∗from
L15405: the base density and pass this through the function so that x∗= f[z∗, ϕ].
L15406: 16.1.1
L15407: Measuring probability
L15408: Measuring the probability of a data point x is more challenging. Consider applying a
L15409: function f[z, ϕ] to random variable z with known density Pr(z). The probability density
L15410: will decrease in areas that are stretched by the function and increase in areas that are
L15411: compressed so that the area under the new distribution remains one. The degree to
L15412: which a function f[z, ϕ] stretches or compresses its input depends on the magnitude of
L15413: its gradient. If a small change to the input causes a larger change in the output, it
L15414: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L15417: <!-- page 319 -->
L15418: 16.1
L15419: 1D example
L15420: 305
L15421: Figure 16.1 Transforming probability distributions.
L15422: a) The base density is a
L15423: standard normal defined on a latent variable z. b) This variable is transformed
L15424: by a function x = f[z, ϕ] to a new variable x, which c) has a new distribution. To
L15425: sample from this model, we draw values z from the base density (green and brown
L15426: arrows in panel (a) show two examples). We pass these through the function f[z, ϕ]
L15427: as shown by dotted arrows in panel (b) to generate the values of x, which are
L15428: indicated as arrows in panel (c).
L15429: Figure 16.2 Transforming distributions. The base density (cyan, bottom) passes
L15430: through a function (blue curve, top right) to create the model density (orange,
L15431: left). Consider dividing the base density into equal intervals (gray vertical lines).
L15432: The probability mass between adjacent lines must remain the same after transfor-
L15433: mation. The cyan-shaded region passes through a part of the function where the
L15434: gradient is larger than one, so this region is stretched. Consequently, the height
L15435: of the orange-shaded region must be lower so that it retains the same area as the
L15436: cyan-shaded region. In other places (e.g., z = −2), the gradient is less than one,
L15437: and the model density increases relative to the base density.
L15438: Draft: please send errata to udlbookmail@gmail.com.
L15441: <!-- page 320 -->
L15442: 306
L15443: 16
L15444: Normalizing flows
L15445: Figure 16.3 Inverse mapping (normalizing direction). If the function is invertible,
L15446: then it’s possible to transform the model density back to the original base density.
L15447: The probability of a point x under the model density depends partly on the
L15448: probability of the equivalent point z under the base density (see equation 16.1).
L15449: stretches the function. If a small change to the input causes a smaller change in the
L15450: output, it compresses the function (figure 16.2).
L15451: More precisely, the probability of data x under the transformed distribution is:
L15452: Pr(x|ϕ)
L15453: =
L15459: ∂f[z, ϕ]
L15460: ∂z
L15466: −1
L15467: · Pr(z),
L15468: (16.1)
L15469: where z = f−1[x, ϕ] is the latent variable that created x. The term Pr(z) is the original
L15470: Notebook 16.1
L15471: 1D normalizing
L15472: flows
L15473: probability of this latent variable under the base density. This is moderated according
L15474: to the magnitude of the derivative of the function. If this is greater than one, then the
L15475: probability decreases. If it is smaller, the probability increases.
L15476: 16.1.2
L15477: Forward and inverse mappings
L15478: To draw samples from the distribution, we need the forward mapping x = f[z, ϕ], but to
L15479: measure the likelihood, we need to compute the inverse z = f−1[x, ϕ]. Hence, we need
L15480: to choose f[z, ϕ] judiciously so that it is invertible.
L15481: Problems 16.1–16.2
L15482: The forward mapping is sometimes termed the generative direction. The base density
L15483: is usually chosen to be a standard normal distribution. Hence, the inverse mapping is
L15484: termed the normalizing direction since this takes the complex distribution over x and
L15485: turns it into a normal distribution over z (figure 16.3).
L15486: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L15489: <!-- page 321 -->
L15490: 16.2
L15491: General case
L15492: 307
L15493: 16.1.3
L15494: Learning
L15495: To learn the distribution, we find parameters ϕ that maximize the likelihood of the
L15496: training data {xi}I
L15497: i=1 or equivalently minimize the negative log-likelihood:
L15498: ˆϕ
L15499: =
L15500: argmax
L15501: ϕ
L15502: " IY
L15503: i=1
L15504: Pr(xi|ϕ)
L15505: #
L15506: =
L15507: argmin
L15508: ϕ
L15509: " I
L15510: X
L15511: i=1
L15512: −log
L15513: h
L15514: Pr(xi|ϕ)
L15515: i#
L15516: =
L15517: argmin
L15518: ϕ
L15519: " I
L15520: X
L15521: i=1
L15522: log
L15523: "
L15528: ∂f[zi, ϕ]
L15529: ∂zi
L15535: #
L15536: −log
L15537: 
L15538: Pr(zi)
L15539: 
L15540: #
L15541: ,
L15542: (16.2)
L15543: where we have assumed that the data are independent and identically distributed in the
L15544: first line and used the likelihood definition from equation 16.1 in the third line.
L15545: 16.2
L15546: General case
L15547: The previous section developed a simple 1D example that modeled a probability dis-
L15548: tribution Pr(x) by transforming a simpler base density Pr(z). We now extend this to
L15549: multivariate distributions Pr(x) and Pr(z) and add the complication that the transfor-
L15550: mation is defined by a deep neural network.
L15551: Consider applying a function x = f[z, ϕ] to a random variable z ∈RD with base
L15552: density Pr(z), where
L15553: f[z, ϕ] is a deep network. The resulting variable x ∈RD has a
L15554: new distribution. A new sample x∗can be drawn from this distribution by (i) drawing
L15555: a sample z∗from the base density and (ii) passing this through the neural network so
L15556: that x∗= f[z∗, ϕ].
L15557: By analogy with equation 16.1, the likelihood of a sample under this distribution is:
L15558: Pr(x|ϕ) =
L15564: ∂f[z, ϕ]
L15565: ∂z
L15571: −1
L15572: · Pr(z),
L15573: (16.3)
L15574: where z = f −1[x, ϕ] is the latent variable z that created x.
L15575: The first term is the
L15576: inverse of the determinant of the D × D Jacobian matrix ∂f[z, ϕ]/∂z, which contains
L15577: Appendix B.3.8
L15578: Determinant
L15579: Appendix B.5
L15580: Jacobian
L15581: elements ∂fj[z, ϕ]/∂zi at position (i, j). Just as the absolute derivative measured the
L15582: change of area at a point on a 1D function when the function was applied, the absolute
L15583: determinant measures the change in volume at a point in the multivariate function. The
L15584: second term is the probability of the latent variable under the base density.
L15585: Draft: please send errata to udlbookmail@gmail.com.
L15588: <!-- page 322 -->
L15589: 308
L15590: 16
L15591: Normalizing flows
L15592: Figure 16.4 Forward and inverse mappings for a deep neural network. The base
L15593: density (left) is gradually transformed by the network layers f1[•, ϕ1], f2[•, ϕ2], . . .
L15594: to create the model density. Each layer is invertible, and we can equivalently
L15595: think of the inverse of the layers as gradually transforming (or “flowing”) the
L15596: model density back to the base density.
L15597: 16.2.1
L15598: Forward mapping with a deep neural network
L15599: In practice, the forward mapping f[z, ϕ] is usually defined by a neural network, consisting
L15600: of a series of layers fk[•, ϕk] with parameters ϕk, which are composed together as:
L15601: x = f[z, ϕ] = fK
L15602: 
L15603: fK−1
L15604: h
L15605: . . . f2
L15606: 
L15607: f1[z, ϕ1], ϕ2
L15608: 
L15609: , . . . ϕK−1
L15610: i
L15611: , ϕK
L15612: 
L15613: .
L15614: (16.4)
L15615: The inverse mapping (normalizing direction) is defined by the composition of the inverse
L15616: of each layer f−1
L15617: k [•, ϕk] applied in the opposite order:
L15618: z = f−1[x, ϕ] = f−1
L15619: 1
L15620: 
L15621: f−1
L15622: 2
L15623: h
L15624: . . . f−1
L15625: K−1
L15626: 
L15627: f−1
L15628: K [x, ϕK], ϕK−1
L15629: 
L15630: , . . . ϕ2
L15631: i
L15632: , ϕ1
L15633: 
L15634: .
L15635: (16.5)
L15636: The base density Pr(z) is usually defined as a multivariate standard normal (i.e., with
L15637: mean zero and identity covariance). Hence, the effect of each subsequent inverse layer is
L15638: to gradually move or “flow” the data density toward this normal distribution (figure 16.4).
L15639: This gives rise to the name “normalizing flows.”
L15640: The Jacobian of the forward mapping can be expressed as:
L15641: ∂f[z, ϕ]
L15642: ∂z
L15643: = ∂f1[z, ϕ1]
L15644: ∂z
L15645: · ∂f2[f1, ϕ2]
L15646: ∂f1
L15647: . . . ∂fK−1[fK−2, ϕK−1]
L15648: ∂fK−2
L15649: . . . ∂fK[fK−1, ϕK]
L15650: ∂fK−1
L15651: ,
L15652: (16.6)
L15653: where we have overloaded the notation to make fk the output of the function fk[•, ϕk].
L15654: The absolute determinant of this Jacobian can be computed by taking the product of
L15655: the individual absolute determinants:
L15656: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L15659: <!-- page 323 -->
L15660: 16.3
L15661: Invertible network layers
L15662: 309
L15668: ∂f[z, ϕ]
L15669: ∂z
L15674:  =
L15680: ∂f1[z, ϕ1]
L15681: ∂z
L15686:  ·
L15692: ∂f2[f1, ϕ2]
L15693: ∂f1
L15698:  . . .
L15704: ∂fK−1[fK−2, ϕK−1]
L15705: ∂fK−2
L15710:  ·
L15716: ∂fK[fK−1, ϕK]
L15717: ∂fK−1
L15722:  .
L15723: (16.7)
L15724: The absolute determinant of the Jacobian of the inverse mapping is found by applying
L15725: Problem 16.3
L15726: the same rule to equation 16.5. It is the reciprocal of the absolute determinant in the
L15727: forward mapping.
L15728: We train normalizing flows with a dataset {xi} of I training examples using the
L15729: negative log-likelihood criterion:
L15730: ˆϕ
L15731: =
L15732: argmax
L15733: ϕ
L15734: " IY
L15735: i=1
L15736: Pr(zi) ·
L15742: ∂f[zi, ϕ]
L15743: ∂zi
L15749: −1#
L15750: =
L15751: argmin
L15752: ϕ
L15753: " I
L15754: X
L15755: i=1
L15756: log
L15757: "
L15762: ∂f[zi, ϕ]
L15763: ∂zi
L15769: #
L15770: −log
L15771: 
L15772: Pr(zi)
L15773: 
L15774: #
L15775: ,
L15776: (16.8)
L15777: where zi = f−1[xi, ϕ], Pr(zi) is measured under the base distribution, and the absolute
L15778: determinant |∂f[zi, ϕ]/∂zi| is given by equation 16.7.
L15779: 16.2.2
L15780: Desiderata for network layers
L15781: The theory of normalizing flows is straightforward. However, for this to be practical, we
L15782: need neural network layers fk that have four properties.
L15783: 1. Collectively, the set of network layers must be suﬀiciently expressive to map a
L15784: multivariate standard normal distribution to an arbitrary density.
L15785: 2. The network layers must be invertible; each must define a unique one-to-one map-
L15786: ping from any input point to an output point (a bijection). If multiple inputs were
L15787: Appendix B.1
L15788: Bijection
L15789: mapped to the same output, the inverse would be ambiguous.
L15790: 3. It must be possible to compute the inverse of each layer eﬀiciently.
L15791: We need
L15792: to do this every time we evaluate the likelihood. This happens repeatedly during
L15793: training, so there must be a closed-form solution or a fast algorithm for the inverse.
L15794: 4. It also must be possible to evaluate the determinant of the Jacobian eﬀiciently for
L15795: either the forward or inverse mapping.
L15796: 16.3
L15797: Invertible network layers
L15798: We now describe different invertible network layers or flows for use in these models.
L15799: We start with linear and elementwise flows. These are easy to invert, and it’s possible
L15800: to compute the determinant of their Jacobians, but neither is suﬀiciently expressive to
L15801: describe arbitrary transformations of the base density. However, they form the building
L15802: blocks of coupling, autoregressive, and residual flows, which are all more expressive.
L15803: Draft: please send errata to udlbookmail@gmail.com.
L15806: <!-- page 324 -->
L15807: 310
L15808: 16
L15809: Normalizing flows
L15810: 16.3.1
L15811: Linear flows
L15812: A linear flow has the form f[h] = β + Ωh.
L15813: If the matrix Ωis invertible, the linear
L15814: transform is invertible. For Ω∈RD×D, the computation of the inverse is O[D3]. The
L15815: Appendix A
L15816: Big O notation
L15817: determinant of the Jacobian is just the determinant of Ω, which can also be computed
L15818: in O[D3]. This means that linear flows become expensive as the dimension D increases.
L15819: If the matrix Ωtakes a special form, then inversion and computation of the deter-
L15820: Appendix B.4
L15821: Matrix types
L15822: minant can become more eﬀicient, but the transformation becomes less general. For
L15823: example, diagonal matrices require only O[D] computation for the inversion and deter-
L15824: minant, but the elements of h don’t interact. Orthogonal matrices are also more eﬀicient
L15825: Problem 16.4
L15826: to invert, and their determinant is fixed, but they do not allow scaling of the individual
L15827: dimensions. Triangular matrices are more practical; they are invertible using a process
L15828: known as back-substitution, which is O[D2], and the determinant is just the product of
L15829: the diagonal values.
L15830: One way to make a linear flow that is general, eﬀicient to invert, and for which the
L15831: Jacobian can be computed eﬀiciently is to parameterize it directly in terms of the LU
L15832: decomposition. In other words, we use:
L15833: Ω= PL(U + D),
L15834: (16.9)
L15835: where P is a predetermined permutation matrix, L is a lower triangular matrix, U is
L15836: an upper triangular matrix with zeros on the diagonal, and D is a diagonal matrix that
L15837: supplies those missing diagonal elements. This can be inverted in O[D2], and the log
L15838: determinant is just the sum of the log of the absolute values on the diagonals of L and D.
L15839: Unfortunately, linear flows are not suﬀiciently expressive.
L15840: When a linear func-
L15841: tion f[h] = β + Ωh is applied to normally distributed input Normh[µ, Σ], then the
L15842: result is also normally distributed with mean and variance, β + Ωµ and ΩΣΩT , respec-
L15843: Problems 16.5–16.6
L15844: tively. Hence, it is not possible to map a normal distribution to an arbitrary density
L15845: using linear flows alone.
L15846: 16.3.2
L15847: Elementwise flows
L15848: Since linear flows are not suﬀiciently expressive, we must turn to nonlinear flows. The
L15849: simplest of these are elementwise flows, which apply a pointwise nonlinear function f[•, ϕ]
L15850: with parameters ϕ to each element of the input so that:
L15851: f[h] =
L15852: h
L15853: f[h1, ϕ], f[h2, ϕ], . . . f[hD, ϕ]
L15854: iT
L15855: .
L15856: (16.10)
L15857: The Jacobian ∂f[h]/∂h is diagonal since the dth input to f[h] only affects the dth output.
L15858: Its determinant is the product of the entries on the diagonal, so:
L15864: ∂f[h]
L15865: ∂h
L15870:  =
L15871: D
L15872: Y
L15873: d=1
L15879: ∂f[hd]
L15880: ∂hd
L15885:  .
L15886: (16.11)
L15887: The function f[•, ϕ] could be a fixed invertible nonlinearity like the leaky ReLU
L15888: (figure 3.13), in which case there are no parameters, or it may be any parameterized
L15889: Problem 16.7
L15890: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L15893: <!-- page 325 -->
L15894: 16.3
L15895: Invertible network layers
L15896: 311
L15897: Figure 16.5 Piecewise linear mapping.
L15898: An invertible piecewise linear map-
L15899: ping h′ = f[h, ϕ] can be created by dividing the input domain h ∈[0, 1] into K
L15900: equally sized regions (here K = 5). Each region has a slope with parameter, ϕk.
L15901: a) If these parameters are positive and sum to one, then b) the function will be
L15902: invertible and map to the output domain h′ ∈[0, 1].
L15903: invertible one-to-one mapping. A simple example is a piecewise linear function with K
L15904: regions (figure 16.5) which maps [0, 1] to [0, 1] as:
L15905: f[h, ϕ] =
L15906:  b−1
L15907: X
L15908: k=1
L15909: ϕk
L15910: !
L15911: + (hK −b + 1)ϕb,
L15912: (16.12)
L15913: where the parameters ϕ1, ϕ2, . . . , ϕK are positive and sum to 1, and b = ⌊Kh⌋+ 1 is the
L15914: index of the bin that contains h. The first term is the sum of all the preceding bins, and
L15915: the second term represents the proportion of the way through the current bin that h lies.
L15916: This function is easy to invert, and its gradient can be calculated almost everywhere.
L15917: Problems 16.8–16.9
L15918: There are many similar schemes for creating smooth functions, often using splines with
L15919: parameters that ensure the function is monotonic and hence invertible.
L15920: Elementwise flows are nonlinear but don’t mix input dimensions, so they can’t create
L15921: correlations between variables. When alternated with linear flows (which do mix dimen-
L15922: sions), more complex transformations can be modeled. However, in practice, elementwise
L15923: flows are used as components of more complex layers like coupling flows.
L15924: 16.3.3
L15925: Coupling flows
L15926: Coupling flows divide the input h into two parts so that h = [hT
L15927: 1 , hT
L15928: 2 ]T and define the
L15929: flow f[h, ϕ] as:
L15930: Draft: please send errata to udlbookmail@gmail.com.
L15933: <!-- page 326 -->
L15934: 312
L15935: 16
L15936: Normalizing flows
L15937: Figure 16.6 Coupling flows.
L15938: a) The input (orange vector) is divided into h1
L15939: and h2. The first part h′
L15940: 1 of the output (cyan vector) is a copy of
L15941: h1. The
L15942: output h′
L15943: 2 is created by applying an invertible transformation g[•, ϕ] to h2, where
L15944: the parameters ϕ are themselves a (not necessarily invertible) function of h1. b)
L15945: In the inverse mapping, h1 = h′
L15946: 1. This allows us to calculate the parameters ϕ[h1]
L15947: and then apply the inverse g−1[h′
L15948: 2, ϕ] to retrieve h2.
L15949: h′
L15950: 1
L15951: =
L15952: h1
L15953: h′
L15954: 2
L15955: =
L15956: g
L15957: h
L15958: h2, ϕ[h1]
L15959: i
L15960: .
L15961: (16.13)
L15962: Here g[•, ϕ] is an elementwise flow (or other invertible layer) with parameters ϕ[h1] that
L15963: are themselves a nonlinear function of the inputs h1 (figure 16.6). The function ϕ[•] is
L15964: usually a neural network of some kind and does not have to be invertible. The original
L15965: variables can be recovered as:
L15966: h1
L15967: =
L15968: h′
L15969: 1
L15970: h2
L15971: =
L15972: g−1h
L15973: h′
L15974: 2, ϕ[h1]
L15975: i
L15976: .
L15977: (16.14)
L15978: If the function g[•, ϕ] is an elementwise flow, the Jacobian will be lower triangular
L15979: with the identity matrix in the top-left quadrant and the derivatives of the elementwise
L15980: transformation in the bottom-right. Its determinant is the product of these diagonal
L15981: values.
L15982: The inverse and Jacobian can be computed eﬀiciently, but this approach only trans-
L15983: forms the second half of the parameters in a way that depends on the first half. To make
L15984: a more general transformation, the elements of h are randomly shuffled using permuta-
L15985: Appendix B.4.4
L15986: Permutation matrix
L15987: tion matrices between layers, so every variable is ultimately transformed by every other.
L15988: In practice, these permutation matrices are diﬀicult to learn. Hence, they are initialized
L15989: randomly and then frozen. For structured data like images, the channels are divided into
L15990: two halves h1 and h2 and permuted between layers using 1×1 convolutions.
L15991: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L15994: <!-- page 327 -->
L15995: 16.3
L15996: Invertible network layers
L15997: 313
L15998: Figure 16.7 Autoregressive flows. The input h (orange column) and output h′
L15999: (cyan column) are split into their constituent dimensions (here four dimensions).
L16000: a) Output h′
L16001: 1 is an invertible transformation of input h1. Output h′
L16002: 2 is an in-
L16003: vertible function of input h2 where the parameters depend on h1. Output h′
L16004: 3
L16005: is an invertible function of input h3 where the parameters depend on previous
L16006: inputs h1 and h2, and so on. None of the outputs depend on one another, so
L16007: they can be computed in parallel. b) The inverse of the autoregressive flow is
L16008: computed using a similar method as for coupling flows. However, notice that to
L16009: compute h2 we must already know h1, to compute h3, we must already know h1
L16010: and h2, and so on. Consequently, the inverse cannot be computed in parallel.
L16011: 16.3.4
L16012: Autoregressive flows
L16013: Autoregressive flows are a generalization of coupling flows that treat each input dimension
L16014: as a separate “block” (figure 16.7). They compute the dth dimension of the output h′
L16015: based on the first d−1 dimensions of the input h:
L16016: h′
L16017: d = g
L16018: h
L16019: hd, ϕ[h1:d−1]
L16020: i
L16021: .
L16022: (16.15)
L16023: The function g[•, •] is termed the transformer, 1 and the parameters ϕ, ϕ[h1], ϕ[h1, h2], . . .
L16024: are termed conditioners. As for coupling flows, the transformer g[•, ϕ] must be invert-
L16025: ible, but the conditioners ϕ[•] can take any form and are usually neural networks. If the
L16026: transformer and conditioner are suﬀiciently flexible, autoregressive flows are universal
L16027: approximators in that they can represent any probability distribution.
L16028: It’s possible to compute all of the entries of the output h′ in parallel using a network
L16029: with appropriate masks so that the parameters ϕ at position d only depend on previous
L16030: 1This is nothing to do with the transformer layers discussed in chapter 12.
L16031: Draft: please send errata to udlbookmail@gmail.com.
L16034: <!-- page 328 -->
L16035: 314
L16036: 16
L16037: Normalizing flows
L16038: positions. This is known as a masked autoregressive flow. The principle is very similar to
L16039: masked self-attention (section 12.7.2); connections that relate inputs to previous outputs
L16040: are pruned.
L16041: Inverting the transformation is less eﬀicient. Consider the forward mapping:
L16042: h′
L16043: 1
L16044: =
L16045: g
L16046: h
L16047: h1, ϕ
L16048: i
L16049: h′
L16050: 2
L16051: =
L16052: g
L16053: h
L16054: h2, ϕ[h1]
L16055: i
L16056: h′
L16057: 3
L16058: =
L16059: g
L16060: h
L16061: h3, ϕ[h1:2]
L16062: i
L16063: h′
L16064: 4
L16065: =
L16066: g
L16067: h
L16068: h4, ϕ[h1:3]
L16069: i
L16070: .
L16071: (16.16)
L16072: This must be inverted sequentially using a similar principle as for coupling flows:
L16073: h1
L16074: =
L16075: g−1h
L16076: h′
L16077: 1, ϕ
L16078: i
L16079: h2
L16080: =
L16081: g−1h
L16082: h′
L16083: 2, ϕ[h1]
L16084: i
L16085: h3
L16086: =
L16087: g−1h
L16088: h′
L16089: 3, ϕ[h1:2]
L16090: i
L16091: h4
L16092: =
L16093: g−1h
L16094: h′
L16095: 4, ϕ[h1:3]
L16096: i
L16097: .
L16098: (16.17)
L16099: This can’t be done in parallel as the computation for hd depends on h1:d−1 (i.e., the
L16100: Notebook 16.2
L16101: Autoregressive flows
L16102: partial results so far). Hence, inversion is time-consuming when the input is large.
L16103: 16.3.5
L16104: Inverse autoregressive flows
L16105: Masked autoregressive flows are defined in the normalizing (inverse) direction. This is
L16106: required to evaluate the likelihood eﬀiciently and hence to learn the model. However,
L16107: sampling requires the forward direction, in which each variable must be computed se-
L16108: quentially at each layer, which is slow. If we use an autoregressive flow for the forward
L16109: (generative) transformation, then sampling is eﬀicient, but computing the likelihood (and
L16110: training) is slow. This is known as an inverse autoregressive flow.
L16111: A trick that allows fast learning and also fast (but approximate) sampling is to
L16112: build a masked autoregressive flow to learn the distribution (the teacher) and then use
L16113: this to train an inverse autoregressive flow from which we can sample eﬀiciently (the
L16114: student).
L16115: This requires a different formulation of normalizing flows that learns from
L16116: another function rather than a set of samples (see section 16.5.3).
L16117: 16.3.6
L16118: Residual flows: iRevNet
L16119: Residual flows take their inspiration from residual networks. They divide the input into
L16120: two parts h = [hT
L16121: 1 , hT
L16122: 2 ]T (as for coupling flows) and define the outputs as:
L16123: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L16126: <!-- page 329 -->
L16127: 16.3
L16128: Invertible network layers
L16129: 315
L16130: Figure 16.8 Residual flows. a) An invertible function is computed by splitting the
L16131: input into h1 and h2 and creating two residual layers. In the first, h2 is processed
L16132: and h1 is added. In the second, the result is processed, and h2 is added. b) In
L16133: the reverse mechanism the functions are computed in the opposite order, and the
L16134: addition operation becomes subtraction.
L16135: h′
L16136: 1
L16137: =
L16138: h1 + f1[h2, ϕ1]
L16139: h′
L16140: 2
L16141: =
L16142: h2 + f2[h′
L16143: 1, ϕ2],
L16144: (16.18)
L16145: where f1[•, ϕ1] and f2[•, ϕ2] are two functions that do not necessarily have to be invertible
L16146: (figure 16.8). The inverse can be computed by reversing the order of computation:
L16147: h2
L16148: =
L16149: h′
L16150: 2 −f2[h′
L16151: 1, ϕ2]
L16152: h1
L16153: =
L16154: h′
L16155: 1 −f1[h2, ϕ1].
L16156: (16.19)
L16157: As for coupling flows, the division into blocks restricts the family of transformations
L16158: that can be represented. Hence, the inputs are permuted between layers so that the
L16159: variables can mix in arbitrary ways.
L16160: This formulation can be inverted easily, but for general functions f1[•, ϕ1] and f2[•, ϕ2],
L16161: there is no eﬀicient way to compute the Jacobian. This formulation is sometimes used to
L16162: Problem 16.10
L16163: save memory when training residual networks; because the network is invertible, storing
L16164: the activations at each layer in the forward pass is unnecessary.
L16165: 16.3.7
L16166: Residual flows and contraction mappings: iResNet
L16167: A different approach to exploiting residual networks is to utilize the Banach fixed point
L16168: theorem or contraction mapping theorem, which states that every contraction mapping
L16169: has a fixed point. A contraction mapping f[•] has the property that:
L16170: Draft: please send errata to udlbookmail@gmail.com.
L16173: <!-- page 330 -->
L16174: 316
L16175: 16
L16176: Normalizing flows
L16177: Figure 16.9 Contraction mappings. If a function has an absolute slope of less
L16178: than one everywhere, iterating the function converges to a fixed point f[z] = z. a)
L16179: Starting at z0, we evaluate z1 = f[z0]. We then pass z1 back into the function and
L16180: iterate. Eventually, the process converges to the point where f[z] = z (i.e., where
L16181: the function crosses the dashed diagonal identity line). b) This can be used to
L16182: invert equations of the form y = z + f[z] for a value y∗by noticing that the fixed
L16183: point of y∗−f[z] (where the orange line crosses the dashed identity line) is at
L16184: the same position as where y∗= z + f[z].
L16185: dist
L16186: h
L16187: f[z′], f[z]
L16188: i
L16189: < β · dist
L16190: h
L16191: z′, z
L16192: i
L16193: ∀z, z′,
L16194: (16.20)
L16195: where dist[•, •] is a distance function and 0 < β < 1. When a function with this property
L16196: is iterated (i.e., the output is repeatedly passed back in as an input), the result converges
L16197: Notebook 16.3
L16198: Contraction mappings
L16199: to a fixed point where f[z] = z (figure 16.9). To understand this, consider applying the
L16200: function to both the fixed point and the current position; the fixed point remains static,
L16201: but the distance between the two must become smaller, so the current position must get
L16202: closer to the fixed point.
L16203: This theorem can be exploited to invert an equation of the form:
L16204: y = z + f[z]
L16205: (16.21)
L16206: if f[z] is a contraction mapping. In other words, it can be used to find the z∗that maps
L16207: to a given value, y∗. This can be done by starting with any point z0 and iterating zk+1 =
L16208: y∗−f[zk]. This has a fixed point at z + f[z] = y∗(figure 16.9b).
L16209: The same principle can be used to invert residual network layers of the form h′ =
L16210: h+f[h, ϕ] if we ensure that f[h, ϕ] is a contraction mapping. In practice, this means that
L16211: Appendix B.1.1
L16212: Lipschitz constant
L16213: the Lipschitz constant must be less than one. Assuming that the slope of the activation
L16214: Appendix B.3.7
L16215: Singular values
L16216: functions is not greater than one, this is equivalent to ensuring the largest singular value
L16217: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L16220: <!-- page 331 -->
L16221: 16.4
L16222: Multi-scale flows
L16223: 317
L16224: of each weight matrix Ωmust be less than one. A crude way to do this is to ensure that
L16225: the absolute magnitudes of the weights Ωare small by clipping them.
L16226: The Jacobian determinant cannot be computed easily, but its logarithm can be ap-
L16227: proximated using a series of tricks.
L16228: log
L16229: "
L16233: I + ∂f[h, ϕ]
L16234: ∂h
L16240: #
L16241: =
L16242: trace
L16243: "
L16244: log
L16245: 
L16246: I + ∂f[h, ϕ]
L16247: ∂h
L16248: #
L16249: =
L16250: ∞
L16251: X
L16252: k=1
L16253: (−1)k−1
L16254: k
L16255: trace
L16256: "
L16257: ∂f[h, ϕ]
L16258: ∂h
L16259: #k
L16260: ,
L16261: (16.22)
L16262: where we have used the identity log[|A|] = trace[log[A]] in the first line and expanded
L16263: this into a power series in the second line.
L16264: Even when we truncate this series, it’s still computationally expensive to compute
L16265: Appendix B.3.8
L16266: Trace
L16267: the trace of the constituent terms. Hence, we approximate this using Hutchinson’s trace
L16268: estimator. Consider a normal random variable ϵ with mean 0 and variance I. The trace
L16269: of a matrix A can be estimated as:
L16270: trace[A]
L16271: =
L16272: trace
L16273: 
L16274: AE
L16275: 
L16276: ϵϵT 
L16277: =
L16278: trace
L16279: 
L16280: E
L16281: 
L16282: AϵϵT 
L16283: =
L16284: E
L16285: 
L16286: trace
L16287: 
L16288: AϵϵT 
L16289: =
L16290: E
L16291: 
L16292: trace
L16293: 
L16294: ϵT Aϵ
L16295: 
L16296: =
L16297: E
L16298: 
L16299: ϵT Aϵ
L16300: 
L16301: ,
L16302: (16.23)
L16303: where the first line is true because E[ϵϵT ] = I. The second line derives from the properties
L16304: of the expectation operator. The third line comes from the linearity of the trace operator.
L16305: The fourth line is due to the invariance of the trace to cyclic permutation. The final line
L16306: is true because the argument in the fourth line is now a scalar. We estimate the trace
L16307: by drawing samples ϵi from Pr(ϵ):
L16308: trace[A]
L16309: =
L16310: E
L16311: 
L16312: ϵT Aϵ
L16313: 
L16314: ≈
L16315: 1
L16316: I
L16317: I
L16318: X
L16319: i=1
L16320: ϵT
L16321: i Aϵi.
L16322: (16.24)
L16323: In this way, we can approximate the trace of the powers of the Taylor expansion (equa-
L16324: tion 16.22) and evaluate the log probability.
L16325: 16.4
L16326: Multi-scale flows
L16327: In normalizing flows, the latent space z must be the same size as the data space x, but
L16328: we know that natural datasets can often be described by fewer underlying variables. At
L16329: Draft: please send errata to udlbookmail@gmail.com.
L16332: <!-- page 332 -->
L16333: 318
L16334: 16
L16335: Normalizing flows
L16336: Figure 16.10 Multiscale flows. The latent space z must be the same size as the
L16337: model density in normalizing flows. However, it can be partitioned into several
L16338: components, which can be gradually introduced at different layers. This makes
L16339: both density estimation and sampling faster. For the inverse process, the black
L16340: arrows are reversed, and the last part of each block skips the remaining processing.
L16341: For example, f−1
L16342: 3 [•, ϕ3] only operates on the first three blocks, and the fourth
L16343: block becomes z4 and is assessed against the base density.
L16344: some point, we have to introduce all of these variables, but it is ineﬀicient to pass them
L16345: through the entire network. This leads to the idea of multi-scale flows (figure 16.10).
L16346: In the generative direction, multi-scale flows partition the latent vector into z =
L16347: [z1, z2, . . . , zN]. The first partition z1 is processed by a series of reversible layers with
L16348: the same dimension as z1 until, at some point, z2 is appended and combined with the
L16349: first partition. This continues until the network is the same size as the data x. In the
L16350: normalizing direction, the network starts at the full dimension of x, but when it reaches
L16351: the point where zn was added, this is assessed against the base distribution.
L16352: 16.5
L16353: Applications
L16354: We now describe three applications of normalizing flows. First, we consider modeling
L16355: probability densities. Second, we consider the GLOW model for synthesizing images.
L16356: Finally, we discuss using normalizing flows to approximate other distributions.
L16357: 16.5.1
L16358: Modeling densities
L16359: Of the four generative models discussed in this book, normalizing flows is the only model
L16360: that can compute the exact log-likelihood of a new sample.
L16361: Generative adversarial
L16362: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L16365: <!-- page 333 -->
L16366: 16.5
L16367: Applications
L16368: 319
L16369: Figure 16.11 Modeling densities. a) Toy 2D data samples. b) Modeled density
L16370: using iResNet. c–d) Second example. Adapted from Behrmann et al. (2019)
L16371: networks are not probabilistic, and both variational autoencoders and diffusion models
L16372: can only return a lower bound on the likelihood.2 Figure 16.11 depicts the estimated
L16373: probability distributions in two toy problems using i-ResNet. One application of density
L16374: estimation is anomaly detection; the data distribution of a clean dataset is described
L16375: using a normalizing flow model.
L16376: New examples with low probability are flagged as
L16377: outliers. However, caution must be used as there may exist outliers with high probability
L16378: that don’t fall in the typical set (see figure 8.13).
L16379: 16.5.2
L16380: Synthesis
L16381: Generative flows, or GLOW, is a normalizing flow model that can create high-fidelity
L16382: images (figure 16.12) and uses many of the ideas from this chapter. It is easiest under-
L16383: stood in the normalizing direction. GLOW starts with a 256 × 256 × 3 tensor containing
L16384: an RGB image. It uses coupling layers, in which the channels are partitioned into two
L16385: halves. The second half is subject to a different aﬀine transform at each spatial position,
L16386: where the parameters of the aﬀine transformation are computed by a 2D convolutional
L16387: neural network run on the other half of the channels. The coupling layers are alternated
L16388: with 1 × 1 convolutions, parameterized as LU decompositions which mix the channels.
L16389: Periodically, the resolution is halved by combining each 2 × 2 patch into one position
L16390: with four times as many channels. GLOW is a multi-scale flow, and some of the channels
L16391: are periodically removed to become part of the latent vector z. Images are discrete (due
L16392: to the quantization of RGB values), so noise is added to the inputs to prevent the training
L16393: likelihood increasing without bound. This is known as dequantization.
L16394: To sample more realistic images, the GLOW model samples from the base density
L16395: raised to a positive power. This chooses examples that are closer to the center of the
L16396: density rather than from the tails.
L16397: This is similar to the truncation trick in GANs
L16398: 2The lower bound on the likelihood for diffusion models can actually exceed the exact computation
L16399: in normalizing flows, but data generation is much slower (see chapter 18).
L16400: Draft: please send errata to udlbookmail@gmail.com.
L16403: <!-- page 334 -->
L16404: 320
L16405: 16
L16406: Normalizing flows
L16407: Figure 16.12 Samples from GLOW trained on the CelebA HQ dataset (Karras
L16408: et al., 2018). The samples are of reasonable quality, although GANs and diffusion
L16409: models produce superior results. Adapted from Kingma & Dhariwal (2018).
L16410: Figure 16.13 Interpolation using GLOW model. The left and right images are real
L16411: people. The intermediate images were computed by projecting the real images to
L16412: the latent space, interpolating, and then projecting the interpolated points back
L16413: to image space. Adapted from Kingma & Dhariwal (2018).
L16414: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
