L00001: <!-- page 1 -->
L00002: Understanding Deep Learning
L00003: Simon J.D. Prince
L00004: February 8, 2026
L00005: The most recent version of this document can be found at http://udlbook.com.
L00006: Copyright in this work has been licensed exclusively to The MIT Press,
L00007: https://mitpress.mit.edu, which released the final version to the public in December 2023.
L00008: Inquiries regarding rights should be addressed to the MIT Press, Rights & Permissions
L00009: Department.
L00010: This work is subject to a Creative Commons CC-BY-NC-ND license.
L00011: I would really appreciate help improving this document. No detail too small! Please contact
L00012: me with suggestions, factual inaccuracies, ambiguities, questions, and errata via github or by
L00013: e-mail at udlbookmail@gmail.com.
L00016: <!-- page 3 -->
L00017: This book is dedicated to Blair, Calvert, Coppola, Ellison, Faulkner, Kerpatenko, Morris,
L00018: Robinson, Sträussler, Wallace, Waymon, Wojnarowicz, and all the others whose work is
L00019: even more important and interesting than deep learning.
L00022: <!-- page 5 -->
L00023: Contents
L00024: Preface
L00025: ix
L00026: Acknowledgements
L00027: xi
L00028: 1
L00029: Introduction
L00030: 1
L00031: 1.1
L00032: Supervised learning . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
L00033: 1
L00034: 1.2
L00035: Unsupervised learning
L00036: . . . . . . . . . . . . . . . . . . . . . . . . . . . .
L00037: 7
L00038: 1.3
L00039: Reinforcement learning . . . . . . . . . . . . . . . . . . . . . . . . . . . .
L00040: 11
L00041: 1.4
L00042: Ethics
L00043: . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
L00044: 12
L00045: 1.5
L00046: Structure of book . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
L00047: 15
L00048: 1.6
L00049: Other books . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
L00050: 15
L00051: 1.7
L00052: How to read this book
L00053: . . . . . . . . . . . . . . . . . . . . . . . . . . . .
L00054: 16
L00055: 2
L00056: Supervised learning
L00057: 17
L00058: 2.1
L00059: Supervised learning overview . . . . . . . . . . . . . . . . . . . . . . . . .
L00060: 17
L00061: 2.2
L00062: Linear regression example
L00063: . . . . . . . . . . . . . . . . . . . . . . . . . .
L00064: 18
L00065: 2.3
L00066: Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
L00067: 22
L00068: 3
L00069: Shallow neural networks
L00070: 25
L00071: 3.1
L00072: Neural network example
L00073: . . . . . . . . . . . . . . . . . . . . . . . . . . .
L00074: 25
L00075: 3.2
L00076: Universal approximation theorem . . . . . . . . . . . . . . . . . . . . . .
L00077: 29
L00078: 3.3
L00079: Multivariate inputs and outputs . . . . . . . . . . . . . . . . . . . . . . .
L00080: 30
L00081: 3.4
L00082: Shallow neural networks: general case . . . . . . . . . . . . . . . . . . . .
L00083: 33
L00084: 3.5
L00085: Terminology . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
L00086: 35
L00087: 3.6
L00088: Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
L00089: 36
L00090: 4
L00091: Deep neural networks
L00092: 41
L00093: 4.1
L00094: Composing neural networks
L00095: . . . . . . . . . . . . . . . . . . . . . . . . .
L00096: 41
L00097: 4.2
L00098: From composing networks to deep networks
L00099: . . . . . . . . . . . . . . . .
L00100: 43
L00101: 4.3
L00102: Deep neural networks . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
L00103: 45
L00104: 4.4
L00105: Matrix notation . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
L00106: 48
L00107: 4.5
L00108: Shallow vs. deep neural networks
L00109: . . . . . . . . . . . . . . . . . . . . . .
L00110: 49
L00111: 4.6
L00112: Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
L00113: 52
L00114: Draft: please send errata to udlbookmail@gmail.com.
L00117: <!-- page 6 -->
L00118: iv
L00119: Contents
L00120: 5
L00121: Loss functions
L00122: 56
L00123: 5.1
L00124: Maximum likelihood
L00125: . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
L00126: 56
L00127: 5.2
L00128: Recipe for constructing loss functions . . . . . . . . . . . . . . . . . . . .
L00129: 60
L00130: 5.3
L00131: Example 1: univariate regression
L00132: . . . . . . . . . . . . . . . . . . . . . .
L00133: 61
L00134: 5.4
L00135: Example 2: binary classification . . . . . . . . . . . . . . . . . . . . . . .
L00136: 64
L00137: 5.5
L00138: Example 3: multiclass classification . . . . . . . . . . . . . . . . . . . . .
L00139: 67
L00140: 5.6
L00141: Multiple outputs
L00142: . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
L00143: 69
L00144: 5.7
L00145: Cross-entropy loss . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
L00146: 71
L00147: 5.8
L00148: Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
L00149: 72
L00150: 6
L00151: Fitting models
L00152: 77
L00153: 6.1
L00154: Gradient descent
L00155: . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
L00156: 77
L00157: 6.2
L00158: Stochastic gradient descent . . . . . . . . . . . . . . . . . . . . . . . . . .
L00159: 83
L00160: 6.3
L00161: Momentum
L00162: . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
L00163: 86
L00164: 6.4
L00165: Adam . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
L00166: 88
L00167: 6.5
L00168: Training algorithm hyperparameters
L00169: . . . . . . . . . . . . . . . . . . . .
L00170: 91
L00171: 6.6
L00172: Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
L00173: 91
L00174: 7
L00175: Gradients and initialization
L00176: 96
L00177: 7.1
L00178: Problem definitions . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
L00179: 96
L00180: 7.2
L00181: Computing derivatives
L00182: . . . . . . . . . . . . . . . . . . . . . . . . . . . .
L00183: 97
L00184: 7.3
L00185: Toy example . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 100
L00186: 7.4
L00187: Backpropagation algorithm . . . . . . . . . . . . . . . . . . . . . . . . . . 103
L00188: 7.5
L00189: Parameter initialization . . . . . . . . . . . . . . . . . . . . . . . . . . . . 107
L00190: 7.6
L00191: Example training code . . . . . . . . . . . . . . . . . . . . . . . . . . . . 111
L00192: 7.7
L00193: Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 111
L00194: 8
L00195: Measuring performance
L00196: 118
L00197: 8.1
L00198: Training a simple model
L00199: . . . . . . . . . . . . . . . . . . . . . . . . . . . 118
L00200: 8.2
L00201: Sources of error . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 120
L00202: 8.3
L00203: Reducing error . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 124
L00204: 8.4
L00205: Double descent
L00206: . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 127
L00207: 8.5
L00208: Choosing hyperparameters . . . . . . . . . . . . . . . . . . . . . . . . . . 132
L00209: 8.6
L00210: Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 133
L00211: 9
L00212: Regularization
L00213: 138
L00214: 9.1
L00215: Explicit regularization
L00216: . . . . . . . . . . . . . . . . . . . . . . . . . . . . 138
L00217: 9.2
L00218: Implicit regularization
L00219: . . . . . . . . . . . . . . . . . . . . . . . . . . . . 141
L00220: 9.3
L00221: Heuristics to improve performance . . . . . . . . . . . . . . . . . . . . . . 143
L00222: 9.4
L00223: Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 154
L00224: 10 Convolutional networks
L00225: 161
L00226: 10.1
L00227: Invariance and equivariance
L00228: . . . . . . . . . . . . . . . . . . . . . . . . . 161
L00229: 10.2
L00230: Convolutional networks for 1D inputs . . . . . . . . . . . . . . . . . . . . 163
L00231: 10.3
L00232: Convolutional networks for 2D inputs . . . . . . . . . . . . . . . . . . . . 170
L00233: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L00236: <!-- page 7 -->
L00237: Contents
L00238: v
L00239: 10.4
L00240: Downsampling and upsampling
L00241: . . . . . . . . . . . . . . . . . . . . . . . 171
L00242: 10.5
L00243: Applications . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 174
L00244: 10.6
L00245: Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 179
L00246: 11 Residual networks
L00247: 186
L00248: 11.1
L00249: Sequential processing . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 186
L00250: 11.2
L00251: Residual connections and residual blocks . . . . . . . . . . . . . . . . . . 189
L00252: 11.3
L00253: Exploding gradients in residual networks . . . . . . . . . . . . . . . . . . 192
L00254: 11.4
L00255: Batch normalization
L00256: . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 192
L00257: 11.5
L00258: Common residual architectures
L00259: . . . . . . . . . . . . . . . . . . . . . . . 195
L00260: 11.6
L00261: Why do nets with residual connections perform so well?
L00262: . . . . . . . . . 199
L00263: 11.7
L00264: Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 199
L00265: 12 Transformers
L00266: 207
L00267: 12.1
L00268: Processing text data
L00269: . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 207
L00270: 12.2
L00271: Dot-product self-attention . . . . . . . . . . . . . . . . . . . . . . . . . . 208
L00272: 12.3
L00273: Extensions to dot-product self-attention
L00274: . . . . . . . . . . . . . . . . . . 213
L00275: 12.4
L00276: Transformer layers
L00277: . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 215
L00278: 12.5
L00279: Transformers for natural language processing . . . . . . . . . . . . . . . . 216
L00280: 12.6
L00281: Encoder model example: BERT . . . . . . . . . . . . . . . . . . . . . . . 219
L00282: 12.7
L00283: Decoder model example: GPT3 . . . . . . . . . . . . . . . . . . . . . . . 222
L00284: 12.8
L00285: Encoder-decoder model example: machine translation . . . . . . . . . . . 226
L00286: 12.9
L00287: Transformers for long sequences . . . . . . . . . . . . . . . . . . . . . . . 227
L00288: 12.10 Transformers for images
L00289: . . . . . . . . . . . . . . . . . . . . . . . . . . . 228
L00290: 12.11 Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 232
L00291: 13 Graph neural networks
L00292: 240
L00293: 13.1
L00294: What is a graph? . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 240
L00295: 13.2
L00296: Graph representation . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 243
L00297: 13.3
L00298: Graph neural networks, tasks, and loss functions . . . . . . . . . . . . . . 245
L00299: 13.4
L00300: Graph convolutional networks . . . . . . . . . . . . . . . . . . . . . . . . 248
L00301: 13.5
L00302: Example: graph classification
L00303: . . . . . . . . . . . . . . . . . . . . . . . . 251
L00304: 13.6
L00305: Inductive vs. transductive models . . . . . . . . . . . . . . . . . . . . . . 252
L00306: 13.7
L00307: Example: node classification . . . . . . . . . . . . . . . . . . . . . . . . . 253
L00308: 13.8
L00309: Layers for graph convolutional networks
L00310: . . . . . . . . . . . . . . . . . . 256
L00311: 13.9
L00312: Edge graphs . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 260
L00313: 13.10 Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 261
L00314: 14 Unsupervised learning
L00315: 269
L00316: 14.1
L00317: Taxonomy of unsupervised learning models . . . . . . . . . . . . . . . . . 269
L00318: 14.2
L00319: What makes a good generative model? . . . . . . . . . . . . . . . . . . . 270
L00320: 14.3
L00321: Quantifying performance . . . . . . . . . . . . . . . . . . . . . . . . . . . 272
L00322: 14.4
L00323: Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 274
L00324: 15 Generative adversarial networks
L00325: 276
L00326: Draft: please send errata to udlbookmail@gmail.com.
L00329: <!-- page 8 -->
L00330: vi
L00331: Contents
L00332: 15.1
L00333: Discrimination as a signal
L00334: . . . . . . . . . . . . . . . . . . . . . . . . . . 276
L00335: 15.2
L00336: Improving stability . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 281
L00337: 15.3
L00338: Progressive growing, minibatch discrimination, and truncation . . . . . . 287
L00339: 15.4
L00340: Conditional generation . . . . . . . . . . . . . . . . . . . . . . . . . . . . 289
L00341: 15.5
L00342: Image translation . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 291
L00343: 15.6
L00344: StyleGAN . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 296
L00345: 15.7
L00346: Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 298
L00347: 16 Normalizing flows
L00348: 304
L00349: 16.1
L00350: 1D example
L00351: . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 304
L00352: 16.2
L00353: General case . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 307
L00354: 16.3
L00355: Invertible network layers . . . . . . . . . . . . . . . . . . . . . . . . . . . 309
L00356: 16.4
L00357: Multi-scale flows . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 317
L00358: 16.5
L00359: Applications . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 318
L00360: 16.6
L00361: Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 321
L00362: 17 Variational autoencoders
L00363: 327
L00364: 17.1
L00365: Latent variable models . . . . . . . . . . . . . . . . . . . . . . . . . . . . 327
L00366: 17.2
L00367: Nonlinear latent variable model . . . . . . . . . . . . . . . . . . . . . . . 328
L00368: 17.3
L00369: Training . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 331
L00370: 17.4
L00371: ELBO properties
L00372: . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 334
L00373: 17.5
L00374: Variational approximation . . . . . . . . . . . . . . . . . . . . . . . . . . 336
L00375: 17.6
L00376: The variational autoencoder . . . . . . . . . . . . . . . . . . . . . . . . . 336
L00377: 17.7
L00378: The reparameterization trick . . . . . . . . . . . . . . . . . . . . . . . . . 339
L00379: 17.8
L00380: Applications . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 340
L00381: 17.9
L00382: Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 343
L00383: 18 Diffusion models
L00384: 349
L00385: 18.1
L00386: Overview . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 349
L00387: 18.2
L00388: Encoder (forward process) . . . . . . . . . . . . . . . . . . . . . . . . . . 350
L00389: 18.3
L00390: Decoder model (reverse process) . . . . . . . . . . . . . . . . . . . . . . . 356
L00391: 18.4
L00392: Training . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 357
L00393: 18.5
L00394: Reparameterization of loss function . . . . . . . . . . . . . . . . . . . . . 361
L00395: 18.6
L00396: Implementation . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 363
L00397: 18.7
L00398: Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 368
L00399: 19 Reinforcement learning
L00400: 374
L00401: 19.1
L00402: Markov decision processes, returns, and policies . . . . . . . . . . . . . . 374
L00403: 19.2
L00404: Expected return . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 378
L00405: 19.3
L00406: Tabular reinforcement learning . . . . . . . . . . . . . . . . . . . . . . . . 382
L00407: 19.4
L00408: Fitted Q-learning . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 386
L00409: 19.5
L00410: Policy gradient methods
L00411: . . . . . . . . . . . . . . . . . . . . . . . . . . . 389
L00412: 19.6
L00413: Actor-critic methods
L00414: . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 394
L00415: 19.7
L00416: Offline reinforcement learning . . . . . . . . . . . . . . . . . . . . . . . . 395
L00417: 19.8
L00418: Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 396
L00419: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L00422: <!-- page 9 -->
L00423: Contents
L00424: vii
L00425: 20 Why does deep learning work?
L00426: 402
L00427: 20.1
L00428: The case against deep learning . . . . . . . . . . . . . . . . . . . . . . . . 402
L00429: 20.2
L00430: Factors that influence fitting performance
L00431: . . . . . . . . . . . . . . . . . 403
L00432: 20.3
L00433: Properties of loss functions . . . . . . . . . . . . . . . . . . . . . . . . . . 407
L00434: 20.4
L00435: Factors that determine generalization . . . . . . . . . . . . . . . . . . . . 411
L00436: 20.5
L00437: Do we need so many parameters? . . . . . . . . . . . . . . . . . . . . . . 415
L00438: 20.6
L00439: Do networks have to be deep? . . . . . . . . . . . . . . . . . . . . . . . . 418
L00440: 20.7
L00441: Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 419
L00442: 21 Deep learning and ethics
L00443: 421
L00444: 21.1
L00445: Value alignment . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 421
L00446: 21.2
L00447: Intentional misuse . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 427
L00448: 21.3
L00449: Other social, ethical, and professional issues . . . . . . . . . . . . . . . . 429
L00450: 21.4
L00451: Case study . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 431
L00452: 21.5
L00453: The value-free ideal of science . . . . . . . . . . . . . . . . . . . . . . . . 432
L00454: 21.6
L00455: Responsible AI research as a collective action problem
L00456: . . . . . . . . . . 433
L00457: 21.7
L00458: Ways forward . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 434
L00459: 21.8
L00460: Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 435
L00461: A Notation
L00462: 437
L00463: B Mathematics
L00464: 440
L00465: B.1
L00466: Functions
L00467: . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 440
L00468: B.2
L00469: Binomial coeﬀicients
L00470: . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 442
L00471: B.3
L00472: Vector, matrices, and tensors . . . . . . . . . . . . . . . . . . . . . . . . . 443
L00473: B.4
L00474: Special types of matrix . . . . . . . . . . . . . . . . . . . . . . . . . . . . 446
L00475: B.5
L00476: Matrix calculus . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 448
L00477: C Probability
L00478: 449
L00479: C.1
L00480: Random variables and probability distributions
L00481: . . . . . . . . . . . . . . 449
L00482: C.2
L00483: Expectation . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 453
L00484: C.3
L00485: Normal probability distribution . . . . . . . . . . . . . . . . . . . . . . . 457
L00486: C.4
L00487: Sampling . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 460
L00488: C.5
L00489: Distances between probability distributions . . . . . . . . . . . . . . . . . 460
L00490: Bibliography
L00491: 463
L00492: Index
L00493: 513
L00494: Draft: please send errata to udlbookmail@gmail.com.
L00497: <!-- page 11 -->
L00498: Preface
L00499: The history of deep learning is unusual in science. The perseverance of a small cabal of
L00500: scientists, working over twenty-five years in a seemingly unpromising area, has revolution-
L00501: ized a field and dramatically impacted society. Usually, when researchers investigate an
L00502: esoteric and apparently impractical corner of science or engineering, it remains just that
L00503: — esoteric and impractical. However, this was a notable exception. Despite widespread
L00504: skepticism, the systematic efforts of Yoshua Bengio, Geoffrey Hinton, Yann LeCun, and
L00505: others eventually paid off.
L00506: The title of this book is “Understanding Deep Learning” to distinguish it from vol-
L00507: umes that cover coding and other practical aspects. This text is primarily about the
L00508: ideas that underlie deep learning. The first part of the book introduces deep learning
L00509: models and discusses how to train them, measure their performance, and improve this
L00510: performance. The next part considers architectures that are specialized to images, text,
L00511: and graph data. These chapters require only introductory linear algebra, calculus, and
L00512: probability and should be accessible to any second-year undergraduate in a quantitative
L00513: discipline. Subsequent parts of the book tackle generative models and reinforcement
L00514: learning. These chapters require more knowledge of probability and calculus and target
L00515: more advanced students.
L00516: The title is also partly a joke — no-one really understands deep learning at the time of
L00517: writing. Modern deep networks learn piecewise linear functions with more regions than
L00518: there are atoms in the universe and can be trained with fewer data examples than model
L00519: parameters. It is neither obvious that we should be able to fit these functions reliably
L00520: nor that they should generalize well to new data. The penultimate chapter addresses
L00521: these and other aspects that are not yet fully understood. Regardless, deep learning will
L00522: change the world for better or worse. The final chapter discusses AI ethics and concludes
L00523: with an appeal for practitioners to consider the moral implications of their work.
L00524: Your time is precious, and I have striven to curate and present the material so you
L00525: can understand it as eﬀiciently as possible. The main body of each chapter comprises
L00526: a succinct description of only the most essential ideas, together with accompanying
L00527: illustrations. The appendices review all mathematical prerequisites, and there should be
L00528: no need to refer to external material. For readers wishing to delve deeper, each chapter
L00529: has associated problems, Python notebooks, and extensive background notes.
L00530: Writing a book is a lonely, grinding, multiple-year process and is only worthwhile if
L00531: the volume is widely adopted. If you enjoy reading this or have suggestions for improving
L00532: it, please contact me via the accompanying website. I would love to hear your thoughts,
L00533: which will inform and motivate subsequent editions.
L00534: Draft: please send errata to udlbookmail@gmail.com.
L00537: <!-- page 13 -->
L00538: Acknowledgments
L00539: Writing this book would not have been possible without the generous help and advice of these
L00540: individuals: Kathryn Hume, Kevin Murphy, Christopher Bishop, Peng Xu, Yann Dubois, Justin
L00541: Domke, Chris Fletcher, Yanshuai Cao, Wendy Tay, Corey Toler-Franklin, Dmytro Mishkin, Guy
L00542: McCusker, Daniel Worrall, Paul McIlroy, Roy Amoyal, Austin Anderson, Romero Barata de
L00543: Morais, Gabriel Harrison, Peter Ball, Alf Muir, David Bryson, Vedika Parulkar, Patryk Lietzau,
L00544: Jessica Nicholson, Alexa Huxley, Oisin Mac Aodha, Giuseppe Castiglione, Josh Akylbekov, Alex
L00545: Gougoulaki, Joshua Omilabu, Alister Guenther, Joe Goodier, Logan Wade, Joshua Guenther,
L00546: Kylan Tobin, Benedict Ellett, Jad Araj, Andrew Glennerster, Giorgos Sfikas, Diya Vibhakar,
L00547: Sam Mansat-Bhattacharyya, Ben Ross, Ivor Simpson, Gaurang Aggarwal, Shakeel Sheikh, Ja-
L00548: cob Horton, Felix Rammell, Sasha Luccioni, Akshil Patel, Alessandro Gentilini, Kevin Mercier,
L00549: Krzysztof Lichocki, Chuck Krapf, Brian Ha, Chris Kang, Leonardo Viotti, Kai Li, Himan Ab-
L00550: dollahpouri, Ari Pakman, Giuseppe Antonio Di Luna, Dan Oneat,ă, Conrad Whiteley, Joseph
L00551: Santarcangelo, Brad Shook, Gabriel Brostow, Lei He, Ali Satvaty, Romain Sabathé, Qiang Zhou,
L00552: Prasanna Vigneswaran, Siqi Zheng, Stephan Grein, Jonas Klesen, Giovanni Stilo, Huang Bokai,
L00553: Kevin McGuinness, Qiang Sun, Zakaria Lotfi, Yifei Lin, Sylvain Bouix, Alex Pitt, Stephane
L00554: Chretien, Robin Liu, Bian Li, Adam Jones, Marcin Świerkot, Tommy Löfstedt, Eugen Ho-
L00555: taj, Fernando Flores-Mangas, Tony Polichroniadis, Pietro Monticone, Rohan Deepak Ajwani,
L00556: Menashe Yarden Einy, Robert Gevorgyan, Thilo Stadelmann, Gui JieMiao, Botao Zhu, Mo-
L00557: hamed Elabbas, Satya Krishna Gorti, James Elder, Helio Perroni Filho, Xiaochao Qu, Jaekang
L00558: Shin, Joshua Evans, Robert Dobson, Shibo Wang, Edoardo Zorzi, Stanisław Jastrzębski, Pieris
L00559: Kalligeros, Matt Hewitt, Zvika Haramaty, Ted Mavroidis, Nikolaj Kuntner, Amir Yorav, Ma-
L00560: soud Mokhtari, Xavier Gabaix, Marco Garosi, Vincent Schönbach, Avishek Mondal, Victor
L00561: S.C. Lui, Sumit Bhatia, Julian Asilis, Hengchao Chen, Siavash Khallaghi, Csaba Szepesvári,
L00562: Mike Singer, Mykhailo Shvets, Abdalla Ibrahim, Stefan Hell, Ron Raphaeli, Diogo Tavares,
L00563: Aristotelis Siozopoulos, Jianrui Wu, Jannik Münz, Penn Mackintosh, Shawn Hoareau, Qianang
L00564: Zhou, Emma Li, Charlie Groves, Xiang Lingxiao, Trivikram Muralidharan, Rajat Binaykiya,
L00565: Germán del Cacho Salvador, Alexey Bloudov, Paul Colognese, Bo Yang, Jani Monoses, Adenil-
L00566: son Arcanjo, Matan Golani, Emmanuel Onzon, Shenghui Yan, Kamesh Kompella, Julius Aka,
L00567: Johannes Brunnemann, Varniethan Ketheeswaran, Alex Ostrovsky, Daniel Burbank, Gavrie
L00568: Philipson, Roozbeh Ehsani, Len Spek, Christoph Brune, Mohammad Nosrati, Bian Li, Runqi
L00569: Chen, Qifu Hu, Rasmi Elasmar, Ronaldo Butrus, Carles Mesado, Jeffrey Wolberg, Olivier Koch,
L00570: Edoardo Lanari, Fanmin Shi, Neel Maniar, Maksym Taran, Falk Langhammer, Reinaldo Lep-
L00571: sch, Max Talberg, Vishal Jain, Christian Arnold, Charles Hill, Nikita Panin, Steven Dillmann,
L00572: Suhas Mathur, Harris Abdul Majid, Guolong Lin, Charles Elkan, Benedict Kuester, Vladimir
L00573: Ivanov, Mohammad-Hadi Sotoudeh, Daniel Enériz Orta, Ian Jeffrey, Kwok Chun, Yu Liu, Tom
L00574: Vettenburg, Aravinda Perera, Daniel Gigliotti, Iftikhar Ramnandan, Adnan Siddiquei, Will
L00575: Knottenbelt, Valerio Di Stefano, Srikant Jayaraman, Goldie Srulovich, Rafał Rolczyński, An-
L00576: thony Ip, Andre Coelho, Roberto Martins, Behbudiy Academy, Yun Zheng, David Bissessar,
L00577: Draft: please send errata to udlbookmail@gmail.com.
L00580: <!-- page 14 -->
L00581: xii
L00582: Contents
L00583: Tom Jacobs, Lei Fang, Fabian Henning, Umesh Rajashekar, Jay Park, Kai Liu, Pablo Renard
L00584: Guiral, Federico Barbero, Rongjiang Pan, Betin Bilkan Karaman, Leonidas Varveropoulos,
L00585: William Locke IV, Filip Jasionek, Yuanhang Wang, Stefan Bach, Ivan Yevtushenko, David
L00586: Gwyer, Bohan Cui, Ali Darijani, Rouhollah Farhang, Li Tang, Aleksandrs Koselevs, Mason
L00587: Wang, Pablo Fernandez, Angelo Coluccia, Vladyslav Moroshan, Rami Luisto, Peter Zaki, Lu-
L00588: case Curtin, Victor Liu, Giacomo Cirò, Louis Neltner, Ahmet Çeşmeci, Yanzhe Bekkemoen,
L00589: Judith Katzy, Jannes Bruns, Ondra Jelínek, Yancan Yi, Tamás Szép, Diego Ortega Hernan-
L00590: dez, Yancan Yi, Felix Winterhalter, Renato Assunção, Jixin Liu, Benjamin Sambale, Jeremy
L00591: Mikkelsen, Volodymyr Ivanchenkok, Coco Bögel, Betty Qi, and Joy Kuri.
L00592: I’m particularly grateful to Daniyar Turmukhambetov, Amedeo Buonanno, Andrea Panizza,
L00593: Mark Hudson, Bernhard Pfahringer, Alexander Nordin, and Nicholas Lord who provided de-
L00594: tailed comments on multiple chapters of the book. I’d like to especially thank Andrew Fitzgib-
L00595: bon, Konstantinos Derpanis, Toshiaki Kurokawa, and Tyler Mills, who read the whole book
L00596: and whose enthusiasm helped me complete this project. I’d also like to thank Neill Campbell
L00597: and Özgür Şimşek, who hosted me at the University of Bath, where I taught a course based on
L00598: this material for the first time. Finally, I’m extremely grateful to my editor Elizabeth Swayze
L00599: for her frank advice throughout this process.
L00600: Chapter 12 (transformers) and chapter 17 (variational autoencoders) were first published
L00601: as blogs for Borealis AI, and adapted versions are reproduced with permission of Royal Bank
L00602: of Canada along with Borealis AI. I am grateful for their support in this endeavor. Chapter 16
L00603: (normalizing flows) is loosely based on the review article by Kobyzev et al. (2020), on which
L00604: I was a co-author. I was very fortunate to be able to collaborate on Chapter 21 with Travis
L00605: LaCroix from Dalhousie University, who was both easy and fun to work with, and who did the
L00606: lion’s share of the work.
L00607: Attribution
L00608: •
L00609: Chessboard image in figure 1.13 adapted from http://tinyurl.com/yc2d54d4.
L00610: •
L00611: Cogs image in figures 1.2, 1.4, 1.10 adapted from http://tinyurl.com/2c7tttr8.
L00612: •
L00613: Penguin image in figures 19.1–19.5 and 19.6–19.9 adapted from http://tinyurl.com/ycx9je56.
L00614: •
L00615: Fish image in figures 19.2–19.5, 19.7, 19.10–19.12 adapted from http://tinyurl.com/4ueyhtsu.
L00616: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L00619: <!-- page 15 -->
L00620: Chapter 1
L00621: Introduction
L00622: Artificial intelligence, or AI, is concerned with building systems that simulate intelligent
L00623: behavior. It encompasses a wide range of approaches, including those based on logic,
L00624: search, and probabilistic reasoning. Machine learning is a subset of AI that learns to
L00625: make decisions by fitting mathematical models to observed data. This area has seen
L00626: explosive growth and is now (incorrectly) almost synonymous with the term AI.
L00627: A deep neural network (or deep network for short) is a type of machine learning
L00628: model, and the process of fitting these models to data is referred to as deep learning. At
L00629: the time of writing, deep networks are the most powerful and practical machine learning
L00630: models and are often encountered in day-to-day life. It is commonplace to translate text
L00631: to another language using a natural language processing algorithm, to search for images
L00632: of a given object using a computer vision system, or to converse with a digital assistant
L00633: via a speech recognition interface. All of these applications are powered by deep learning.
L00634: As the title suggests, this book aims to help a reader new to this field understand
L00635: the principles behind deep learning. The book is neither terribly theoretical (there are
L00636: no proofs) nor extremely practical (there is almost no code). The goal is to explain the
L00637: underlying ideas; after consuming this volume, the reader will be able to apply deep
L00638: learning to novel situations where there is no existing recipe for success.
L00639: Machine learning methods can coarsely be divided into three areas: supervised, unsu-
L00640: pervised, and reinforcement learning. At the time of writing, the cutting-edge methods
L00641: in all three areas rely on deep learning (figure 1.1). This introductory chapter describes
L00642: these three areas at a high level, and this taxonomy is also loosely reflected in the book’s
L00643: organization. Whether we like it or not, deep learning is poised to change our world,
L00644: and this change will not all be positive. Hence, this chapter also contains a brief primer
L00645: on AI ethics. We conclude with advice on how to make the most of this book.
L00646: 1.1
L00647: Supervised learning
L00648: Supervised learning models define a mapping from input data to an output prediction.
L00649: In the following sections, we discuss the inputs, the outputs, the model itself, and what
L00650: is meant by “training” a model.
L00651: Draft: please send errata to udlbookmail@gmail.com.
L00654: <!-- page 16 -->
L00655: 2
L00656: 1
L00657: Introduction
L00658: Figure 1.1 Machine learning is an area
L00659: of artificial intelligence that fits math-
L00660: ematical models to observed data.
L00661: It
L00662: can coarsely be divided into supervised
L00663: learning, unsupervised learning, and re-
L00664: inforcement learning. Deep neural net-
L00665: works contribute to each of these areas.
L00666: 1.1.1
L00667: Regression and classification problems
L00668: Figure 1.2 depicts several regression and classification problems. In each case, there is a
L00669: meaningful real-world input (a sentence, a sound file, an image, etc.), and this is encoded
L00670: as a vector of numbers. This vector forms the model input. The model maps the input to
L00671: an output vector which is then “translated” back to a meaningful real-world prediction.
L00672: For now, we focus on the inputs and outputs and treat the model as a black box that
L00673: ingests a vector of numbers and returns another vector of numbers.
L00674: The model in figure 1.2a predicts the price of a house based on input characteristics
L00675: such as the square footage and the number of bedrooms. This is a regression problem
L00676: because the model returns a continuous number (rather than a category assignment).
L00677: In contrast, the model in figure 1.2b takes the chemical structure of a molecule as an
L00678: input and predicts both the freezing and boiling points. This is a multivariate regression
L00679: problem since it predicts more than one number.
L00680: The model in figure 1.2c receives a text string containing a restaurant review as input
L00681: and predicts whether the review is positive or negative. This is a binary classification
L00682: problem because the model attempts to assign the input to one of two categories. The
L00683: output vector contains the probabilities that the input belongs to each category. Fig-
L00684: ures 1.2d and 1.2e depict multiclass classification problems. Here, the model assigns the
L00685: input to one of N > 2 categories. In the first case, the input is an audio file, and the
L00686: model predicts which genre of music it contains. In the second case, the input is an
L00687: image, and the model predicts which object it contains. In each case, the model returns
L00688: a vector of size N that contains the probabilities of the N categories.
L00689: 1.1.2
L00690: Inputs
L00691: The input data in figure 1.2 varies widely. In the house pricing example, the input is a
L00692: fixed-length vector containing values that characterize the property. This is an example
L00693: of tabular data because it has no internal structure; if we change the order of the inputs
L00694: and build a new model, then we expect the model prediction to remain the same.
L00695: Conversely, the input in the restaurant review example is a body of text. This may
L00696: be of variable length depending on the number of words in the review, and here input
L00697: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L00700: <!-- page 17 -->
L00701: 1.1
L00702: Supervised learning
L00703: 3
L00704: Figure 1.2 Regression and classification problems. a) This regression model takes
L00705: a vector of numbers that characterize a property and predicts its price. b) This
L00706: multivariate regression model takes the structure of a chemical molecule and
L00707: predicts its freezing and boiling points. c) This binary classification model takes a
L00708: restaurant review and classifies it as either positive or negative. d) This multiclass
L00709: classification problem assigns a snippet of audio to one of N genres. e) A second
L00710: multiclass classification problem in which the model classifies an image according
L00711: to which of N possible objects it might contain.
L00712: Draft: please send errata to udlbookmail@gmail.com.
