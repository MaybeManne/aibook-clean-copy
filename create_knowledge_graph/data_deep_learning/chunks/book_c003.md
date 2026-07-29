L01073: <!-- page 28 -->
L01074: 14
L01075: 1
L01076: Introduction
L01077: Concentrating power:
L01078: It is not from a benevolent interest in improving the lot of the
L01079: human race that the world’s most powerful companies are investing heavily in artifi-
L01080: cial intelligence. They know that these technologies will allow them to reap enormous
L01081: profits. Like any advanced technology, deep learning is likely to concentrate power in
L01082: the hands of the few organizations that control it. Automating jobs that are currently
L01083: done by humans will change the economic environment and disproportionately affect the
L01084: livelihoods of lower-paid workers with fewer skills. Optimists argue similar disruptions
L01085: happened during the industrial revolution and resulted in shorter working hours. The
L01086: truth is that we simply do not know what effects the large-scale adoption of AI will have
L01087: on society (see David, 2015).
L01088: Existential risk:
L01089: The major existential risks to the human race all result from tech-
L01090: nology. Climate change has been driven by industrialization. Nuclear weapons derive
L01091: from the study of physics. Pandemics are more probable and spread faster because in-
L01092: novations in transport, agriculture, and construction have allowed a larger, denser, and
L01093: more interconnected population. Artificial intelligence brings new existential risks. We
L01094: should be very cautious about building systems that are more capable and extensible
L01095: than human beings. In the most optimistic case, it will put vast power in the hands
L01096: of the owners.
L01097: In the most pessimistic case, we will be unable to control it or even
L01098: understand its motives (see Tegmark, 2018).
L01099: This list is far from exhaustive. AI could also enable surveillance, disinformation,
L01100: violations of privacy, fraud, and manipulation of financial markets, and the energy re-
L01101: quired to train AI systems contributes to climate change. Moreover, these concerns are
L01102: not speculative; there are already many examples of ethically dubious applications of
L01103: AI (consult Dao, 2021, for a partial list). In addition, the recent history of the inter-
L01104: net has shown how new technology can cause harm in unexpected ways. The online
L01105: community of the eighties and early nineties could hardly have predicted the prolifera-
L01106: tion of fake news, spam, online harassment, fraud, cyberbullying, incel culture, political
L01107: manipulation, doxxing, online radicalization, and revenge porn.
L01108: Everyone studying or researching (or writing books about) AI should contemplate
L01109: to what degree scientists are accountable for the uses of their technology. We should
L01110: consider that capitalism primarily drives the development of AI and that legal advances
L01111: and deployment for social good are likely to lag significantly behind. We should reflect
L01112: on whether it’s possible, as scientists and engineers, to control progress in this field and
L01113: to reduce the potential for harm. We should consider what kind of organizations we
L01114: are prepared to work for. How serious are they in their commitment to reducing the
L01115: potential harms of AI? Are they simply “ethics-washing” to reduce reputational risk, or
L01116: do they actually implement mechanisms to halt ethically suspect projects?
L01117: All readers are encouraged to investigate these issues further.
L01118: The online course
L01119: at https://ethics-of-ai.mooc.fi/ is a useful introductory resource. If you are a professor
L01120: teaching from this book, you are encouraged to raise these issues with your students. If
L01121: you are a student taking a course where this is not done, then lobby your professor to
L01122: make this happen. If you are deploying or researching AI in a corporate environment,
L01123: you are encouraged to scrutinize your employer’s values and to help change them (or
L01124: leave) if they are wanting.
L01125: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L01128: <!-- page 29 -->
L01129: 1.5
L01130: Structure of book
L01131: 15
L01132: 1.5
L01133: Structure of book
L01134: The structure of the book follows the structure of this introduction. Chapters 2–9 walk
L01135: through the supervised learning pipeline. We describe shallow and deep neural networks
L01136: and discuss how to train them and measure and improve their performance.
L01137: Chap-
L01138: ters 10–13 describe common architectural variations of deep neural networks, including
L01139: convolutional networks, residual connections, and transformers. These architectures are
L01140: used across supervised, unsupervised, and reinforcement learning.
L01141: Chapters 14–18 tackle unsupervised learning using deep neural networks. We devote
L01142: a chapter each to four modern deep generative models: generative adversarial networks,
L01143: variational autoencoders, normalizing flows, and diffusion models. Chapter 19 is a brief
L01144: introduction to deep reinforcement learning. This is a topic that easily justifies its own
L01145: book, so the treatment is necessarily superficial. However, this treatment is intended to
L01146: be a good starting point for readers unfamiliar with this area.
L01147: Despite the title of this book, some aspects of deep learning remain poorly under-
L01148: stood. Chapter 20 poses some fundamental questions. Why are deep networks so easy to
L01149: train? Why do they generalize so well? Why do they need to be so large? Do they need
L01150: to be deep? Along the way, we explore unexpected phenomena such as the structure
L01151: of the loss function, double descent, grokking, and lottery tickets. The book concludes
L01152: with chapter 21, which discusses ethics and deep learning.
L01153: 1.6
L01154: Other books
L01155: This book is self-contained but is limited to coverage of deep learning. It is intended to
L01156: be the spiritual successor to Deep Learning (Goodfellow et al., 2016) which is a fantastic
L01157: resource but does not cover recent advances. For a broader look at machine learning, the
L01158: most up-to-date and encyclopedic resource is Probabilistic Machine Learning (Murphy,
L01159: 2022, 2023). However, Pattern Recognition and Machine Learning (Bishop, 2006) is still
L01160: an excellent and relevant book.
L01161: If you enjoy this book, then my previous volume, Computer Vision: Models, Learning,
L01162: and Inference (Prince, 2012), is still worth reading. Some parts have dated badly, but it
L01163: contains a thorough introduction to probability, including Bayesian methods, and good
L01164: introductory coverage of latent variable models, geometry for computer vision, Gaussian
L01165: processes, and graphical models. It uses identical notation to this book and can be found
L01166: online. A detailed treatment of graphical models can be found in Probabilistic Graphical
L01167: Models: Principles and Techniques (Koller & Friedman, 2009), and Gaussian processes
L01168: are covered by Gaussian Processes for Machine Learning (Williams & Rasmussen, 2006).
L01169: For background mathematics, consult Mathematics for Machine Learning (Deisen-
L01170: roth et al., 2020). For a more coding-oriented approach, consult Dive into Deep Learning
L01171: (Zhang et al., 2023). The best overviews for computer vision are Computer Vision: Algo-
L01172: rithms and Applications (Szeliski, 2022), and Foundations of Computer Vision (Torralba
L01173: et al., 2024). A good starting point to learn about graph neural networks is Graph Rep-
L01174: resentation Learning (Hamilton, 2020). The definitive work on reinforcement learning
L01175: Draft: please send errata to udlbookmail@gmail.com.
L01178: <!-- page 30 -->
L01179: 16
L01180: 1
L01181: Introduction
L01182: is Reinforcement Learning: An Introduction (Sutton & Barto, 2018).
L01183: A good initial
L01184: resource is Foundations of Deep Reinforcement Learning (Graesser & Keng, 2019).
L01185: 1.7
L01186: How to read this book
L01187: Most remaining chapters in this book contain a main body of text, a notes section, and
L01188: a set of problems. The main body of the text is intended to be self-contained and can be
L01189: read without recourse to the other parts of the chapter. As much as possible, background
L01190: mathematics is incorporated into the main body of the text. However, for larger topics
L01191: that would be a distraction to the main thread of the argument, the background material
L01192: is appendicized, and a reference is provided in the margin. Most notation in this book is
L01193: Appendix A
L01194: Notation
L01195: standard. However, some conventions are less widely used, and the reader is encouraged
L01196: to consult appendix A before proceeding.
L01197: The main body of text includes many novel illustrations and visualizations of deep
L01198: learning models and results. I’ve worked hard to provide new explanations of existing
L01199: ideas rather than merely curate the work of others. Deep learning is a new field, and
L01200: sometimes phenomena are poorly understood. I try to make it clear where this is the
L01201: case and when my explanations should be treated with caution.
L01202: References are included in the main body of the chapter only where results are de-
L01203: picted. Instead, they can be found in the notes section at the end of the chapter. I do
L01204: not generally respect historical precedent in the main text; if an ancestor of a current
L01205: technique is no longer useful, then I will not mention it. However, the historical develop-
L01206: ment of the field is described in the notes section, and hopefully, credit is fairly assigned.
L01207: The notes are organized into paragraphs and provide pointers for further reading. They
L01208: should help the reader orient themselves within the sub-area and understand how it re-
L01209: lates to other parts of machine learning. The notes are less self-contained than the main
L01210: text. Depending on your level of background knowledge and interest, you may find these
L01211: sections more or less useful.
L01212: Each chapter has a number of associated problems. They are referenced in the margin
L01213: of the main text at the point that they should be attempted. As George Pólya noted,
L01214: “Mathematics, you see, is not a spectator sport.” He was correct, and I highly recommend
L01215: that you attempt the problems as you go. In some cases, they provide insights that will
L01216: help you understand the main text. Problems for which the answers are provided on the
L01217: associated website (http://udlbook.com) are indicated with an asterisk. Additionally,
L01218: Python notebooks that will help you understand the ideas in this book are also available
L01219: via the website, and these are also referenced in the margins of the text. Indeed, if
L01220: Notebook 1.1
L01221: Background
L01222: mathematics
L01223: you are feeling rusty, it might be worth working through the notebook on background
L01224: mathematics right now.
L01225: Unfortunately, the pace of research in AI makes it inevitable that this book will be a
L01226: constant work in progress. If there are parts you find hard to understand, notable omis-
L01227: sions, or sections that seem extraneous, please get in touch via the associated website.
L01228: Together, we can make the next edition better.
L01229: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L01232: <!-- page 31 -->
L01233: Chapter 2
L01234: Supervised learning
L01235: A supervised learning model defines a mapping from one or more inputs to one or more
L01236: outputs. For example, the input might be the age and mileage of a second-hand Toyota
L01237: Prius, and the output might be the estimated value of the car in dollars.
L01238: The model is just a mathematical function (i.e., an equation); when the inputs are
L01239: passed through this function, it computes the output, and this is termed inference. The
L01240: model equation also contains parameters. Different parameter values change the out-
L01241: come of the computation; the model equation describes a family of possible relationships
L01242: between inputs and outputs, and the parameters specify the particular relationship.
L01243: When we train or learn a model, we find parameters that describe the true relationship
L01244: between inputs and outputs. A learning algorithm takes a training set of input/output
L01245: pairs and manipulates the parameters until the inputs predict their corresponding out-
L01246: puts as closely as possible. If the model works well for these training pairs, then we hope
L01247: it will make good predictions for new inputs where the true output is unknown.
L01248: The goal of this chapter is to expand on these ideas. First, we describe this framework
L01249: more formally and introduce some notation. Then we work through a simple example
L01250: in which we use a straight line to describe the relationship between input and output.
L01251: This linear model is both familiar and easy to visualize, but nevertheless illustrates all
L01252: the main ideas of supervised learning.
L01253: 2.1
L01254: Supervised learning overview
L01255: In supervised learning, we aim to build a model that takes an input x and outputs a
L01256: prediction y. For simplicity, we assume that both the input x and output y are vectors
L01257: of a predetermined and fixed size and that the elements of each vector are always ordered
L01258: in the same way; in the Prius example above, the input x would always contain the age
L01259: of the car and then the mileage, in that order. This is termed structured or tabular data.
L01260: To make the prediction, we need a model f[•] that takes input x and returns y, so:
L01261: y = f[x].
L01262: (2.1)
L01263: Draft: please send errata to udlbookmail@gmail.com.
L01266: <!-- page 32 -->
L01267: 18
L01268: 2
L01269: Supervised learning
L01270: When we compute the prediction y from the input x, we call this inference.
L01271: The model is just a mathematical equation with a fixed form. It represents a family
L01272: of different relations between the input and the output. The model also contains param-
L01273: eters ϕ. The choice of parameters determines the particular relation between input and
L01274: output, so we should really write:
L01275: y = f[x, ϕ].
L01276: (2.2)
L01277: When we talk about learning or training a model, we mean that we attempt to find
L01278: parameters ϕ that make sensible output predictions from the input. We learn these
L01279: parameters using a training dataset of I pairs of input and output examples {xi, yi}. We
L01280: aim to select parameters that map each training input to its associated output as closely
L01281: as possible. We quantify the degree of mismatch in this mapping with the loss L. This
L01282: is a scalar value that summarizes how poorly the model predicts the training outputs
L01283: from their corresponding inputs for parameters ϕ.
L01284: We can treat the loss as a function L[ϕ] of these parameters. When we train the
L01285: model, we are seeking parameters ˆϕ that minimize this loss function:1
L01286: Appendix A
L01287: Argmin function
L01288: ˆϕ = argmin
L01289: ϕ
L01290: h
L01291: L [ϕ]
L01292: i
L01293: .
L01294: (2.3)
L01295: If the loss is small after this minimization, we have found model parameters that accu-
L01296: rately predict the training outputs yi from the training inputs xi.
L01297: After training a model, we must now assess its performance; we run the model on
L01298: separate test data to see how well it generalizes to examples that it didn’t observe during
L01299: training. If the performance is adequate, then we are ready to deploy the model.
L01300: 2.2
L01301: Linear regression example
L01302: Let’s now make these ideas concrete with a simple example. We consider a model y =
L01303: f[x, ϕ] that predicts a single output y from a single input x. Then we develop a loss
L01304: function, and finally, we discuss model training.
L01305: 2.2.1
L01306: 1D linear regression model
L01307: A 1D linear regression model describes the relationship between input x and output y
L01308: as a straight line:
L01309: y
L01310: =
L01311: f[x, ϕ]
L01312: =
L01313: ϕ0 + ϕ1x.
L01314: (2.4)
L01315: 1More properly, the loss function also depends on the training data {xi, yi}, so we should
L01316: write L [{xi, yi}, ϕ], but this is rather cumbersome.
L01317: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L01320: <!-- page 33 -->
L01321: 2.2
L01322: Linear regression example
L01323: 19
L01324: Figure 2.1 Linear regression model. For
L01325: a given choice of parameters ϕ = [ϕ0, ϕ1],
L01326: the model makes a prediction for the out-
L01327: put (y-axis) based on the input (x-axis).
L01328: Different choices for the y-intercept ϕ0
L01329: and the slope ϕ1 change these predictions
L01330: (cyan, orange, and gray lines). The lin-
L01331: ear regression model (equation 2.4) de-
L01332: fines a family of input/output relations
L01333: (lines) and the parameters determine the
L01334: member of the family (the particular
L01335: line). (Interactive figure)
L01336: This model has two parameters ϕ = [ϕ0, ϕ1], where ϕ0 is the y-intercept of the line and ϕ1
L01337: is the slope. Different choices for the y-intercept and slope result in different relations
L01338: between input and output (figure 2.1). Hence, equation 2.4 defines a family of possible
L01339: input-output relations (all possible lines), and the choice of parameters determines the
L01340: member of this family (the particular line).
L01341: 2.2.2
L01342: Loss
L01343: For this model, the training dataset (figure 2.2a) consists of I input/output pairs {xi, yi}.
L01344: Figures 2.2b–d show three lines defined by three sets of parameters.
L01345: The green line
L01346: in figure 2.2d describes the data more accurately than the other two since it is much
L01347: closer to the data points. However, we need a principled approach for deciding which
L01348: parameters ϕ are better than others. To this end, we assign a numerical value to each
L01349: choice of parameters that quantifies the degree of mismatch between the model and the
L01350: data. We term this value the loss; a lower loss means a better fit.
L01351: The mismatch is captured by the deviation between the model predictions f[xi, ϕ]
L01352: (height of the line at xi) and the ground truth outputs yi. These deviations are depicted
L01353: as orange dashed lines in figures 2.2b–d. We quantify the total mismatch, training error,
L01354: or loss as the sum of the squares of these deviations for all I training pairs:
L01355: L[ϕ]
L01356: =
L01357: I
L01358: X
L01359: i=1
L01360: (f[xi, ϕ] −yi)2
L01361: =
L01362: I
L01363: X
L01364: i=1
L01365: (ϕ0 + ϕ1xi −yi)2 .
L01366: (2.5)
L01367: Since the best parameters minimize this expression, we call this a least-squares loss. The
L01368: squaring operation means that the direction of the deviation (i.e., whether the line is
L01369: Draft: please send errata to udlbookmail@gmail.com.
L01372: <!-- page 34 -->
L01373: 20
L01374: 2
L01375: Supervised learning
L01376: Figure 2.2 Linear regression training data, model, and loss. a) The training data
L01377: (orange points) consist of I = 12 input/output pairs {xi, yi}. b–d) Each panel
L01378: shows the linear regression model with different parameters. Depending on the
L01379: choice of y-intercept and slope parameters ϕ = [ϕ0, ϕ1], the model errors (orange
L01380: dashed lines) may be larger or smaller. The loss L is the sum of the squares
L01381: of these errors. The parameters that define the lines in panels (b) and (c) have
L01382: large losses L = 7.07 and L = 10.28, respectively because the models fit badly.
L01383: The loss L=0.20 in panel (d) is smaller because the model fits well; in fact, this
L01384: has the smallest loss of all possible lines, so these are the optimal parameters.
L01385: (Interactive figure)
L01386: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L01389: <!-- page 35 -->
L01390: 2.2
L01391: Linear regression example
L01392: 21
L01393: Figure 2.3 Loss function for linear regression model with the dataset in figure 2.2a.
L01394: a) Each combination of parameters ϕ = [ϕ0,ϕ1] has an associated loss. The result-
L01395: ing loss function L[ϕ] can be visualized as a surface. The three circles represent
L01396: the lines from figure 2.2b–d. b) The loss can also be visualized as a heatmap,
L01397: where brighter regions represent larger losses; here we are looking straight down
L01398: at the surface in (a) from above and gray ellipses represent isocontours. The best
L01399: fitting line (figure 2.2d) has the parameters with the smallest loss (green circle).
L01400: above or below the data) is unimportant. There are also theoretical reasons for this
L01401: choice which we return to in chapter 5.
L01402: The loss L is a function of the parameters ϕ; it will be larger when the model fit is
L01403: Notebook 2.1
L01404: Supervised
L01405: learning
L01406: poor (figure 2.2b,c) and smaller when it is good (figure 2.2d). Considered in this light,
L01407: we term L[ϕ] the loss function or cost function. The goal is to find the parameters ˆϕ
L01408: that minimize this quantity:
L01409: ˆϕ
L01410: =
L01411: argmin
L01412: ϕ
L01413: h
L01414: L[ϕ]
L01415: i
L01416: =
L01417: argmin
L01418: ϕ
L01419: " I
L01420: X
L01421: i=1
L01422: (f[xi, ϕ] −yi)2
L01423: #
L01424: =
L01425: argmin
L01426: ϕ
L01427: " I
L01428: X
L01429: i=1
L01430: (ϕ0 + ϕ1xi −yi)2
L01431: #
L01432: .
L01433: (2.6)
L01434: There are only two parameters (the y-intercept ϕ0 and slope ϕ1), so we can calculate
L01435: the loss for every combination of values and visualize the loss function as a surface
L01436: Problems 2.1–2.2
L01437: (figure 2.3). The “best” parameters are at the minimum of this surface.
L01438: Draft: please send errata to udlbookmail@gmail.com.
L01441: <!-- page 36 -->
L01442: 22
L01443: 2
L01444: Supervised learning
L01445: 2.2.3
L01446: Training
L01447: The process of finding parameters that minimize the loss is termed model fitting, training,
L01448: or learning. The basic method is to choose the initial parameters randomly and then
L01449: improve them by “walking down” the loss function until we reach the bottom (figure 2.4).
L01450: One way to do this is to measure the gradient of the surface at the current position and
L01451: take a step in the direction that is most steeply downhill. Then we repeat this process
L01452: until the gradient is flat and we can improve no further.2
L01453: 2.2.4
L01454: Testing
L01455: Having trained the model, we want to know how it will perform in the real world. We
L01456: do this by computing the loss on a separate set of test data. The degree to which the
L01457: prediction accuracy generalizes to the test data depends in part on how representative
L01458: and complete the training data is. However, it also depends on how expressive the model
L01459: is. A simple model like a line might not be able to capture the true relationship between
L01460: input and output. This is known as underfitting. Conversely, a very expressive model
L01461: may describe statistical peculiarities of the training data that are atypical and lead to
L01462: unusual predictions. This is known as overfitting.
L01463: 2.3
L01464: Summary
L01465: A supervised learning model is a function y = f[x, ϕ] that relates inputs x to outputs y.
L01466: The particular relationship is determined by parameters ϕ.
L01467: To train the model, we
L01468: define a loss function L[ϕ] over a training dataset {xi, yi}. This quantifies the mismatch
L01469: between the model predictions f[xi, ϕ] and observed outputs yi as a function of the
L01470: parameters ϕ. Then we search for the parameters that minimize the loss. We evaluate
L01471: the model on a different set of test data to see how well it generalizes to new inputs.
L01472: Chapters 3–9 expand on these ideas. First, we tackle the model itself; 1D linear
L01473: regression has the obvious drawback that it can only describe the relationship between the
L01474: input and output as a straight line. Shallow neural networks (chapter 3) are only slightly
L01475: more complex than linear regression but describe a much larger family of input/output
L01476: relationships. Deep neural networks (chapter 4) are just as expressive but can describe
L01477: complex functions with fewer parameters and work better in practice.
L01478: Chapter 5 investigates loss functions for different tasks and reveals the theoretical
L01479: underpinnings of the least-squares loss. Chapters 6 and 7 discuss the training process.
L01480: Chapter 8 discusses how to measure model performance. Chapter 9 considers regular-
L01481: ization techniques, which aim to improve that performance.
L01482: 2This iterative approach is not actually necessary for the linear regression model. Here, it’s possible
L01483: to find closed-form expressions for the parameters. However, this gradient descent approach works for
L01484: more complex models where there is no closed-form solution and where there are too many parameters
L01485: to evaluate the loss for every combination of values.
L01486: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L01489: <!-- page 37 -->
L01490: Notes
L01491: 23
L01492: Figure 2.4 Linear regression training. The goal is to find the y-intercept and slope
L01493: parameters that correspond to the smallest loss. a) Iterative training algorithms
L01494: initialize the parameters randomly and then improve them by “walking downhill”
L01495: until no further improvement can be made. Here, we start at position 0 and move
L01496: a certain distance downhill (perpendicular to the contours) to position 1. Then
L01497: we re-calculate the downhill direction and move to position 2. Eventually, we
L01498: reach the minimum of the function (position 4). b) Each position 0–4 from panel
L01499: (a) corresponds to a different y-intercept and slope and so represents a different
L01500: line. As the loss decreases, the lines fit the data more closely. (Interactive figure)
L01501: Notes
L01502: Loss functions vs. cost functions:
L01503: In much of machine learning and in this book, the terms
L01504: loss function and cost function are used interchangeably. However, more properly, a loss function
L01505: is the individual term associated with a data point (i.e., each of the squared terms on the right-
L01506: hand side of equation 2.5), and the cost function is the overall quantity that is minimized (i.e.,
L01507: the entire right-hand side of equation 2.5). A cost function can contain additional terms that
L01508: are not associated with individual data points (see section 9.1). More generally, an objective
L01509: function is any function that is to be maximized or minimized.
L01510: Generative vs. discriminative models:
L01511: The models y = f[x, ϕ] in this chapter are discrim-
L01512: inative models. These make an output prediction y from real-world measurements x.
L01513: Another
L01514: Problem 2.3
L01515: approach is to build a generative model x = g[y, ϕ], in which the real-world measurements x
L01516: are computed as a function of the output y.
L01517: The generative approach has the disadvantage that it doesn’t directly predict y. To perform
L01518: inference, we must invert the generative equation as y = g−1[x, ϕ], and this may be diﬀicult.
L01519: However, generative models have the advantage that we can build in prior knowledge about how
L01520: the data were created. For example, if we wanted to predict the 3D position and orientation y
L01521: Draft: please send errata to udlbookmail@gmail.com.
L01524: <!-- page 38 -->
L01525: 24
L01526: 2
L01527: Supervised learning
L01528: of a car in an image x, then we could build knowledge about car shape, 3D geometry, and light
L01529: transport into the function x = g[y, ϕ].
L01530: This seems like a good idea, but in fact, discriminative models dominate modern machine
L01531: learning; the advantage gained from exploiting prior knowledge in generative models is usually
L01532: trumped by learning very flexible discriminative models with large amounts of training data.
L01533: Problems
L01534: Problem 2.1 To walk “downhill” on the loss function (equation 2.5), we measure its gradient with
L01535: respect to the parameters ϕ0 and ϕ1. Calculate expressions for the slopes ∂L/∂ϕ0 and ∂L/∂ϕ1.
L01536: Problem 2.2 Show that we can find the minimum of the loss function in closed form by setting
L01537: the expression for the derivatives from problem 2.1 to zero and solving for ϕ0 and ϕ1. Note that
L01538: this works for linear regression but not for more complex models; this is why we use iterative
L01539: model fitting methods like gradient descent (figure 2.4).
L01540: Problem 2.3∗Consider reformulating linear regression as a generative model, so we have x =
L01541: g[y, ϕ] = ϕ′
L01542: 0 + ϕ′
L01543: 1y. What is the new loss function? Find an expression for the inverse func-
L01544: tion y = g−1[x, ϕ′] that we would use to perform inference. Will this model make the same
L01545: predictions as the discriminative version for a given training dataset {xi, yi}? One way to es-
L01546: tablish this is to write code that fits a line to three data points using both methods and see if
L01547: the result is the same.
L01548: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L01551: <!-- page 39 -->
L01552: Chapter 3
L01553: Shallow neural networks
L01554: Chapter 2 introduced supervised learning using 1D linear regression. However, this model
L01555: can only describe the input/output relationship as a line. This chapter introduces shallow
L01556: neural networks. These describe piecewise linear functions and are expressive enough
L01557: to approximate arbitrarily complex relationships between multi-dimensional inputs and
L01558: outputs.
L01559: 3.1
L01560: Neural network example
L01561: Shallow neural networks are functions y = f[x, ϕ] with parameters ϕ that map multivari-
L01562: ate inputs x to multivariate outputs y. We defer a full definition until section 3.4 and
L01563: introduce the main ideas using an example network f[x, ϕ] that maps a scalar input x to
L01564: a scalar output y and has ten parameters ϕ = {ϕ0, ϕ1, ϕ2, ϕ3, θ10, θ11, θ20, θ21, θ30, θ31}:
L01565: y
L01566: =
L01567: f[x, ϕ]
L01568: =
L01569: ϕ0 + ϕ1a[θ10 + θ11x] + ϕ2a[θ20 + θ21x] + ϕ3a[θ30 + θ31x].
L01570: (3.1)
L01571: We can break down this calculation into three parts: first, we compute three linear
L01572: functions of the input data (θ10 + θ11x, θ20 + θ21x, and θ30 + θ31x). Second, we pass the
L01573: three results through an activation function a[•]. Finally, we weight the three resulting
L01574: activations with ϕ1, ϕ2, and ϕ3, sum them, and add an offset ϕ0.
L01575: To complete the description, we must define the activation function a[•]. There are
L01576: many possibilities, but the most common choice is the rectified linear unit or ReLU:
L01577: a[z] = ReLU[z] =
L01578: (
L01579: 0
L01580: z < 0
L01581: z
L01582: z ≥0 .
L01583: (3.2)
L01584: This returns the input when it is positive and zero otherwise (figure 3.1).
L01585: It is probably not obvious which family of input/output relations is represented by
L01586: equation 3.1. Nonetheless, the ideas from the previous chapter are all applicable. Equa-
L01587: tion 3.1 represents a family of functions where the particular member of the family
L01588: Draft: please send errata to udlbookmail@gmail.com.
L01591: <!-- page 40 -->
L01592: 26
L01593: 3
L01594: Shallow neural networks
L01595: Figure 3.1 Rectified linear unit (ReLU).
L01596: This activation function returns zero if
L01597: the input is less than zero and returns
L01598: the input unchanged otherwise. In other
L01599: words, it clips negative values to zero.
L01600: Note that there are many other possi-
L01601: ble choices for the activation function
L01602: (see figure 3.13), but the ReLU is the
L01603: most commonly used and the easiest to
L01604: understand.
L01605: Figure 3.2 Family of functions defined by equation 3.1. a–c) Functions for three
L01606: different choices of the ten parameters ϕ. In each case, the input/output relation
L01607: is piecewise linear. However, the positions of the joints, the slopes of the linear
L01608: regions between them, and the overall height vary.
L01609: depends on the ten parameters in ϕ.
L01610: If we know these parameters, we can perform
L01611: inference (predict y) by evaluating the equation for a given input x. Given a training
L01612: dataset {xi, yi}I
L01613: i=1, we can define a least squares loss function L[ϕ] and use this to mea-
L01614: sure how effectively the model describes this dataset for any given parameter values ϕ.
L01615: To train the model, we search for the values ˆϕ that minimize this loss.
L01616: 3.1.1
L01617: Neural network intuition
L01618: In fact, equation 3.1 represents a family of continuous piecewise linear functions (fig-
L01619: ure 3.2) with up to four linear regions. We now break down equation 3.1 and show why
L01620: it describes this family. To make this easier to understand, we split the function into
L01621: two parts. First, we introduce the intermediate quantities:
L01622: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L01625: <!-- page 41 -->
L01626: 3.1
L01627: Neural network example
L01628: 27
L01629: h1
L01630: =
L01631: a[θ10 + θ11x]
L01632: h2
L01633: =
L01634: a[θ20 + θ21x]
L01635: h3
L01636: =
L01637: a[θ30 + θ31x],
L01638: (3.3)
L01639: where we refer to h1, h2, and h3 as hidden units. Second, we compute the output by
L01640: combining these hidden units with a linear function:1
L01641: y = ϕ0 + ϕ1h1 + ϕ2h2 + ϕ3h3.
L01642: (3.4)
L01643: Figure 3.3 shows the flow of computation that creates the function in figure 3.2a.
L01644: Each hidden unit contains a linear function θ•0 + θ•1x of the input, and that line is
L01645: clipped by the ReLU function a[•] below zero. The positions where the three lines cross
L01646: zero become the three “joints” in the final output. The three clipped lines are then
L01647: weighted by ϕ1, ϕ2, and ϕ3, respectively. Finally, the offset ϕ0 is added, which controls
L01648: the overall height of the final function.
L01649: Problems 3.1–3.8
L01650: Each linear region in figure 3.3j corresponds to a different activation pattern in the
L01651: hidden units. When a unit is clipped, we refer to it as inactive, and when it is not
L01652: clipped, we refer to it as active. For example, the shaded region receives contributions
L01653: from h1 and h3 (which are active) but not from h2 (which is inactive). The slope of each
L01654: linear region is determined by the original slopes θ•1 of the active inputs for this region
L01655: and the weights ϕ• that were subsequently applied. For example, the slope in the shaded
L01656: region (see problem 3.3) is θ11ϕ1 + θ31ϕ3, where the first term is the slope in panel (g)
L01657: and the second term is the slope in panel (i).
L01658: Each hidden unit contributes one “joint” to the function, so with three hidden units,
L01659: Notebook 3.1
L01660: Shallow networks I
L01661: there can be four linear regions. However, only three of the slopes of these regions are
L01662: independent; the fourth is either zero (if all the hidden units are inactive in this region)
L01663: Problem 3.9
L01664: or is a sum of slopes from the other regions.
L01665: 3.1.2
L01666: Depicting neural networks
L01667: We have been discussing a neural network with one input, one output, and three hidden
L01668: units. We visualize this network in figure 3.4a. The input is on the left, the hidden units
L01669: are in the middle, and the output is on the right. Each connection represents one of the
L01670: ten parameters. To simplify this representation, we do not typically draw the intercept
L01671: parameters, so this network is usually depicted as in figure 3.4b.
L01672: 1For the purposes of this book, a linear function has the form z′ = ϕ0 + ∑
L01673: i ϕizi. Any other type of
L01674: function is nonlinear. For instance, the ReLU function (equation 3.2) and the example neural network
L01675: that contains it (equation 3.1) are both nonlinear. See notes at end of chapter for further clarification.
L01676: Draft: please send errata to udlbookmail@gmail.com.
L01679: <!-- page 42 -->
L01680: 28
L01681: 3
L01682: Shallow neural networks
L01683: Figure 3.3 Computation for function in figure 3.2a. a–c) The input x is passed
L01684: through three linear functions, each with a different y-intercept θ•0 and slope θ•1.
L01685: d–f) Each line is passed through the ReLU activation function, which clips neg-
L01686: ative values to zero. g–i) The three clipped lines are then weighted (scaled) by
L01687: ϕ1, ϕ2, and ϕ3, respectively. j) Finally, the clipped and weighted functions are
L01688: summed, and an offset ϕ0 that controls the height is added. Each of the four
L01689: linear regions corresponds to a different activation pattern in the hidden units.
L01690: In the shaded region, h2 is inactive (clipped), but h1 and h3 are both active.
L01691: (Interactive figure)
L01692: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
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
