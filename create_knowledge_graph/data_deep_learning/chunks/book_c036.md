L23425: <!-- page 457 -->
L23426: B.3
L23427: Vector, matrices, and tensors
L23428: 443
L23429: where τ is the time lag. Sometimes, this is normalized by r[0] so that the autocorrelation
L23430: at time lag zero is one. The autocorrelation function is a measure of the correlation of the
L23431: function with itself as a function of an offset (i.e., the time lag). If a function changes
L23432: slowly and predictably, then the autocorrelation function will decrease slowly as the
L23433: time lag increases from zero. If the function changes fast and unpredictably, then it will
L23434: decrease quickly to zero.
L23435: B.3
L23436: Vector, matrices, and tensors
L23437: In machine learning, a vector x ∈RD is a one-dimensional array of D numbers, which
L23438: we will assume are organized in a column. Similarly, a matrix Y ∈RD1×D2 is a two-
L23439: dimensional array of numbers with D1 rows and D2 columns. A tensor z ∈RD1×D2...×DN
L23440: is an N-dimensional array of numbers. Confusingly, all three of these quantities are stored
L23441: in objects known as “tensors” in deep learning APIs such as PyTorch and TensorFlow.
L23442: B.3.1
L23443: Transpose
L23444: The transpose AT ∈RD2×D1 of a matrix A ∈RD1×D2 is formed by reflecting it around
L23445: the principal diagonal so that the kth column becomes the kth row and vice-versa. If we
L23446: take the transpose of a matrix product AB, then we take the transpose of the original
L23447: matrices but reverse the order so that
L23448: (AB)T = BT AT .
L23449: (B.7)
L23450: The transpose of a column vector a is a row vector aT and vice-versa.
L23451: B.3.2
L23452: Vector and matrix norms
L23453: For a vector z, the ℓp norm is defined as:
L23454: ||z||p =
L23455:  D
L23456: X
L23457: d=1
L23458: |zd|p
L23459: !1/p
L23460: ,
L23461: (B.8)
L23462: for real-valued p > 1.
L23463: When p = 2, this returns the length of the vector, and this
L23464: is known as the Euclidean norm. It is this case that is most commonly used in deep
L23465: learning, and often the exponent p is omitted, and the Euclidean norm is just written
L23466: as ||z||. When p = ∞, the operator returns the maximum absolute value in the vector.
L23467: Norms can be computed in a similar way for matrices. For example, the ℓ2 norm of
L23468: a matrix Z (known as the Frobenius norm) is calculated as:
L23469: Draft: please send errata to udlbookmail@gmail.com.
L23472: <!-- page 458 -->
L23473: 444
L23474: B
L23475: Mathematics
L23476: ||Z||F =
L23477: 
L23478: 
L23479: I
L23480: X
L23481: i=1
L23482: J
L23483: X
L23484: j=1
L23485: |zij|2
L23486: 
L23487: 
L23488: 1/2
L23489: .
L23490: (B.9)
L23491: B.3.3
L23492: Product of matrices
L23493: The product C = AB of two matrices A ∈RD1×D2 and B ∈RD2×D3 is a third ma-
L23494: trix C ∈RD1×D3 where:
L23495: Cij =
L23496: D2
L23497: X
L23498: d=1
L23499: AidBdj.
L23500: (B.10)
L23501: B.3.4
L23502: Dot product of vectors
L23503: The dot product aT b of two vectors a ∈RD and b ∈RD is a scalar and is defined as:
L23504: aT b = bT a =
L23505: D
L23506: X
L23507: d=1
L23508: adbd.
L23509: (B.11)
L23510: It can be shown that the dot product is proportional to the Euclidean norm of the first
L23511: vector times the Euclidean norm of the second vector times the angle θ between them:
L23512: aT b = ||a||||b|| cos[θ].
L23513: (B.12)
L23514: B.3.5
L23515: Inverse
L23516: A square matrix A may or may not have an inverse A−1 such that A−1A = AA−1 = I.
L23517: If a matrix does not have an inverse, it is called singular.
L23518: If we take the inverse of a
L23519: matrix product AB where A and B are square and invertible, then we can equivalently
L23520: take the inverse of each matrix individually and reverse the order of multiplication.
L23521: (AB)−1 = B−1A−1.
L23522: (B.13)
L23523: In general, it takes O[D3] operations to invert a D×D matrix. However, inversion is
L23524: more eﬀicient for special types of matrices, including diagonal, orthogonal, and triangular
L23525: matrices (see section B.4).
L23526: B.3.6
L23527: Subspaces
L23528: Consider a matrix A ∈RD1×D2. If the number of columns D2 of the matrix is fewer than
L23529: the number of rows D1 (i.e., the matrix is “portrait”), the product Ax cannot reach all
L23530: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L23533: <!-- page 459 -->
L23534: B.3
L23535: Vector, matrices, and tensors
L23536: 445
L23537: Figure B.3 Singular values.
L23538: When the
L23539: points {xi} on the unit circle are trans-
L23540: formed to points {x′
L23541: i} by a linear trans-
L23542: formation x′
L23543: i = Axi, they are mapped
L23544: to an ellipse. For example, the light blue
L23545: point on the unit circle is mapped to
L23546: the light blue point on the ellipse. The
L23547: length of the major (longest) axis of the
L23548: ellipse (long gray arrow) is the magni-
L23549: tude of the first singular value of the ma-
L23550: trix, and the length of the minor (short-
L23551: est) axis of the ellipse (short gray arrow)
L23552: is the magnitude of the second singular
L23553: value.
L23554: possible positions in the D1-dimensional output space. This product consists of the D2
L23555: columns of A weighted by the D2 elements of x and can only reach the linear subspace
L23556: that is spanned by these columns. This is known as the column space of the matrix.
L23557: Conversely, for a landscape matrix A, the part of the input space that maps to zero (i.e.,
L23558: those x where Ax = 0) is termed the nullspace of the matrix.
L23559: B.3.7
L23560: Eigenspectrum
L23561: If we multiply the set of 2D points on a unit circle by a 2 × 2 matrix A, they map to
L23562: an ellipse (figure B.3). The radii of the major and minor axes of this ellipse (i.e., the
L23563: longest and shortest directions) correspond to the magnitude of the singular values λ1
L23564: and λ2 of the matrix. The same idea applies in higher dimensions. A D−dimensional
L23565: spheroid is mapped by a D × D matrix A to a D-dimensional ellipsoid. The radii of
L23566: the D principal axes of this ellipsoid determine the magnitude of the singular values. For
L23567: symmetric square matrices, the same information is captured by the eigenvalues which
L23568: are here the same as the singular values.
L23569: The spectral norm of a square matrix is the largest absolute eigenvalue. It captures
L23570: the largest possible change in magnitude when the matrix is applied to a vector of unit
L23571: length. As such, it tells us about the Lipschitz constant of the transformation. The set of
L23572: eigenvalues is sometimes called the eigenspectrum and tells us about the magnitude of the
L23573: scaling applied by the matrix across all directions. This information can be summarized
L23574: using the determinant and trace of the matrix.
L23575: B.3.8
L23576: Determinant and trace
L23577: Every square matrix A has a scalar associated with it called the determinant and denoted
L23578: by |A| or det[A], which is the product of the eigenvalues. It is hence related to the
L23579: average scaling applied by the matrix for different inputs. Matrices with small absolute
L23580: determinants tend to decrease the norm of vectors upon multiplication. Matrices with
L23581: Draft: please send errata to udlbookmail@gmail.com.
L23584: <!-- page 460 -->
L23585: 446
L23586: B
L23587: Mathematics
L23588: large absolute determinants tend to increase the norm.
L23589: If a matrix is singular, the
L23590: determinant will be zero, and there will be at least one direction in space that is mapped
L23591: to the origin when the matrix is applied. Determinants of matrix expressions obey the
L23592: following rules:
L23593: |AT |
L23594: =
L23595: |A|
L23596: |AB|
L23597: =
L23598: |A||B|
L23599: |A−1|
L23600: =
L23601: 1/|A|.
L23602: (B.14)
L23603: The trace of a square matrix is the sum of the diagonal values (the matrix itself need
L23604: not be diagonal) or the sum of the eigenvalues. Traces obey these rules:
L23605: trace[AT]
L23606: =
L23607: trace[A]
L23608: trace[AB]
L23609: =
L23610: trace[BA]
L23611: trace[A + B]
L23612: =
L23613: trace[A] + trace[B]
L23614: trace[ABC]
L23615: =
L23616: trace[BCA] = trace[CAB],
L23617: (B.15)
L23618: where in the last relation, the trace is invariant for cyclic permutations only, so in
L23619: general, trace[ABC] ̸= trace[BAC].
L23620: B.4
L23621: Special types of matrix
L23622: Calculating the inverse of a square matrix A ∈RD×D has a complexity of O[D3], as does
L23623: the computation of the determinant. However, for some matrices with special properties,
L23624: these computations can be more eﬀicient.
L23625: B.4.1
L23626: Diagonal matrices
L23627: A diagonal matrix has zeros everywhere except on the principal diagonal. If these diag-
L23628: onal entries are all non-zero, the inverse is also a diagonal matrix, with each diagonal
L23629: entry dii replaced by 1/dii. The determinant is the product of the values on the di-
L23630: agonal. A special case of this is the identity matrix, which has ones on the diagonal.
L23631: Consequently, its inverse is also the identity matrix, and its determinant is one.
L23632: B.4.2
L23633: Triangular matrices
L23634: A lower triangular matrix has all of its non-zero values on the principal diagonal and/or
L23635: the positions below this. An upper triangular matrix has all of its non-zero values on
L23636: the principal diagonal and/or the positions above this. In both cases, the matrix can
L23637: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L23640: <!-- page 461 -->
L23641: B.4
L23642: Special types of matrix
L23643: 447
L23644: be inverted in O[D2] (see problem 16.4), and the determinant is just the product of the
L23645: values on the diagonal.
L23646: B.4.3
L23647: Orthogonal matrices
L23648: Orthogonal matrices represent rotations and reflections around the origin, so in figure B.3,
L23649: the circle would be mapped to another circle of unit radius but rotated and possibly
L23650: reflected. Accordingly, the eigenvalues must all have magnitude one, and the determinant
L23651: must be either one or minus one. The inverse of an orthogonal matrix is its transpose,
L23652: so A−1 = AT .
L23653: B.4.4
L23654: Permutation matrices
L23655: A permutation matrix has exactly one non-zero entry in each row and column, and all
L23656: of these entries take the value one. It is a special case of an orthogonal matrix, so its
L23657: inverse is its own transpose, and its determinant is always ±1. As the name suggests, it
L23658: has the effect of permuting the entries of a vector. For example:
L23659: 
L23660: 
L23661: 0
L23662: 1
L23663: 0
L23664: 0
L23665: 0
L23666: 1
L23667: 1
L23668: 0
L23669: 0
L23670: 
L23671: 
L23672: 
L23673: 
L23674: a
L23675: b
L23676: c
L23677: 
L23678: =
L23679: 
L23680: 
L23681: b
L23682: c
L23683: a
L23684: 
L23685: .
L23686: (B.16)
L23687: B.4.5
L23688: Linear algebra
L23689: Linear algebra is the mathematics of linear functions, which have the form:
L23690: f[z1, z2, . . . zD] = ϕ1z1 + ϕ2z2 + . . . ϕDzD,
L23691: (B.17)
L23692: where ϕ1, . . . , ϕD are parameters that define the function.
L23693: We often add a constant
L23694: term ϕ0 to the right-hand side. This is technically an aﬀine function but is commonly
L23695: referred to as linear in machine learning. We adopt this convention throughout.
L23696: B.4.6
L23697: Linear equations in matrix form
L23698: Consider a collection of linear functions:
L23699: y1
L23700: =
L23701: ϕ10 + ϕ11z1 + ϕ12z2 + ϕ13z3
L23702: y2
L23703: =
L23704: ϕ20 + ϕ21z1 + ϕ22z2 + ϕ23z3
L23705: y3
L23706: =
L23707: ϕ30 + ϕ31z1 + ϕ32z2 + ϕ33z3.
L23708: (B.18)
L23709: These can be written in matrix form as:
L23710: Draft: please send errata to udlbookmail@gmail.com.
L23713: <!-- page 462 -->
L23714: 448
L23715: B
L23716: Mathematics
L23717: 
L23718: 
L23719: y1
L23720: y2
L23721: y3
L23722: 
L23723: =
L23724: 
L23725: 
L23726: ϕ10
L23727: ϕ20
L23728: ϕ30
L23729: 
L23730: +
L23731: 
L23732: 
L23733: ϕ11
L23734: ϕ12
L23735: ϕ13
L23736: ϕ21
L23737: ϕ22
L23738: ϕ23
L23739: ϕ31
L23740: ϕ32
L23741: ϕ33
L23742: 
L23743: 
L23744: 
L23745: 
L23746: z1
L23747: z2
L23748: z3
L23749: 
L23750: ,
L23751: (B.19)
L23752: or as y = ϕ0 + Φz for short, where yi = ϕi0 + P3
L23753: j=1 ϕijzj.
L23754: B.5
L23755: Matrix calculus
L23756: Most readers of this book will be accustomed to the idea that if we have a function
L23757: y = f[x], we can compute the derivative ∂y/∂x, and this represents how y changes when
L23758: we make a small change in x. This idea extends to functions y = f[x] mapping a vector
L23759: x to a scalar y, functions y = f[x] mapping a vector x to a vector y, functions y = f[X]
L23760: mapping a matrix X to a vector y, and so on. The rules of matrix calculus help us
L23761: compute derivatives of these quantities. The derivatives take the following forms:
L23762: • For a function y = f[x] where y ∈R and x ∈RD, the derivative ∂y/∂x is also a
L23763: D-dimensional vector, where the ith element is computed as ∂y/∂xi.
L23764: • For a function y = f[x] where y ∈RDy and x ∈RDx, the derivative ∂y/∂x is
L23765: a Dx × Dy matrix where element (i, j) contains the derivative ∂yj/∂xi. This is
L23766: known as a Jacobian and is sometimes written as ∇xy in other documents.
L23767: • For a function y = f[X] where y ∈RDy and X ∈RD1×D2, the derivative ∂y/∂X
L23768: is a 3D tensor containing the derivatives ∂yi/∂xjk.
L23769: Often these matrix and vector derivatives have superficially similar forms to the scalar
L23770: case. For example, we have:
L23771: y = ax
L23772: −→
L23773: ∂y
L23774: ∂x = a,
L23775: (B.20)
L23776: and
L23777: y = Ax
L23778: −→
L23779: ∂y
L23780: ∂x = AT .
L23781: (B.21)
L23782: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L23785: <!-- page 463 -->
L23786: Appendix C
L23787: Probability
L23788: Probability is critical to deep learning. In supervised learning, deep networks implic-
L23789: itly rely on a probabilistic formulation of the loss function. In unsupervised learning,
L23790: generative models aim to produce samples that are drawn from the same probability
L23791: distribution as the training data. Reinforcement learning occurs within Markov decision
L23792: processes, and these are defined in terms of probability distributions. This appendix
L23793: provides a primer for probability as used in machine learning.
L23794: C.1
L23795: Random variables and probability distributions
L23796: A random variable x denotes a quantity that is uncertain. It may be discrete (take only
L23797: certain values, for example integers) or continuous (take any value on a continuum, for
L23798: example real numbers). If we observe several instances of a random variable x, it will
L23799: take different values, and the relative propensity to take different values is described by
L23800: a probability distribution Pr(x).
L23801: For a discrete variable, this distribution associates a probability Pr(x=k) ∈[0, 1] with
L23802: each potential outcome k, and the sum of these probabilities is one. For a continuous
L23803: variable, there is a non-negative probability density Pr(x = a) ≥0 associated with each
L23804: value a in the domain of x, and the integral of this probability density function (PDF)
L23805: over this domain must be one. This density can be greater than one for any point a.
L23806: From here on, we assume that the random variables are continuous. The ideas are exactly
L23807: the same for discrete distributions but with sums replacing integrals.
L23808: C.1.1
L23809: Joint probability
L23810: Consider the case where we have two random variables x and y. The joint distribu-
L23811: tion Pr(x, y) tells us about the propensity that x and y take particular combinations of
L23812: values (figure C.1a). Now there is a non-negative probability density Pr(x = a, y = b)
L23813: associated with each pair of values x = a and y = b and this must satisfy:
L23814: Draft: please send errata to udlbookmail@gmail.com.
L23817: <!-- page 464 -->
L23818: 450
L23819: C
L23820: Probability
L23821: Figure C.1 Joint and marginal distribu-
L23822: tions. a) The joint distribution Pr(x, y)
L23823: captures the propensity of variables x
L23824: and y to take different combinations of
L23825: values. Here, the probability density is
L23826: represented by the color map, so brighter
L23827: positions are more probable. For exam-
L23828: ple, the combination x=6, y =6 is much
L23829: less likely to be observed than the com-
L23830: bination x = 5, y = 0. b) The marginal
L23831: distribution Pr(x) of variable x can be
L23832: recovered by integrating over y. c) The
L23833: marginal distribution Pr(y) of variable y
L23834: can be recovered by integrating over x.
L23835: ZZ
L23836: Pr(x, y) · dxdy = 1.
L23837: (C.1)
L23838: This idea extends to more than two variables, so the joint density of x, y, and z is written
L23839: as Pr(x, y, z). Sometimes, we store multiple random variables in a vector x, and we write
L23840: their joint density as Pr(x). Extending this, we can write the joint density of all of the
L23841: variables in two vectors x and y as Pr(x, y).
L23842: C.1.2
L23843: Marginalization
L23844: If we know the joint distribution Pr(x, y) over two variables, we can recover the marginal
L23845: distributions Pr(x) and Pr(y) by integrating over the other variable (figure C.1b-c):
L23846: Z
L23847: Pr(x, y) · dx
L23848: =
L23849: Pr(y)
L23850: Z
L23851: Pr(x, y) · dy
L23852: =
L23853: Pr(x).
L23854: (C.2)
L23855: This process is called marginalization and has the interpretation that we are comput-
L23856: ing the distribution of one variable regardless of the value the other one took.
L23857: The
L23858: idea of marginalization extends to higher dimensions, so if we have a joint distribu-
L23859: tion Pr(x, y, z), we can recover the joint distribution Pr(x, z) by integrating over y.
L23860: C.1.3
L23861: Conditional probability and likelihood
L23862: The conditional probability Pr(x|y) is the probability of variable x taking a certain value,
L23863: assuming we know the value of y. The vertical line is read as the English word “given,”
L23864: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L23867: <!-- page 465 -->
L23868: C.1
L23869: Random variables and probability distributions
L23870: 451
L23871: Figure C.2 Conditional distributions. a) Joint distribution Pr(x, y) of variables x
L23872: and y. b) The conditional probability Pr(x|y = 3.0) of variable x, given that y
L23873: takes the value 3.0, is found by taking the horizontal “slice” Pr(x, y = 3.0) of
L23874: the joint probability (top cyan line in panel a), and dividing this by the total
L23875: area Pr(y = 3.0) in that slice so that it forms a valid probability distribution
L23876: that integrates to one. c) The joint probability Pr(x, y=−1.0) is found similarly
L23877: using the slice at y =−1.0.
L23878: so Pr(x|y) is the probability of x given y. The conditional probability Pr(x|y) can be
L23879: found by taking a slice through the joint distribution Pr(x, y) for a fixed y. This slice is
L23880: then divided by the probability of that value y occurring (the total area under the slice)
L23881: so that the conditional distribution sums to one (figure C.2):
L23882: Pr(x|y) = Pr(x, y)
L23883: Pr(y) .
L23884: (C.3)
L23885: Similarly,
L23886: Pr(y|x) = Pr(x, y)
L23887: Pr(x) .
L23888: (C.4)
L23889: When we consider the conditional probability Pr(x|y) as a function of x, it must sum
L23890: to one. When we consider the same quantity Pr(x|y) as a function of y, it is termed the
L23891: likelihood of x given y and does not have to sum to one.
L23892: C.1.4
L23893: Bayes’ rule
L23894: From equations C.3 and C.4, we get two expressions for the joint probability Pr(x, y):
L23895: Pr(x, y) = Pr(x|y)Pr(y) = Pr(y|x)Pr(x),
L23896: (C.5)
L23897: which we can rearrange to get:
L23898: Draft: please send errata to udlbookmail@gmail.com.
L23901: <!-- page 466 -->
L23902: 452
L23903: C
L23904: Probability
L23905: Figure C.3 Independence. a) When two variables x and y are independent, the
L23906: joint distribution factors into the product of marginal distributions, so Pr(x, y) =
L23907: Pr(x)Pr(y). Independence implies that knowing the value of one variable tells
L23908: us nothing about the other.
L23909: b–c) Accordingly, all of the conditional distribu-
L23910: tions Pr(x|y = •) are the same and are equal to the marginal distribution Pr(x).
L23911: Pr(x|y) = Pr(y|x)Pr(x)
L23912: Pr(y)
L23913: .
L23914: (C.6)
L23915: This expression relates the conditional probability Pr(x|y) of x given y to the conditional
L23916: probability Pr(y|x) of y given x and is known as Bayes’ rule.
L23917: Each term in this Bayes’ rule has a name. The term Pr(y|x) is the likelihood of y
L23918: given x, and the term Pr(x) is the prior probability of x. The denominator Pr(y) is
L23919: known as the evidence, and the left-hand side Pr(x|y) is termed the posterior probability
L23920: of x given y. The equation maps from the prior Pr(x) (what we know about x before
L23921: observing y) to the posterior Pr(x|y) (what we know about x after observing y).
L23922: C.1.5
L23923: Independence
L23924: If the value of the random variable y tells us nothing about x and vice-versa, we say
L23925: that x and y are independent, and we can write Pr(x|y) = Pr(x) and Pr(y|x) = Pr(y).
L23926: It follows that all of the conditional distributions Pr(y|x = •) are identical, as are the
L23927: conditional distributions Pr(x|y=•).
L23928: Starting from the first expression for the joint probability in equation C.5, we see
L23929: that the joint distribution becomes the product of the marginal distributions:
L23930: Pr(x, y)
L23931: =
L23932: Pr(x|y)Pr(y) = Pr(x)Pr(y)
L23933: (C.7)
L23934: when the variables are independent (figure C.3).
L23935: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L23938: <!-- page 467 -->
L23939: C.2
L23940: Expectation
L23941: 453
L23942: C.2
L23943: Expectation
L23944: Consider a function f[x] and a probability distribution Pr(x) defined over x. The ex-
L23945: pected value of a function f[•] of a random variable x with respect to the probability
L23946: distribution Pr(x) is defined as:
L23947: Ex
L23948: 
L23949: f[x]
L23950: 
L23951: =
L23952: Z
L23953: f[x]Pr(x)dx.
L23954: (C.8)
L23955: As the name suggests, this is the expected or average value of f[x] after taking into account
L23956: the probability of seeing different values of x. This idea generalizes to functions f[•, •] of
L23957: more than one random variable:
L23958: Ex,y
L23959: 
L23960: f[x, y]
L23961: 
L23962: =
L23963: Z Z
L23964: f[x, y]Pr(x, y)dxdy.
L23965: (C.9)
L23966: An expectation is always taken with respect to a distribution over one or more variables.
L23967: However, we don’t usually make this explicit when the choice of distribution is obvious
L23968: and write E[f[x]] instead of Ex[f[x]].
L23969: If we drew a large number I of samples {xi}I
L23970: i=1 from Pr(x), calculated f[xi] for
L23971: each sample and took the average of these values, the result would approximate the
L23972: expectation E[f[x]] of the function:
L23973: Ex
L23974: 
L23975: f[x]
L23976: 
L23977: ≈1
L23978: I
L23979: I
L23980: X
L23981: i=1
L23982: f[xi].
L23983: (C.10)
L23984: C.2.1
L23985: Rules for manipulating expectations
L23986: There are four rules for manipulating expectations:
L23987: E
L23988: 
L23989: k
L23990: 
L23991: =
L23992: k
L23993: E
L23994: 
L23995: k · f[x]
L23996: 
L23997: =
L23998: k · E
L23999: 
L24000: f[x]
L24001: 
L24002: E
L24003: 
L24004: f[x] + g[x]
L24005: 
L24006: =
L24007: E
L24008: 
L24009: f[x]
L24010: 
L24011: + E
L24012: 
L24013: g[x]
L24014: 
L24015: Ex,y
L24016: 
L24017: f[x] · g[y]
L24018: 
L24019: =
L24020: Ex
L24021: 
L24022: f[x]
L24023: 
L24024: · Ey
L24025: 
L24026: g[y]
L24027: 
L24028: if x, y independent,
L24029: (C.11)
L24030: where k is an arbitrary constant. These are proven below for the continuous case.
L24031: Rule 1:
L24032: The expectation E[k] of a constant value k is just k.
L24033: E
L24034: 
L24035: k
L24036: 
L24037: =
L24038: Z
L24039: k · Pr(x)dx
L24040: =
L24041: k ·
L24042: Z
L24043: Pr(x)dx
L24044: =
L24045: k.
L24046: (C.12)
L24047: Draft: please send errata to udlbookmail@gmail.com.
L24050: <!-- page 468 -->
L24051: 454
L24052: C
L24053: Probability
L24054: Rule 2:
L24055: The expectation E[k · f[x]] of a constant k times a function of the variable x
L24056: is k times the expectation E[f[x]] of the function:
L24057: E
L24058: 
L24059: k · f[x]
L24060: 
L24061: =
L24062: Z
L24063: k · f[x]Pr(x)dx
L24064: =
L24065: k ·
L24066: Z
L24067: f[x]Pr(x)dx
L24068: =
L24069: k · E
L24070: 
L24071: f[x]
L24072: 
L24073: .
L24074: (C.13)
L24075: Rule 3:
L24076: The expectation of a sum E[f[x] + g[x]] of terms is the sum E[f[x]] + E[g[x]] of
L24077: the expectations:
L24078: E
L24079: 
L24080: f[x] + g[x]
L24081: 
L24082: =
L24083: Z
L24084: (f[x] + g[x]) · Pr(x)dx
L24085: =
L24086: Z  f[x] · Pr(x) + g[x] · Pr(x)
L24087: 
L24088: dx
L24089: =
L24090: Z
L24091: f[x] · Pr(x)dx +
L24092: Z
L24093: g[x] · Pr(x)dx
L24094: =
L24095: E
L24096: 
L24097: f[x]
L24098: 
L24099: + E
L24100: 
L24101: g[x]
L24102: 
L24103: .
L24104: (C.14)
L24105: Rule 4:
L24106: The expectation of a product E[f[x]·g[y]] of terms is the product E[f[x]]·E[g[y]]
L24107: if x and y are independent.
L24108: E
L24109: 
L24110: f[x] · g[y]
L24111: 
L24112: =
L24113: Z Z
L24114: f[x] · g[y]Pr(x, y)dxdy
L24115: =
L24116: Z Z
L24117: f[x] · g[y]Pr(x)Pr(y)dxdy
L24118: =
L24119: Z
L24120: f[x] · Pr(x)dx
L24121: Z
L24122: g[y] · Pr(y)dy
L24123: =
L24124: E
L24125: 
L24126: f[x]
L24127: 
L24128: E
L24129: 
L24130: g[y]
L24131: 
L24132: ,
L24133: (C.15)
L24134: where we used the definition of independence (equation C.7) between the first two lines.
L24135: The four rules generalize to the multivariate case:
L24136: E
L24137: 
L24138: A
L24139: 
L24140: =
L24141: A
L24142: E
L24143: 
L24144: A · f[x]
L24145: 
L24146: =
L24147: AE
L24148: 
L24149: f[x]
L24150: 
L24151: E
L24152: 
L24153: f[x] + g[x]
L24154: 
L24155: =
L24156: E
L24157: 
L24158: f[x]
L24159: 
L24160: + E
L24161: 
L24162: g[x]
L24163: 
L24164: Ex,y
L24165: 
L24166: f[x]T g[y]
L24167: 
L24168: =
L24169: Ex
L24170: 
L24171: f[x]
L24172: T Ey
L24173: 
L24174: g[y]
L24175: 
L24176: if x, y independent,
L24177: (C.16)
L24178: where now A is a constant matrix and f[x] is a function of the vector x that returns a
L24179: vector, and g[y] is a function of the vector y that also returns a vector.
L24180: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L24183: <!-- page 469 -->
L24184: C.2
L24185: Expectation
L24186: 455
L24187: C.2.2
L24188: Mean, variance, and covariance
L24189: For some choices of function f[•], the expectation is given a special name. These quan-
L24190: tities are often used to summarize the properties of complex distributions. For example,
L24191: when f[x] = x, the resulting expectation E[x] is termed the mean, µ.
L24192: It is a mea-
L24193: sure of the center of a distribution. Similarly, the expected squared deviation from the
L24194: mean E[(x −µ)2] is termed the variance, σ2. This is a measure of the spread of the
L24195: distribution. The standard deviation σ is the positive square root of the variance. It
L24196: also measures the spread of the distribution but has the merit that it is expressed in the
L24197: same units as the variable x.
L24198: As the name suggests, the covariance E[(x −µx)(y −µy)] of two variables x and y
L24199: measures the degree to which they co-vary. Here µx and µy represent the mean of the
L24200: variables x and y, respectively. The covariance will be large when the variance of both
L24201: variables is large and when the value of x tends to increase when the value of y increases.
L24202: If two variables are independent, then their covariance is zero. However, a covariance
L24203: of zero does not imply independence. For example, consider a distribution Pr(x, y) where
L24204: the probability is uniformly distributed on a circle of radius one centered on the origin
L24205: of the x, y plane. There is no tendency on average for x to increase when y increases or
L24206: vice-versa. However, knowing the value of x = 0 tells us that y has an equal chance of
L24207: taking the values ±1, so the variables cannot be independent.
L24208: The covariances of multiple random variables stored in a column vector x ∈RD can be
L24209: represented by the D×D covariance matrix E[(x −µx)(x −µx)T ], where the vector µx
L24210: contains the means E[x]. The element at position (i, j) of this matrix represents the
L24211: covariance between variables xi and xj.
L24212: C.2.3
L24213: Variance identity
L24214: The rules of expectation (appendix C.2.1) can be used to prove the following identity
L24215: that allows us to write the variance in a different form:
L24216: E
L24217: 
L24218: (x −µ)2
L24219: = E
L24220: 
L24221: x2
L24222: −E
L24223: 
L24224: x
L24225: 2.
L24226: (C.17)
L24227: Proof:
L24228: E
L24229: 
L24230: (x −µ)2
L24231: =
L24232: E
L24233: 
L24234: x2 −2µx + µ2
L24235: =
L24236: E
L24237: 
L24238: x2
L24239: −E
L24240: 
L24241: 2µx
L24242: 
L24243: + E
L24244: 
L24245: µ2
L24246: =
L24247: E
L24248: 
L24249: x2
L24250: −2µ · E
L24251: 
L24252: x
L24253: 
L24254: + µ2
L24255: =
L24256: E
L24257: 
L24258: x2
L24259: −2µ2 + µ2
L24260: =
L24261: E
L24262: 
L24263: x2
L24264: −µ2
L24265: =
L24266: E
L24267: 
L24268: x2
L24269: −E
L24270: 
L24271: x
L24272: 2,
L24273: (C.18)
L24274: where we have used rule 3 between lines one and two, rules 1 and 2 between lines two
L24275: and three, and the definition µ = E[x] in lines four and six.
L24276: Draft: please send errata to udlbookmail@gmail.com.
L24279: <!-- page 470 -->
L24280: 456
L24281: C
L24282: Probability
L24283: C.2.4
L24284: Standardization
L24285: Setting the mean of a random variable to zero and the variance to one is known as
L24286: standardization. This is achieved using the transformation:
L24287: z = x −µ
L24288: σ
L24289: ,
L24290: (C.19)
L24291: where µ is the mean of x and σ is the standard deviation.
L24292: Proof:
L24293: The mean of the new distribution over z is given by:
L24294: E[z]
L24295: =
L24296: E
L24297: x −µ
L24298: σ
L24299: 
L24300: =
L24301: 1
L24302: σ E
L24303: 
L24304: x −µ
L24305: 
L24306: =
L24307: 1
L24308: σ
L24309:  E
L24310: 
L24311: x
L24312: 
L24313: −E
L24314: 
L24315: µ
L24316: 
L24317: =
L24318: 1
L24319: σ (µ −µ) = 0,
L24320: (C.20)
L24321: where again, we have used the four rules for manipulating expectations. The variance of
L24322: the new distribution is given by:
L24323: E
L24324: 
L24325: (z −µz)2
L24326: =
L24327: E
L24328: 
L24329: (z −E[z])2
L24330: =
L24331: E
L24332: 
L24333: z2
L24334: =
L24335: E
L24336: "x −µ
L24337: σ
L24338: 2#
L24339: =
L24340: 1
L24341: σ2 · E[(x −µ)2]
L24342: =
L24343: 1
L24344: σ2 · σ2 = 1.
L24345: (C.21)
L24346: By a similar argument, we can take a standardized variable z with mean zero and unit
L24347: variance and convert it to a variable x with mean µ and variance σ2 using:
L24348: x = µ + σz.
L24349: (C.22)
L24350: In the multivariate case, we can standardize a variable x with mean µ and covariance
L24351: matrix Σ using:
L24352: z = Σ−1/2(x −µ).
L24353: (C.23)
L24354: The result will have a mean E[z] = 0 and an identity covariance matrix E[(z −E[z])(z −
L24355: E[z])T ] = I. To reverse this process, we use:
L24356: x = µ + Σ1/2z.
L24357: (C.24)
L24358: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L24361: <!-- page 471 -->
L24362: C.3
L24363: Normal probability distribution
L24364: 457
L24365: C.3
L24366: Normal probability distribution
L24367: Probability distributions used in this book include the Bernoulli distribution (figure 5.6),
L24368: categorical distribution (figure 5.9), Poisson distribution (figure 5.15), von Mises distri-
L24369: bution (figure 5.13), and mixture of Gaussians (figures 5.14 and 17.1). However, the
L24370: most common distribution in machine learning is the normal or Gaussian distribution.
L24371: C.3.1
L24372: Univariate normal distribution
L24373: A univariate normal distribution (figure 5.3) over scalar variable x has two parameters,
L24374: the mean µ and the variance σ2, and is defined as:
L24375: Pr(x) = Normx[µ, σ2] =
L24376: 1
L24377: √
L24378: 2πσ2 exp
L24379: 
L24380: −(x −µ)2
L24381: 2σ2
L24382: 
L24383: .
L24384: (C.25)
L24385: Unsurprisingly, the mean E[x] of a normally distributed variable is given by the mean
L24386: parameter µ and the variance E[(x −E[x])2] by the variance parameter σ2. When the
L24387: mean is zero and the variance is one, we refer to this as a standard normal distribution.
L24388: The shape of the normal distribution can be inferred from the following argument.
L24389: The term −(x−µ)2/2σ2 is a quadratic function that falls away from zero when x = µ at a
L24390: rate that increases when σ becomes smaller. When we pass this through the exponential
L24391: function (figure B.1), we get a bell-shaped curve, which has a value of one at x = µ
L24392: and falls away to either side. Dividing by the constant
L24393: √
L24394: 2πσ2 ensures that the function
L24395: integrates to one and is a valid distribution.
L24396: It follows from this argument that the
L24397: mean µ control the position of the center of the bell curve, and the square root σ of the
L24398: variance (the standard deviation) controls the width of the bell curve.
L24399: C.3.2
L24400: Multivariate normal distribution
L24401: The multivariate normal distribution generalizes the normal distribution to describe the
L24402: probability over a vector quantity x of length D. It is defined by a D × 1 mean vector µ
L24403: and a symmetric positive definite D × D covariance matrix Σ:
L24404: Normx[µ, Σ] =
L24405: 1
L24406: (2π)D/2|Σ|1/2 exp
L24407: 
L24408: −(x −µ)T Σ−1(x −µ)
L24409: 2
L24410: 
L24411: .
L24412: (C.26)
L24413: The interpretation is similar to the univariate case. The quadratic term −(x−µ)T Σ−1(x−
L24414: µ)/2 returns a scalar that decreases as x grows further from the mean µ, at a rate that
L24415: depends on the matrix Σ. This is turned into a bell-curve shape by the exponential, and
L24416: dividing by (2π)D/2|Σ|1/2 ensures that the distribution integrates to one.
L24417: The covariance matrix can take spherical, diagonal, and full forms:
L24418: Σspher =
L24419: 
L24420: σ2
L24421: 0
L24422: 0
L24423: σ2
L24424: 
L24425: Σdiag =
L24426: 
L24427: σ2
L24428: 1
L24429: 0
L24430: 0
L24431: σ2
L24432: 2
L24433: 
L24434: Σfull =
L24435: 
L24436: σ2
L24437: 11
L24438: σ2
L24439: 12
L24440: σ2
L24441: 21
L24442: σ2
L24443: 22
L24444: 
L24445: .
L24446: (C.27)
L24447: Draft: please send errata to udlbookmail@gmail.com.
L24450: <!-- page 472 -->
L24451: 458
L24452: C
L24453: Probability
L24454: Figure C.4 Bivariate normal distribution. a–b) When the covariance matrix is a
L24455: multiple of the identity matrix, the isocontours are circles, and we refer to this as
L24456: spherical covariance. c–d) When the covariance is an arbitrary diagonal matrix,
L24457: the isocontours are axis-aligned ellipses, and we refer to this as diagonal covariance
L24458: e–f) When the covariance is an arbitrary symmetric positive definite matrix, the
L24459: iso-contours are general ellipses, and we refer to this as full covariance.
L24460: In two dimensions (figure C.4), spherical covariances produce circular iso-density
L24461: contours, and diagonal covariances produce ellipsoidal iso-contours that are aligned with
L24462: the coordinate axes. Full covariances produce general ellipsoidal iso-density contours.
L24463: When the covariance is spherical or diagonal, the individual variables are independent:
L24464: Pr(x1, x2)
L24465: =
L24466: 1
L24467: 2π
L24468: p
L24469: |Σ|
L24470: exp
L24471: 
L24472: −0.5
L24473:  x1
L24474: x2
L24475: 
L24476: Σ−1
L24477: x1
L24478: x2
L24479: 
L24480: =
L24481: 1
L24482: 2πσ1σ2
L24483: exp
L24484: 
L24485: −0.5
L24486:  x1
L24487: x2
L24488:  
L24489: σ−2
L24490: 1
L24491: 0
L24492: 0
L24493: σ−2
L24494: 2
L24495:  
L24496: x1
L24497: x2
L24498: 
L24499: =
L24500: 1
L24501: p
L24502: 2πσ2
L24503: 1
L24504: exp
L24505: 
L24506: −x2
L24507: 1
L24508: 2σ2
L24509: 1
L24510: 
L24511: ·
L24512: 1
L24513: p
L24514: 2πσ2
L24515: 2
L24516: exp
L24517: 
L24518: −x2
L24519: 2
L24520: 2σ2
L24521: 2
L24522: 
L24523: =
L24524: Pr(x1) · Pr(x2).
L24525: (C.28)
L24526: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L24529: <!-- page 473 -->
L24530: C.3
L24531: Normal probability distribution
L24532: 459
L24533: Figure C.5 Change of variables.
L24534: a) The conditional distribution Pr(x|y) is a
L24535: normal distribution with constant variance and a mean that depends linearly on y.
L24536: Cyan distribution shows one example for y = −0.2. b) This is proportional to
L24537: the conditional probability Pr(y|x), which is a normal distribution with constant
L24538: variance and a mean that depends linearly on x. Cyan distribution shows one
L24539: example for x = −3.
L24540: C.3.3
L24541: Product of two normal distributions
L24542: The product of two normal distributions is proportional to a third normal distribution
L24543: according to the relation:
L24544: Normx[a, A]Normx[b, B] ∝Normx
L24545: h
L24546: (A−1 + B−1)−1(A−1a + B−1b), (A−1 + B−1)−1i
L24547: .
L24548: (C.29)
L24549: This is easily proved by multiplying out the exponential terms and completing the square
L24550: (see problem 18.5).
L24551: C.3.4
L24552: Change of variable
L24553: When the mean of a multivariate normal in x is a linear function Ay + b of a second
L24554: variable y, this is proportional to another normal distribution in y, where the mean is a
L24555: linear function of x:
L24556: Normx [Ay + b, Σ] ∝Normy[(AT Σ−1A)−1AT Σ−1(x −b), (AT Σ−1A)−1].
L24557: (C.30)
L24558: At first sight, this relation is rather opaque, but figure C.5 shows the case for scalar x
L24559: and y, which is easy to understand. As for the previous relation, this can be proved by
L24560: expanding the quadratic product in the exponential term and completing the square to
L24561: make this a distribution in y. (see problem 18.4).
L24562: Draft: please send errata to udlbookmail@gmail.com.
