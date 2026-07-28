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
L05584: <!-- page 116 -->
L05585: 102
L05586: 7
L05587: Gradients and initialization
L05588: Figure 7.4 Backpropagation backward pass #1. We work backward from the end
L05589: of the function computing the derivatives ∂ℓi/∂fk and ∂ℓi/∂hk of the loss with
L05590: respect to the intermediate quantities.
L05591: Each derivative is computed from the
L05592: previous one by multiplying by terms of the form ∂fk/∂hk or ∂hk/∂fk−1.
L05593: represent the effects of this chain. Notice that we already computed the second of these
L05594: derivatives, and the other is the derivative of β3 +ω3 ·h3 with respect to h3, which is ω3.
L05595: We continue in this way, computing the derivatives of the output with respect to
L05596: these intermediate quantities (figure 7.4):
L05597: ∂ℓi
L05598: ∂f2
L05599: =
L05600: ∂h3
L05601: ∂f2
L05602:  ∂f3
L05603: ∂h3
L05604: ∂ℓi
L05605: ∂f3
L05606: 
L05607: ∂ℓi
L05608: ∂h2
L05609: =
L05610: ∂f2
L05611: ∂h2
L05612: ∂h3
L05613: ∂f2
L05614: ∂f3
L05615: ∂h3
L05616: ∂ℓi
L05617: ∂f3
L05618: 
L05619: ∂ℓi
L05620: ∂f1
L05621: =
L05622: ∂h2
L05623: ∂f1
L05624:  ∂f2
L05625: ∂h2
L05626: ∂h3
L05627: ∂f2
L05628: ∂f3
L05629: ∂h3
L05630: ∂ℓi
L05631: ∂f3
L05632: 
L05633: ∂ℓi
L05634: ∂h1
L05635: =
L05636: ∂f1
L05637: ∂h1
L05638: ∂h2
L05639: ∂f1
L05640: ∂f2
L05641: ∂h2
L05642: ∂h3
L05643: ∂f2
L05644: ∂f3
L05645: ∂h3
L05646: ∂ℓi
L05647: ∂f3
L05648: 
L05649: ∂ℓi
L05650: ∂f0
L05651: =
L05652: ∂h1
L05653: ∂f0
L05654:  ∂f1
L05655: ∂h1
L05656: ∂h2
L05657: ∂f1
L05658: ∂f2
L05659: ∂h2
L05660: ∂h3
L05661: ∂f2
L05662: ∂f3
L05663: ∂h3
L05664: ∂ℓi
L05665: ∂f3
L05666: 
L05667: .
L05668: (7.13)
L05669: In each case, we have already computed the quantities in the brackets in the previous
L05670: Problem 7.2
L05671: step, and the last term has a simple expression. These equations embody Observation 2
L05672: from the previous section (figure 7.2); we can reuse the previously computed derivatives
L05673: if we calculate them in reverse order.
L05674: Backward pass #2:
L05675: Finally, we consider how the loss ℓi changes when we change the
L05676: parameters {βk} and {ωk}. Once more, we apply the chain rule (figure 7.5):
L05677: ∂ℓi
L05678: ∂βk
L05679: =
L05680: ∂fk
L05681: ∂βk
L05682: ∂ℓi
L05683: ∂fk
L05684: ∂ℓi
L05685: ∂ωk
L05686: =
L05687: ∂fk
L05688: ∂ωk
L05689: ∂ℓi
L05690: ∂fk
L05691: .
L05692: (7.14)
L05693: In each case, the second term on the right-hand side was computed in equation 7.13.
L05694: When k > 0, we have fk = βk + ωk · hk, so:
L05695: ∂fk
L05696: ∂βk
L05697: = 1
L05698: and
L05699: ∂fk
L05700: ∂ωk
L05701: =
L05702: hk.
L05703: (7.15)
L05704: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L05707: <!-- page 117 -->
L05708: 7.4
L05709: Backpropagation algorithm
L05710: 103
L05711: Figure 7.5 Backpropagation backward pass #2. Finally, we compute the deriva-
L05712: tives ∂ℓi/∂βk and ∂ℓi/∂ωk.
L05713: Each derivative is computed by multiplying the
L05714: term ∂ℓi/∂fk by ∂fk/∂βk or ∂fk/∂ωk as appropriate.
L05715: This is consistent with Observation 1 from the previous section; the effect of a change
L05716: in the weight ωk is proportional to the value of the source variable hk (which was stored
L05717: in the forward pass). The final derivatives from the term f0 = β0 + ω0 · xi are:
L05718: Notebook 7.1
L05719: Backpropagation
L05720: in toy model
L05721: ∂f0
L05722: ∂β0
L05723: = 1
L05724: and
L05725: ∂f0
L05726: ∂ω0
L05727: =
L05728: xi.
L05729: (7.16)
L05730: Backpropagation is both simpler and more eﬀicient than computing the derivatives in-
L05731: dividually, as in equation 7.8.1
L05732: 7.4
L05733: Backpropagation algorithm
L05734: Now we repeat this process for a three-layer network (figure 7.1). The intuition and much
L05735: of the algebra are identical. The main differences are that intermediate variables fk, hk
L05736: are vectors, the biases βk are vectors, the weights Ωk are matrices, and we are using
L05737: ReLU functions rather than simple algebraic functions like cos[•].
L05738: Forward pass:
L05739: We write the network as a series of sequential calculations:
L05740: f0
L05741: =
L05742: β0 + Ω0xi
L05743: h1
L05744: =
L05745: a[f0]
L05746: f1
L05747: =
L05748: β1 + Ω1h1
L05749: h2
L05750: =
L05751: a[f1]
L05752: f2
L05753: =
L05754: β2 + Ω2h2
L05755: h3
L05756: =
L05757: a[f2]
L05758: f3
L05759: =
L05760: β3 + Ω3h3
L05761: ℓi
L05762: =
L05763: l[f3, yi],
L05764: (7.17)
L05765: 1Note that we did not actually need the derivatives ∂li/∂hk of the loss with respect to the activations.
L05766: In the final backpropagation algorithm, we will not compute these explicitly.
L05767: Draft: please send errata to udlbookmail@gmail.com.
L05770: <!-- page 118 -->
L05771: 104
L05772: 7
L05773: Gradients and initialization
L05774: Figure 7.6 Derivative of rectified linear
L05775: unit.
L05776: The rectified linear unit (orange
L05777: curve) returns zero when the input is
L05778: less than zero and returns the input oth-
L05779: erwise.
L05780: Its derivative (cyan curve) re-
L05781: turns zero when the input is less than
L05782: zero (since the slope here is zero) and
L05783: one when the input is greater than zero
L05784: (since the slope here is one).
L05785: where fk−1 represents the pre-activations at the kth hidden layer (i.e., the values before
L05786: the ReLU function a[•]) and hk contains the activations at the kth hidden layer (i.e., after
L05787: the ReLU function). The term l[f3, yi] represents the loss function (e.g., least squares or
L05788: binary cross-entropy loss). In the forward pass, we work through these calculations and
L05789: store all the intermediate quantities.
L05790: Backward pass #1:
L05791: Now let’s consider how the loss changes when the pre-activations
L05792: f0, f1, f2 change. Applying the chain rule, the expression for the derivative of the loss ℓi
L05793: Appendix B.5
L05794: Matrix calculus
L05795: with respect to f2 is:
L05796: ∂ℓi
L05797: ∂f2
L05798: = ∂h3
L05799: ∂f2
L05800: ∂f3
L05801: ∂h3
L05802: ∂ℓi
L05803: ∂f3
L05804: .
L05805: (7.18)
L05806: The three terms on the right-hand side have sizes D3 × D3, D3 × Df, and Df × 1,
L05807: respectively, where D3 is the number of hidden units in the third layer, and Df is the
L05808: dimensionality of the model output f3.
L05809: Similarly, we can compute how the loss changes when we change f1 and f0:
L05810: ∂ℓi
L05811: ∂f1
L05812: =
L05813: ∂h2
L05814: ∂f1
L05815: ∂f2
L05816: ∂h2
L05817: ∂h3
L05818: ∂f2
L05819: ∂f3
L05820: ∂h3
L05821: ∂ℓi
L05822: ∂f3
L05823: 
L05824: (7.19)
L05825: ∂ℓi
L05826: ∂f0
L05827: =
L05828: ∂h1
L05829: ∂f0
L05830: ∂f1
L05831: ∂h1
L05832: ∂h2
L05833: ∂f1
L05834: ∂f2
L05835: ∂h2
L05836: ∂h3
L05837: ∂f2
L05838: ∂f3
L05839: ∂h3
L05840: ∂ℓi
L05841: ∂f3
L05842: 
L05843: .
L05844: (7.20)
L05845: Note that in each case, the term in brackets was computed in the previous step. By
L05846: Problem 7.3
L05847: working backward through the network, we can reuse the previous computations.
L05848: Moreover, the terms themselves are simple. Working backward through the right-
L05849: Problems 7.4–7.5
L05850: hand side of equation 7.18, we have:
L05851: • The derivative ∂ℓi/∂f3 of the loss ℓi with respect to the network output f3 will
L05852: depend on the loss function but usually has a simple form.
L05853: • The derivative ∂f3/∂h3 of the network output with respect to hidden layer h3 is:
L05854: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L05857: <!-- page 119 -->
L05858: 7.4
L05859: Backpropagation algorithm
L05860: 105
L05861: ∂f3
L05862: ∂h3
L05863: =
L05864: ∂
L05865: ∂h3
L05866: (β3 + Ω3h3) = ΩT
L05867: 3 .
L05868: (7.21)
L05869: If you are unfamiliar with matrix calculus, this result is not obvious. It is explored
L05870: Problem 7.6
L05871: in problem 7.6.
L05872: • The derivative ∂h3/∂f2 of the output h3 of the activation function with respect to
L05873: its input f2 will depend on the activation function. It will be a diagonal matrix
L05874: since each activation only depends on the corresponding pre-activation. For ReLU
L05875: functions, the diagonal terms are zero everywhere f2 is less than zero and one
L05876: Problems 7.7–7.8
L05877: otherwise (figure 7.6). Rather than multiply by this matrix, we extract the diagonal
L05878: terms as a vector I[f2 > 0] and pointwise multiply, which is more eﬀicient.
L05879: The terms on the right-hand side of equations 7.19 and 7.20 have similar forms. As
L05880: we progress back through the network, we alternately (i) multiply by the transpose of
L05881: the weight matrices ΩT
L05882: k and (ii) threshold based on the inputs fk−1 to the hidden layer.
L05883: These inputs were stored during the forward pass.
L05884: Backward pass #2:
L05885: Now that we know how to compute ∂ℓi/∂fk, we can focus on
L05886: calculating the derivatives of the loss with respect to the weights and biases. To calculate
L05887: the derivatives of the loss with respect to the biases βk, we again use the chain rule:
L05888: ∂ℓi
L05889: ∂βk
L05890: =
L05891: ∂fk
L05892: ∂βk
L05893: ∂ℓi
L05894: ∂fk
L05895: =
L05896: ∂
L05897: ∂βk
L05898: (βk + Ωkhk) ∂ℓi
L05899: ∂fk
L05900: =
L05901: ∂ℓi
L05902: ∂fk
L05903: ,
L05904: (7.22)
L05905: which we already calculated in equations 7.18 and 7.19.
L05906: Similarly, the derivative for the weights matrix Ωk, is given by:
L05907: ∂ℓi
L05908: ∂Ωk
L05909: =
L05910: ∂fk
L05911: ∂Ωk
L05912: ∂ℓi
L05913: ∂fk
L05914: =
L05915: ∂
L05916: ∂Ωk
L05917: (βk + Ωkhk) ∂ℓi
L05918: ∂fk
L05919: =
L05920: ∂ℓi
L05921: ∂fk
L05922: hT
L05923: k .
L05924: (7.23)
L05925: Again, the progression from line two to line three is not obvious and is explored in
L05926: Problem 7.9
L05927: problem 7.9. However, the result makes sense. The final line is a matrix of the same size
L05928: as Ωk. It depends linearly on hk, which was multiplied by Ωk in the original expression.
L05929: This is also consistent with the initial intuition that the derivative of the weights in Ωk
L05930: will be proportional to the values of the hidden units hk that they multiply. Recall that
L05931: we already computed these during the forward pass.
L05932: Draft: please send errata to udlbookmail@gmail.com.
L05935: <!-- page 120 -->
L05936: 106
L05937: 7
L05938: Gradients and initialization
L05939: 7.4.1
L05940: Backpropagation algorithm summary
L05941: We now briefly summarize the final backpropagation algorithm. Consider a deep neural
L05942: network f[xi, ϕ] that takes input xi, has K hidden layers with ReLU activations, and
L05943: individual loss term ℓi = l[f[xi, ϕ], yi]. The goal of backpropagation is to compute the
L05944: derivatives ∂ℓi/∂βk and ∂ℓi/∂Ωk with respect to the biases βk and weights Ωk.
L05945: Forward pass:
L05946: We compute and store the following quantities:
L05947: f0
L05948: =
L05949: β0 + Ω0xi
L05950: hk
L05951: =
L05952: a[fk−1]
L05953: k ∈{1, 2, . . . , K}
L05954: fk
L05955: =
L05956: βk + Ωkhk.
L05957: k ∈{1, 2, . . . , K}
L05958: (7.24)
L05959: Backward pass:
L05960: We start with the derivative ∂ℓi/∂fK of the loss function ℓi with respect
L05961: to the network output fK and work backward through the network:
L05962: ∂ℓi
L05963: ∂βk
L05964: =
L05965: ∂ℓi
L05966: ∂fk
L05967: k ∈{K, K −1, . . . , 1}
L05968: ∂ℓi
L05969: ∂Ωk
L05970: =
L05971: ∂ℓi
L05972: ∂fk
L05973: hT
L05974: k
L05975: k ∈{K, K −1, . . . , 1}
L05976: ∂ℓi
L05977: ∂fk−1
L05978: =
L05979: I[fk−1 > 0] ⊙
L05980: 
L05981: ΩT
L05982: k
L05983: ∂ℓi
L05984: ∂fk
L05985: 
L05986: ,
L05987: k ∈{K, K −1, . . . , 1}
L05988: (7.25)
L05989: where ⊙denotes pointwise multiplication, and I[fk−1 > 0] is a vector containing ones
L05990: where fk−1 is greater than zero and zeros elsewhere. Finally, we compute the derivatives
L05991: with respect to the first set of biases and weights:
L05992: ∂ℓi
L05993: ∂β0
L05994: =
L05995: ∂ℓi
L05996: ∂f0
L05997: ∂ℓi
L05998: ∂Ω0
L05999: =
L06000: ∂ℓi
L06001: ∂f0
L06002: xT
L06003: i .
L06004: (7.26)
L06005: We calculate these derivatives for every training example in the batch and sum them
L06006: Problem 7.10
L06007: together to retrieve the gradient for the SGD update.
L06008: Notebook 7.2
L06009: Backpropagation
L06010: Note that the backpropagation algorithm is extremely eﬀicient; the most demanding
L06011: computational step in both the forward and backward pass is matrix multiplication (by Ω
L06012: and ΩT , respectively) which only requires additions and multiplications. However, it is
L06013: not memory eﬀicient; the intermediate values in the forward pass must all be stored, and
L06014: this can limit the size of the model we can train.
L06015: 7.4.2
L06016: Algorithmic differentiation
L06017: Although it’s important to understand the backpropagation algorithm, it’s unlikely that
L06018: you will need to code it in practice. Modern deep learning frameworks such as PyTorch
L06019: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L06022: <!-- page 121 -->
L06023: 7.5
L06024: Parameter initialization
L06025: 107
L06026: and TensorFlow calculate the derivatives automatically, given the model specification.
L06027: This is known as algorithmic differentiation.
L06028: Each functional component (linear transform, ReLU activation, loss function) in the
L06029: framework knows how to compute its own derivative. For example, the PyTorch ReLU
L06030: function zout = relu[zin] knows how to compute the derivative of its output zout with
L06031: respect to its input zin. Similarly, a linear function zout = β + Ωzin knows how to
L06032: compute the derivatives of the output zout with respect to the input zin and with re-
L06033: spect to the parameters β and Ω. The algorithmic differentiation framework also knows
L06034: the sequence of operations in the network and thus has all the information required to
L06035: perform the forward and backward passes.
L06036: These frameworks exploit the massive parallelism of modern graphics processing units
L06037: (GPUs). Computations such as matrix multiplication (which features in both the forward
L06038: and backward pass) are naturally amenable to parallelization. Moreover, it’s possible to
L06039: Problem 7.11
L06040: perform the forward and backward passes for the entire batch in parallel if the model
L06041: and intermediate results in the forward pass do not exceed the available memory.
L06042: Since the training algorithm now processes the entire batch in parallel, the input
L06043: becomes a multi-dimensional tensor. In this context, a tensor can be considered the
L06044: generalization of a matrix to arbitrary dimensions. Hence, a vector is a 1D tensor, a
L06045: matrix is a 2D tensor, and a 3D tensor is a 3D grid of numbers. Until now, the training
L06046: data have been 1D, so the input for backpropagation would be a 2D tensor where the
L06047: first dimension indexes the batch element and the second indexes the data dimension.
L06048: In subsequent chapters, we will encounter more complex structured input data.
L06049: For
L06050: example, in models where the input is an RGB image, the original data examples are
L06051: 3D (height × width × channel). Here, the input to the learning framework would be a
L06052: 4D tensor, where the extra dimension indexes the batch element.
L06053: 7.4.3
L06054: Extension to arbitrary computational graphs
L06055: We have described backpropagation in a deep neural network that is naturally sequential;
L06056: we calculate the intermediate quantities f0, h1, f1, h2 . . . , fk in turn. However, models
L06057: need not be restricted to sequential computation.
L06058: Later in this book, we will meet
L06059: models with branching structures. For example, we might take the values in a hidden
L06060: layer and process them through two different sub-networks before recombining.
L06061: Problems 7.12–7.13
L06062: Fortunately, the ideas of backpropagation still hold if the computational graph is
L06063: acyclic. Modern algorithmic differentiation frameworks such as PyTorch and TensorFlow
L06064: can handle arbitrary acyclic computational graphs.
L06065: 7.5
L06066: Parameter initialization
L06067: The backpropagation algorithm computes the derivatives that are used by stochastic
L06068: gradient descent and Adam to train the model. We now address how to initialize the
L06069: parameters before we start training. To see why this is crucial, consider that during the
L06070: forward pass, each set of pre-activations fk is computed as:
L06071: Draft: please send errata to udlbookmail@gmail.com.
L06074: <!-- page 122 -->
L06075: 108
L06076: 7
L06077: Gradients and initialization
L06078: fk
L06079: =
L06080: βk + Ωkhk
L06081: =
L06082: βk + Ωka[fk−1],
L06083: (7.27)
L06084: where a[•] applies the ReLU functions and Ωk and βk are the weights and biases, respec-
L06085: tively. Imagine that we initialize all the biases to zero and the elements of Ωk according
L06086: to a normal distribution with mean zero and variance σ2. Consider two scenarios:
L06087: • If the variance σ2 is very small (e.g., 10−5), then each element of βk +Ωkhk will be
L06088: a weighted sum of hk where the weights are very small; the result will likely have
L06089: a smaller magnitude than the input. In addition, the ReLU function clips values
L06090: less than zero, so the range of hk will be half that of fk−1. Consequently, the
L06091: magnitudes of the pre-activations at the hidden layers will get smaller and smaller
L06092: as we progress through the network.
L06093: • If the variance σ2 is very large (e.g., 105), then each element of βk + Ωkhk will be
L06094: a weighted sum of hk where the weights are very large; the result is likely to have
L06095: a much larger magnitude than the input. The ReLU function halves the range of
L06096: the inputs, but if σ2 is large enough, the magnitudes of the pre-activations will still
L06097: get larger as we progress through the network.
L06098: In these two situations, the values at the pre-activations can become so small or so large
L06099: that they cannot be represented with finite precision floating point arithmetic.
L06100: Even if the forward pass is tractable, the same logic applies to the backward pass.
L06101: Each gradient update (equation 7.25) consists of multiplying by ΩT . If the values of Ω
L06102: are not initialized sensibly, then the gradient magnitudes may decrease or increase un-
L06103: controllably during the backward pass. These cases are known as the vanishing gradient
L06104: problem and the exploding gradient problem, respectively. In the former case, updates to
L06105: the model become vanishingly small. In the latter case, they become unstable.
L06106: 7.5.1
L06107: Initialization for forward pass
L06108: We now present a mathematical version of the same argument. Consider the computation
L06109: between adjacent pre-activations f and f ′ with dimensions Dh and Dh′, respectively:
L06110: h
L06111: =
L06112: a[f],
L06113: f ′
L06114: =
L06115: β + Ωh
L06116: (7.28)
L06117: where h represents the activations, Ωand β represent the weights and biases, and a[•]
L06118: is the activation function.
L06119: Assume the pre-activations fj in the input layer f have variance σ2
L06120: f. Consider ini-
L06121: tializing the biases βi to zero and the weights Ωij as normally distributed with mean
L06122: zero and variance σ2
L06123: Ω.
L06124: Now we derive expressions for the mean and variance of the
L06125: pre-activations f ′ in the subsequent layer.
L06126: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L06129: <!-- page 123 -->
L06130: 7.5
L06131: Parameter initialization
L06132: 109
L06133: The expectation (mean) E[f ′
L06134: i] of the intermediate values f ′
L06135: i is:
L06136: Appendix C.2
L06137: Expectation
L06138: E[f ′
L06139: i]
L06140: =
L06141: E
L06142: 
L06143: βi +
L06144: Dh
L06145: X
L06146: j=1
L06147: Ωijhj
L06148: 
L06149: 
L06150: =
L06151: E [βi] +
L06152: Dh
L06153: X
L06154: j=1
L06155: E [Ωijhj]
L06156: =
L06157: E [βi] +
L06158: Dh
L06159: X
L06160: j=1
L06161: E [Ωij] E [hj]
L06162: =
L06163: 0 +
L06164: Dh
L06165: X
L06166: j=1
L06167: 0 · E [hj] = 0,
L06168: (7.29)
L06169: where Dh is the dimensionality of the input layer h. We have used the rules for manipu-
L06170: Appendix C.2.1
L06171: Expectation rules
L06172: lating expectations, and we have assumed that the distributions over the hidden units hj
L06173: and the network weights Ωij are independent between the second and third lines.
L06174: Using this result, we see that the variance σ2
L06175: f ′ of the pre-activations f ′
L06176: i is:
L06177: σ2
L06178: f ′
L06179: i
L06180: =
L06181: E[f ′2
L06182: i ] −E[f ′
L06183: i]2
L06184: =
L06185: E
L06186: 
L06187: 
L06188: 
L06189: βi +
L06190: Dh
L06191: X
L06192: j=1
L06193: Ωijhj
L06194: 
L06195: 
L06196: 2
L06197: −0
L06198: =
L06199: E
L06200: 
L06201: 
L06202: 
L06203: 
L06204: Dh
L06205: X
L06206: j=1
L06207: Ωijhj
L06208: 
L06209: 
L06210: 2
L06211: 
L06212: =
L06213: Dh
L06214: X
L06215: j=1
L06216: E
L06217: 
L06218: Ω2
L06219: ij
L06220: 
L06221: E
L06222: 
L06223: h2
L06224: j
L06225: 
L06226: =
L06227: Dh
L06228: X
L06229: j=1
L06230: σ2
L06231: ΩE
L06232: 
L06233: h2
L06234: j
L06235: 
L06236: = σ2
L06237: Ω
L06238: Dh
L06239: X
L06240: j=1
L06241: E
L06242: 
L06243: h2
L06244: j
L06245: 
L06246: ,
L06247: (7.30)
L06248: where we have used the variance identity σ2 = E[(z −E[z])2] = E[z2] −E[z]2. We have
L06249: Appendix C.2.3
L06250: Variance identity
L06251: assumed once more that the distributions of the weights Ωij and the hidden units hj are
L06252: independent between lines three and four.
L06253: Assuming that the distribution of pre-activations fj at the previous layer is symmetric
L06254: about zero, half of these pre-activations will be clipped by the ReLU function, and the
L06255: second moment E[h2
L06256: j] will be half the variance σ2
L06257: f of fj (see problem 7.14):
L06258: Problem 7.14
L06259: σ2
L06260: f ′
L06261: i = σ2
L06262: Ω
L06263: Dh
L06264: X
L06265: j=1
L06266: σ2
L06267: f
L06268: 2 = 1
L06269: 2Dhσ2
L06270: Ωσ2
L06271: f.
L06272: (7.31)
L06273: Draft: please send errata to udlbookmail@gmail.com.
L06276: <!-- page 124 -->
L06277: 110
L06278: 7
L06279: Gradients and initialization
L06280: Figure 7.7 Weight initialization. Consider a deep network with 50 hidden layers
L06281: and Dh = 100 hidden units per layer. The network has a 100-dimensional input x
L06282: initialized from a standard normal distribution, a single fixed target y = 0, and
L06283: a least squares loss function. The bias vectors βk are initialized to zero, and the
L06284: weight matrices Ωk are initialized with a normal distribution with mean zero and
L06285: five different variances σ2
L06286: Ω∈{0.001, 0.01, 0.02, 0.1, 1.0}. a) Variance of hidden
L06287: unit activations computed in forward pass as a function of the network layer. For
L06288: He initialization (σ2
L06289: Ω= 2/Dh = 0.02), the variance is stable. However, for larger
L06290: values, it increases rapidly, and for smaller values, it decreases rapidly (note
L06291: log scale). b) The variance of the gradients in the backward pass (solid lines)
L06292: continues this trend; if we initialize with a value larger than 0.02, the magnitude
L06293: of the gradients increases rapidly as we pass back through the network. If we
L06294: initialize with a value smaller, then the magnitude decreases. These are known
L06295: as the exploding gradient and vanishing gradient problems, respectively.
L06296: This, in turn, implies that if we want the variance σ2
L06297: f ′ of the subsequent pre-activations f ′
L06298: to be the same as the variance σ2
L06299: f of the original pre-activations f during the forward
L06300: pass, we should set:
L06301: σ2
L06302: Ω=
L06303: 2
L06304: Dh
L06305: ,
L06306: (7.32)
L06307: where Dh is the dimension of the original layer to which the weights were applied. This
L06308: is known as He initialization.
L06309: 7.5.2
L06310: Initialization for backward pass
L06311: A similar argument establishes how the variance of the gradients ∂l/∂fk changes during
L06312: the backward pass. During the backward pass, we multiply by the transpose ΩT of the
L06313: weight matrix (equation 7.25), so the equivalent expression becomes:
L06314: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L06317: <!-- page 125 -->
L06318: 7.6
L06319: Example training code
L06320: 111
L06321: σ2
L06322: Ω=
L06323: 2
L06324: Dh′ ,
L06325: (7.33)
L06326: where Dh′ is the dimension of the layer that the weights feed into.
L06327: 7.5.3
L06328: Initialization for both forward and backward pass
L06329: If the weight matrix Ωis not square (i.e., there are different numbers of hidden units
L06330: in the two adjacent layers, so Dh and Dh′ differ), then it is not possible to choose the
L06331: variance to satisfy both equations 7.32 and 7.33 simultaneously. One possible compromise
L06332: is to use the mean (Dh + Dh′)/2 as a proxy for the number of terms, which gives:
L06333: σ2
L06334: Ω=
L06335: 4
L06336: Dh + Dh′ .
L06337: (7.34)
L06338: Figure 7.7 shows empirically that both the variance of the hidden units in the forward
L06339: Problem 7.15
L06340: Notebook 7.3
L06341: Initialization
L06342: pass and the variance of the gradients in the backward pass remain stable when the
L06343: parameters are initialized appropriately.
L06344: 7.6
L06345: Example training code
L06346: The primary focus of this book is scientific; this is not a guide for implementing deep
L06347: learning models. Nonetheless, in figure 7.8, we present PyTorch code that implements
L06348: the ideas explored in this book so far. The code defines a neural network and initializes
L06349: Problems 7.16–7.17
L06350: the weights. It creates random input and output datasets and defines a least squares loss
L06351: function. The model is trained from the data using SGD with momentum in batches of
L06352: size 10 over 100 epochs. The learning rate starts at 0.01 and halves every 10 epochs.
L06353: The takeaway is that although the underlying ideas in deep learning are quite com-
L06354: plex, implementation is relatively simple. For example, all of the details of the back-
L06355: propagation are hidden in the single line of code: loss.backward().
L06356: 7.7
L06357: Summary
L06358: The previous chapter introduced stochastic gradient descent (SGD), an iterative opti-
L06359: mization algorithm that aims to find the minimum of a function. In the context of neural
L06360: networks, this algorithm finds the parameters that minimize the loss function. SGD re-
L06361: lies on the gradient of the loss function with respect to the parameters, which must be
L06362: initialized before optimization. This chapter has addressed these two problems for deep
L06363: neural networks.
L06364: The gradients must be evaluated for a very large number of parameters, for each
L06365: member of the batch, and at each SGD iteration. It is hence imperative that the gradient
L06366: Draft: please send errata to udlbookmail@gmail.com.
L06369: <!-- page 126 -->
L06370: 112
L06371: 7
L06372: Gradients and initialization
L06373: import torch, torch.nn as nn
L06374: from torch.utils.data import TensorDataset, DataLoader
L06375: from torch.optim.lr_scheduler import StepLR
L06376: # define input size, hidden layer size, output size
L06377: D_i, D_k, D_o = 10, 40, 5
L06378: # create model with two hidden layers
L06379: model = nn.Sequential(
L06380: nn.Linear(D_i, D_k),
L06381: nn.ReLU(),
L06382: nn.Linear(D_k, D_k),
L06383: nn.ReLU(),
L06384: nn.Linear(D_k, D_o))
L06385: # He initialization of weights
L06386: def weights_init(layer_in):
L06387: if isinstance(layer_in, nn.Linear):
L06388: nn.init.kaiming_normal_(layer_in.weight)
L06389: layer_in.bias.data.fill_(0.0)
L06390: model.apply(weights_init)
L06391: # choose least squares loss function
L06392: criterion = nn.MSELoss()
L06393: # construct SGD optimizer and initialize learning rate and momentum
L06394: optimizer = torch.optim.SGD(model.parameters(), lr = 0.1, momentum=0.9)
L06395: # object that decreases learning rate by half every 10 epochs
L06396: scheduler = StepLR(optimizer, step_size=10, gamma=0.5)
L06397: # create 100 random data points and store in data loader class
L06398: x = torch.randn(100, D_i)
L06399: y = torch.randn(100, D_o)
L06400: data_loader = DataLoader(TensorDataset(x,y), batch_size=10, shuffle=True)
L06401: # loop over the dataset 100 times
L06402: for epoch in range(100):
L06403: epoch_loss = 0.0
L06404: # loop over batches
L06405: for i, data in enumerate(data_loader):
L06406: # retrieve inputs and labels for this batch
L06407: x_batch, y_batch = data
L06408: # zero the parameter gradients
L06409: optimizer.zero_grad()
L06410: # forward pass
L06411: pred = model(x_batch)
L06412: loss = criterion(pred, y_batch)
L06413: # backward pass
L06414: loss.backward()
L06415: # SGD update
L06416: optimizer.step()
L06417: # update statistics
L06418: epoch_loss += loss.item()
L06419: # print error
L06420: print(f'Epoch {epoch:5d}, loss {epoch_loss:.3f}')
L06421: # tell scheduler to consider updating learning rate
L06422: scheduler.step()
L06423: Figure 7.8 Sample code for training two-layer network on random data.
L06424: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L06427: <!-- page 127 -->
L06428: Notes
L06429: 113
L06430: computation is eﬀicient, and to this end, the backpropagation algorithm was introduced.
L06431: Careful parameter initialization is also critical.
L06432: The magnitudes of the hidden unit
L06433: activations can either decrease or increase exponentially in the forward pass. The same
L06434: is true of the gradient magnitudes in the backward pass, where these behaviors are known
L06435: as the vanishing gradient and exploding gradient problems. Both impede training but
L06436: can be avoided with appropriate initialization.
L06437: We’ve now defined the model and the loss function, and we can train a model for a
L06438: given task. The next chapter discusses how to measure the model performance.
L06439: Notes
L06440: Backpropagation:
L06441: Eﬀicient reuse of partial computations while calculating gradients in com-
L06442: putational graphs has been repeatedly discovered, including by Werbos (1974), Bryson et al.
L06443: (1979), LeCun (1985), and Parker (1985). However, the most celebrated description of this
L06444: idea was by Rumelhart et al. (1985) and Rumelhart et al. (1986), who also coined the term
L06445: “backpropagation.” This latter work kick-started a new phase of neural network research in the
L06446: eighties and nineties; for the first time, it was practical to train networks with hidden layers.
L06447: However, progress stalled due (in retrospect) to a lack of training data, limited computational
L06448: power, and the use of sigmoid activations. Areas such as natural language processing and com-
L06449: puter vision did not rely on neural network models until the remarkable image classification
L06450: results of Krizhevsky et al. (2012) ushered in the modern era of deep learning.
L06451: The implementation of backpropagation in modern deep learning frameworks such as PyTorch
L06452: and TensorFlow is an example of reverse-mode algorithmic differentiation. This is distinguished
L06453: from forward-mode algorithmic differentiation in which the derivatives from the chain rule
L06454: are accumulated while moving forward through the computational graph (see problem 7.13).
L06455: Further information about algorithmic differentiation can be found in Griewank & Walther
L06456: (2008) and Baydin et al. (2018).
L06457: Initialization:
L06458: He initialization was first introduced by He et al. (2015). It follows closely
L06459: from Glorot or Xavier initialization (Glorot & Bengio, 2010), which is very similar but does
L06460: not consider the effect of the ReLU layer and so differs by a factor of two. Essentially the
L06461: same method was proposed much earlier by LeCun et al. (2012) but with a slightly different
L06462: motivation; in this case, sigmoidal activation functions were used, which naturally normalize the
L06463: range of outputs at each layer, and hence help prevent an exponential increase in the magnitudes
L06464: of the hidden units. However, if the pre-activations are too large, they fall into the flat regions
L06465: of the sigmoid function and result in very small gradients.
L06466: Hence, it is still important to
L06467: initialize the weights sensibly. Klambauer et al. (2017) introduce the scaled exponential linear
L06468: unit (SeLU) and show that, within a certain range of inputs, this activation function tends to
L06469: make the activations in network layers automatically converge to mean zero and unit variance.
L06470: A completely different approach is to pass data through the network and then normalize by the
L06471: empirically observed variance. Layer-sequential unit variance initialization (Mishkin & Matas,
L06472: 2016) is an example of this kind of method, in which the weight matrices are initialized as
L06473: orthonormal. GradInit (Zhu et al., 2021) randomizes the initial weights and temporarily fixes
L06474: them while it learns non-negative scaling factors for each weight matrix.
L06475: These factors are
L06476: selected to maximize the decrease in the loss for a fixed learning rate subject to a constraint
L06477: on the maximum gradient norm. Activation normalization or ActNorm adds a learnable scaling
L06478: and offset parameter after each network layer at each hidden unit. They run an initial batch
L06479: through the network and then choose the offset and scale so that the mean of the activations is
L06480: zero and the variance one. After this, these extra parameters are learned as part of the model.
L06481: Draft: please send errata to udlbookmail@gmail.com.
