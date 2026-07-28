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
L06484: <!-- page 128 -->
L06485: 114
L06486: 7
L06487: Gradients and initialization
L06488: Closely related to these methods are schemes such as BatchNorm (Ioffe & Szegedy, 2015), in
L06489: which the network normalizes the variance of each batch as part of its processing at every
L06490: step. BatchNorm and its variants are discussed in chapter 11. Other initialization schemes have
L06491: been proposed for specific architectures, including the ConvolutionOrthogonal initializer (Xiao
L06492: et al., 2018a) for convolutional networks, Fixup (Zhang et al., 2019a) for residual networks, and
L06493: TFixup (Huang et al., 2020a) and DTFixup (Xu et al., 2021b) for transformers.
L06494: Reducing memory requirements:
L06495: Training neural networks is memory intensive. We must
L06496: store both the model parameters and the pre-activations at the hidden units for every member
L06497: of the batch during the forward pass. Two methods that decrease memory requirements are
L06498: gradient checkpointing (Chen et al., 2016a) and micro-batching (Huang et al., 2019). In gradient
L06499: checkpointing, the activations are only stored every N layers during the forward pass. During
L06500: the backward pass, the intermediate missing activations are recalculated from the nearest check-
L06501: point. In this manner, we can drastically reduce the memory requirements at the computational
L06502: cost of performing the forward pass twice (problem 7.11). In micro-batching, the batch is sub-
L06503: divided into smaller parts, and the gradient updates are aggregated from each sub-batch before
L06504: being applied to the network. A completely different approach is to build a reversible network
L06505: (e.g., Gomez et al., 2017), in which the activations at the previous layer can be computed from
L06506: the activations at the current one, so there is no need to cache anything during the forward pass
L06507: (see chapter 16). Sohoni et al. (2019) review approaches to reducing memory requirements.
L06508: Distributed training:
L06509: For suﬀiciently large models, the memory requirements or total re-
L06510: quired time may be too much for a single processor.
L06511: In this case, we must use distributed
L06512: training, in which training takes place in parallel across multiple processors. There are several
L06513: approaches to parallelism. In data parallelism, each processor or node contains a full copy of
L06514: the model but runs a subset of the batch (see Xing et al., 2015; Li et al., 2020b). The gradients
L06515: from each node are aggregated centrally and then redistributed back to each node to ensure
L06516: that the models remain consistent. This is known as synchronous training. The synchronization
L06517: required to aggregate and redistribute the gradients can be a performance bottleneck, and this
L06518: leads to the idea of asynchronous training. For example, in the Hogwild! algorithm (Recht
L06519: et al., 2011), the gradient from a node is used to update a central model whenever it is ready.
L06520: The updated model is then redistributed to the node. This means that each node may have a
L06521: slightly different version of the model at any given time, so the gradient updates may be stale;
L06522: however, it works well in practice. Other decentralized schemes have also been developed. For
L06523: example, in Zhang et al. (2016a), the individual nodes update one another in a ring structure.
L06524: Data parallelism methods still assume that the entire model can be held in the memory of a
L06525: single node. Pipeline model parallelism stores different layers of the network on different nodes
L06526: and hence does not have this requirement. In a naïve implementation, the first node runs the
L06527: forward pass for the batch on the first few layers and passes the result to the next node, which
L06528: runs the forward pass on the next few layers and so on. In the backward pass, the gradients are
L06529: updated in the opposite order. The obvious disadvantage of this approach is that each machine
L06530: lies idle for most of the cycle. Various schemes revolving around each node processing micro-
L06531: batches sequentially have been proposed to reduce this ineﬀiciency (e.g., Huang et al., 2019;
L06532: Narayanan et al., 2021a). Finally, in tensor model parallelism, computation at a single network
L06533: layer is distributed across nodes (e.g., Shoeybi et al., 2019). A good overview of distributed
L06534: training methods can be found in Narayanan et al. (2021b), who combine tensor, pipeline, and
L06535: data parallelism to train a language model with one trillion parameters on 3072 GPUs.
L06536: Problems
L06537: Problem 7.1 A two-layer network with two hidden units in each layer can be defined as:
L06538: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L06541: <!-- page 129 -->
L06542: Notes
L06543: 115
L06544: y
L06545: =
L06546: ϕ0 + ϕ1a
L06547: h
L06548: ψ01 + ψ11a[θ01 + θ11x] + ψ21a[θ02 + θ12x]
L06549: i
L06550: +ϕ2a
L06551: h
L06552: ψ02 + ψ12a[θ01 + θ11x] + ψ22a[θ02 + θ12x]
L06553: i
L06554: ,
L06555: (7.35)
L06556: where the functions a[•] are ReLU functions. Compute the derivatives of the output y with
L06557: respect to each of the 13 parameters ϕ•, θ••, and ψ•• directly (i.e., not using the backpropagation
L06558: algorithm).
L06559: The derivative of the ReLU function with respect to its input ∂a[z]/∂z is the
L06560: indicator function I[z > 0], which returns one if the argument is greater than zero and zero
L06561: otherwise (figure 7.6).
L06562: Problem 7.2 Find an expression for the final term in each of the five chains of derivatives in
L06563: equation 7.13.
L06564: Problem 7.3 What size are each of the terms in equation 7.20?
L06565: Problem 7.4 Calculate the derivative ∂ℓi/∂f[xi, ϕ] for the least squares loss function:
L06566: ℓi = (yi −f[xi, ϕ])2.
L06567: (7.36)
L06568: Problem 7.5 Calculate the derivative ∂ℓi/∂f[xi, ϕ] for the binary classification loss function:
L06569: ℓi = −(1 −yi) log
L06570: h
L06571: 1 −sig
L06572: 
L06573: f[xi, ϕ]
L06574: i
L06575: −yi log
L06576: h
L06577: sig
L06578: 
L06579: f[xi, ϕ]
L06580: i
L06581: ,
L06582: (7.37)
L06583: where the function sig[•] is the logistic sigmoid and is defined as:
L06584: sig[z] =
L06585: 1
L06586: 1 + exp[−z].
L06587: (7.38)
L06588: Problem 7.6∗Show that for z = β + Ωh:
L06589: ∂z
L06590: ∂h = ΩT ,
L06591: (7.39)
L06592: where ∂z/∂h is a matrix containing the term ∂zi/∂hj in its ith column and jth row. To do this,
L06593: first find an expression for the constituent elements ∂zi/∂hj, and then consider the form that
L06594: the matrix ∂z/∂h must take.
L06595: Problem 7.7 Consider the case where we use the logistic sigmoid (see equation 7.38) as an
L06596: activation function, so h = sig[f]. Compute the derivative ∂h/∂f for this activation function.
L06597: What happens to the derivative when the input takes (i) a large positive value and (ii) a large
L06598: negative value?
L06599: Problem 7.8 Consider using (i) the Heaviside function and (ii) the rectangular function as
L06600: activation functions:
L06601: Heaviside[z] =
L06602: (
L06603: 0
L06604: z < 0
L06605: 1
L06606: z ≥0 ,
L06607: (7.40)
L06608: Draft: please send errata to udlbookmail@gmail.com.
L06611: <!-- page 130 -->
L06612: 116
L06613: 7
L06614: Gradients and initialization
L06615: Figure 7.9 Computational graph for problem 7.12 and problem 7.13. Adapted
L06616: from Domke (2010).
L06617: and
L06618: rect[z] =
L06619: 
L06620: 
L06621: 
L06622: 
L06623: 
L06624: 0
L06625: z < 0
L06626: 1
L06627: 0 ≤z ≤1
L06628: 0
L06629: z > 1
L06630: .
L06631: (7.41)
L06632: Discuss why these functions are problematic for neural network training with gradient-based
L06633: optimization methods.
L06634: Problem 7.9∗Consider a loss function ℓ[f], where f = β + Ωh. We want to find how the loss ℓ
L06635: changes when we change Ω, which we’ll express with a matrix that contains the derivative
L06636: ∂ℓ/∂Ωij at the ith row and jth column. Find an expression for ∂fi/∂Ωij and, using the chain
L06637: rule, show that:
L06638: ∂ℓ
L06639: ∂Ω= ∂ℓ
L06640: ∂f hT .
L06641: (7.42)
L06642: Problem 7.10∗Derive the equations for the backward pass of the backpropagation algorithm
L06643: for a network that uses leaky ReLU activations, which are defined as:
L06644: a[z] = ReLU[z] =
L06645: (
L06646: α · z
L06647: z < 0
L06648: z
L06649: z ≥0 ,
L06650: (7.43)
L06651: where α is a small positive constant (typically 0.1).
L06652: Problem 7.11 Consider training a network with fifty layers using gradient checkpointing. As-
L06653: sume that we store the pre-activations at every tenth hidden layer during the forward pass.
L06654: Explain how to compute the derivatives in this situation.
L06655: Problem 7.12∗This problem explores computing derivatives on general acyclic computational
L06656: graphs. Consider the function:
L06657: y = exp
L06658: 
L06659: exp[x] + exp[x]2
L06660: + sin[exp[x] + exp[x]2].
L06661: (7.44)
L06662: We can break this down into a series of intermediate computations so that:
L06663: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L06666: <!-- page 131 -->
L06667: Notes
L06668: 117
L06669: f1
L06670: =
L06671: exp[x]
L06672: f2
L06673: =
L06674: f 2
L06675: 1
L06676: f3
L06677: =
L06678: f1 + f2
L06679: f4
L06680: =
L06681: exp[f3]
L06682: f5
L06683: =
L06684: sin[f3]
L06685: y
L06686: =
L06687: f4 + f5.
L06688: (7.45)
L06689: The associated computational graph is depicted in figure 7.9. Compute the derivative ∂y/∂x
L06690: by reverse-mode differentiation. In other words, compute in order:
L06691: ∂y
L06692: ∂f5 , ∂y
L06693: ∂f4 , ∂y
L06694: ∂f3 , ∂y
L06695: ∂f2 , ∂y
L06696: ∂f1 and ∂y
L06697: ∂x,
L06698: (7.46)
L06699: using the chain rule in each case to make use of the derivatives already computed.
L06700: Problem 7.13∗
L06701: For the same function as in problem 7.12, compute the derivative ∂y/∂x by
L06702: forward-mode differentiation. In other words, compute in order:
L06703: ∂f1
L06704: ∂x , ∂f2
L06705: ∂x , ∂f3
L06706: ∂x , ∂f4
L06707: ∂x , ∂f5
L06708: ∂x , and ∂y
L06709: ∂x,
L06710: (7.47)
L06711: using the chain rule in each case to make use of the derivatives already computed. Why do
L06712: we not use forward-mode differentiation when we calculate the parameter gradients for deep
L06713: networks?
L06714: Problem 7.14 Consider a random variable a with variance Var[a] = σ2 and a symmetrical
L06715: distribution around the mean E[a] = 0. Prove that if we pass this variable through the ReLU
L06716: function:
L06717: b = ReLU[a] =
L06718: (
L06719: 0
L06720: a < 0
L06721: a
L06722: a ≥0 ,
L06723: (7.48)
L06724: then the second moment of the transformed variable is E[b2] = σ2/2.
L06725: Problem 7.15 What would you expect to happen if we initialized all of the weights and biases
L06726: in the network to zero?
L06727: Problem 7.16 Implement the code in figure 7.8 in PyTorch and plot the training loss as a
L06728: function of the number of epochs.
L06729: Problem 7.17 Change the code in figure 7.8 to tackle a binary classification problem. You will
L06730: need to (i) change the targets y so they are binary, (ii) change the network to predict numbers
L06731: between zero and one (iii) change the loss function appropriately.
L06732: Draft: please send errata to udlbookmail@gmail.com.
L06735: <!-- page 132 -->
L06736: Chapter 8
L06737: Measuring performance
L06738: Previous chapters described neural network models, loss functions, and training algo-
L06739: rithms. This chapter considers how to measure the performance of the trained models.
L06740: With suﬀicient capacity (i.e., number of hidden units), a neural network model will often
L06741: perform perfectly on the training data. However, this does not necessarily mean it will
L06742: generalize well to new test data.
L06743: We will see that the test errors have three distinct causes and that their relative
L06744: contributions depend on (i) the inherent uncertainty in the task, (ii) the amount of
L06745: training data, and (iii) the choice of model. The latter dependency raises the issue of
L06746: hyperparameter search. We discuss how to select both the model hyperparameters (e.g.,
L06747: the number of hidden layers and the number of hidden units in each) and the learning
L06748: algorithm hyperparameters (e.g., the learning rate and batch size).
L06749: 8.1
L06750: Training a simple model
L06751: We explore model performance using the MNIST-1D dataset (figure 8.1).
L06752: This con-
L06753: sists of ten classes y ∈{0, 1, . . . , 9}, representing the digits 0–9. The data are derived
L06754: from 1D templates for each of the digits. Each data example x is created by randomly
L06755: transforming one of these templates and adding noise. The full training dataset {xi, yi}
L06756: consists of I =4000 training examples, each consisting of Di =40 dimensions representing
L06757: the horizontal offset at 40 positions. The ten classes are drawn uniformly during data
L06758: generation, so there are ∼400 examples of each class.
L06759: We use a network with Di = 40 inputs and Do = 10 outputs which are passed through
L06760: a softmax function to produce class probabilities (see section 5.5). The network has two
L06761: hidden layers with D = 100 hidden units each. It is trained using stochastic gradient
L06762: descent with batch size 100 and learning rate 0.1 for 6000 steps (150 epochs) with a
L06763: multiclass cross-entropy loss (equation 5.24). Figure 8.2 shows that the training error
L06764: decreases as training proceeds. The training data are classified perfectly after about
L06765: 4000 steps. The training loss also decreases, eventually approaching zero.
L06766: Problem 8.1
L06767: However, this doesn’t imply that the classifier is perfect; the model might have mem-
L06768: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L06771: <!-- page 133 -->
L06772: 8.1
L06773: Training a simple model
L06774: 119
L06775: Figure 8.1 MNIST-1D. a) Templates for 10 classes y ∈{0, . . . , 9}, based on digits
L06776: 0–9. b) Training examples x are created by randomly transforming a template
L06777: and c) adding noise. d) The horizontal offset of the transformed template is then
L06778: sampled at 40 vertical positions. Adapted from (Greydanus, 2020)
L06779: Figure 8.2 MNIST-1D results. a) Percent classification error as a function of the
L06780: training step. The training set errors decrease to zero, but the test errors do not
L06781: drop below ∼40%. This model doesn’t generalize well to new test data. b) Loss
L06782: as a function of the training step. The training loss decreases steadily toward
L06783: zero.
L06784: The test loss decreases at first but subsequently increases as the model
L06785: becomes increasingly confident about its (wrong) predictions.
L06786: Draft: please send errata to udlbookmail@gmail.com.
L06789: <!-- page 134 -->
L06790: 120
L06791: 8
L06792: Measuring performance
L06793: Figure 8.3 Regression function.
L06794: Solid
L06795: black line shows ground truth function.
L06796: To generate I training examples {xi, yi},
L06797: the input space x ∈[0, 1] is divided
L06798: into I equal segments and one sample xi
L06799: is drawn from a uniform distribution
L06800: within each segment.
L06801: The correspond-
L06802: ing value yi is created by evaluating the
L06803: function at xi and adding Gaussian noise
L06804: (gray region shows ±2 standard devia-
L06805: tions).
L06806: The test data are generated in
L06807: the same way.
L06808: orized the training set but be unable to predict new examples. To estimate the true
L06809: performance, we need a separate test set of input/output pairs {xi, yi}. To this end, we
L06810: generate 1000 more examples using the same process. Figure 8.2a also shows the errors
L06811: for this test data as a function of the training step. These decrease as training proceeds,
L06812: but only to around 40%. This is better than the chance error rate of 90% but far worse
L06813: than for the training set; the model has not generalized well to the test data.
L06814: The test loss (figure 8.2b) decreases for the first 1500 training steps but then increases
L06815: Notebook 8.1
L06816: MNIST-1D
L06817: performance
L06818: again. At this point, the test error rate is fairly constant; the model makes the same
L06819: mistakes but with increasing confidence. This decreases the probability of the correct
L06820: answers and thus increases the negative log-likelihood. This increasing confidence is a
L06821: side-effect of the softmax function; the pre-softmax activations are driven to increasingly
L06822: extreme values to make the probability of the training data approach one (see figure 5.10).
L06823: 8.2
L06824: Sources of error
L06825: We now consider the sources of the errors that occur when a model fails to generalize. To
L06826: make this easier to visualize, we revert to a 1D least squares regression problem where
L06827: we know exactly how the ground truth data were generated. Figure 8.3 shows a quasi-
L06828: sinusoidal function; both training and test data are generated by sampling input values
L06829: in the range [0, 1], passing them through this function, and adding Gaussian noise with
L06830: a fixed variance.
L06831: We fit a simplified shallow neural net to this data (figure 8.4). The weights and biases
L06832: that connect the input layer to the hidden layer are chosen so that the “joints” of the
L06833: function are evenly spaced across the interval. If there are D hidden units, then these
L06834: joints will be at 0, 1/D, 2/D, . . . , (D −1)/D. This model can represent any piecewise
L06835: linear function with D equally sized regions in the range [0, 1]. As well as being easy to
L06836: understand, this model also has the advantage that it can be fit in closed form without
L06837: the need for stochastic optimization algorithms (see problem 8.3). Consequently, we can
L06838: Problems 8.2–8.3
L06839: guarantee to find the global minimum of the loss function during training.
L06840: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L06843: <!-- page 135 -->
L06844: 8.2
L06845: Sources of error
L06846: 121
L06847: Figure 8.4 Simplified neural network with three hidden units. a) The weights and
L06848: biases between the input and hidden layer are fixed (dashed arrows). b–d) They
L06849: are chosen so that the hidden unit activations have slope one, and their joints are
L06850: equally spaced across the interval, with joints at x = 0, x = 1/3, and x = 2/3,
L06851: respectively. Modifying the remaining parameters ϕ = {β, ω1, ω2, ω3} can create
L06852: any piecewise linear function over x ∈[0, 1] with joints at 1/3 and 2/3.
L06853: e–g)
L06854: Three example functions with different values of the parameters ϕ.
L06855: Draft: please send errata to udlbookmail@gmail.com.
L06858: <!-- page 136 -->
L06859: 122
L06860: 8
L06861: Measuring performance
L06862: Figure 8.5 Sources of test error. a) Noise. Data generation is noisy, so even if the
L06863: model exactly replicates the true underlying function (black line), the noise in the
L06864: test data (gray points) means that some error will remain (gray region represents
L06865: two standard deviations). b) Bias. Even with the best possible parameters, the
L06866: three-region model (cyan line) cannot exactly fit the true function (black line).
L06867: This bias is another source of error (gray regions represent signed error).
L06868: c)
L06869: Variance. In practice, we have limited noisy training data (orange points). When
L06870: we fit the model, we don’t recover the best possible function from panel (b) but
L06871: a slightly different function (cyan line) that reflects idiosyncrasies of the training
L06872: data.
L06873: This provides an additional source of error (gray region represents two
L06874: standard deviations). Figure 8.6 shows how this region was calculated.
L06875: 8.2.1
L06876: Noise, bias, and variance
L06877: There are three possible sources of error, which are known as noise, bias, and variance
L06878: respectively (figure 8.5):
L06879: Noise
L06880: The data generation process includes the addition of noise, so there are multiple
L06881: possible valid outputs y for each input x (figure 8.5a). This source of error is insurmount-
L06882: able for the test data. Note that it does not necessarily limit the training performance;
L06883: we will likely never see the same input x twice during training, so it is still possible to
L06884: fit the training data perfectly.
L06885: Noise may arise because there is a genuine stochastic element to the data generation
L06886: process, because some of the data are mislabeled, or because there are further explanatory
L06887: variables that were not observed.
L06888: In rare cases, noise may be absent; for example,
L06889: a network might approximate a function that is deterministic but requires significant
L06890: computation to evaluate.
L06891: However, noise is usually a fundamental limitation on the
L06892: possible test performance.
L06893: Bias
L06894: A second potential source of error may occur because the model is not flexible
L06895: enough to fit the true function perfectly. For example, the three-region neural network
L06896: model cannot exactly describe the quasi-sinusoidal function, even when the parameters
L06897: are chosen optimally (figure 8.5b). This is known as bias.
L06898: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L06901: <!-- page 137 -->
L06902: 8.2
L06903: Sources of error
L06904: 123
L06905: Variance
L06906: We have limited training examples, and there is no way to distinguish sys-
L06907: tematic changes in the underlying function from noise in the underlying data. When
L06908: we fit a model, we do not get the closest possible approximation to the true underly-
L06909: ing function. Indeed, for different training datasets, the result will be slightly different
L06910: each time. This additional source of variability in the fitted function is termed variance
L06911: (figure 8.5c). In practice, there might also be additional variance due to the stochastic
L06912: learning algorithm, which does not necessarily converge to the same solution each time.
L06913: 8.2.2
L06914: Mathematical formulation of test error
L06915: We now make the notions of noise, bias, and variance mathematically precise. Consider
L06916: a 1D regression problem where the data generation process has additive noise with vari-
L06917: ance σ2 (e.g., figure 8.3); we can observe different outputs y for the same input x, so for
L06918: Appendix C.2
L06919: Expectation
L06920: each x, there is a distribution Pr(y|x) with expected value (mean) µ[x]:
L06921: µ[x] = Ey[y[x]] =
L06922: Z
L06923: y[x]Pr(y|x)dy,
L06924: (8.1)
L06925: and fixed noise σ2 = Ey
L06926: 
L06927: (µ[x] −y[x])2
L06928: . Here we have used the notation y[x] to specify
L06929: that we are considering the output y at a given input position x.
L06930: Now consider a least squares loss between the model prediction f[x, ϕ] at position x
L06931: and the observed value y[x] at that position:
L06932: L[x]
L06933: =
L06934:  f[x, ϕ] −y[x]
L06935: 2
L06936: (8.2)
L06937: =
L06938:  f[x, ϕ] −µ[x]
L06939: 
L06940: +
L06941:  µ[x] −y[x]
L06942: 2
L06943: =
L06944:  f[x, ϕ] −µ[x]
L06945: 2 + 2
L06946:  f[x, ϕ] −µ[x]
L06947:  µ[x] −y[x]
L06948: 
L06949: +
L06950:  µ[x] −y[x]
L06951: 2,
L06952: where we have both added and subtracted the mean µ[x] of the underlying function in
L06953: the second line and have expanded out the squared term in the third line.
L06954: The underlying function is stochastic, so this loss depends on the particular y[x] we
L06955: observe. The expected loss is:
L06956: Ey
L06957: 
L06958: L[x]
L06959: 
L06960: =
L06961: Ey
L06962: h f[x, ϕ]−µ[x]
L06963: 2 + 2
L06964:  f[x, ϕ]−µ[x]
L06965:  µ[x]−y[x]
L06966: 
L06967: +
L06968:  µ[x]−y[x]
L06969: 2i
L06970: =
L06971:  f[x, ϕ]−µ[x]
L06972: 2 + 2
L06973:  f[x, ϕ] −µ[x]
L06974:  µ[x]−Ey [y[x]]
L06975: 
L06976: + Ey
L06977: 
L06978: (µ[x]−y[x])2
L06979: =
L06980:  f[x, ϕ]−µ[x]
L06981: 2 + 2
L06982:  f[x, ϕ]−µ[x]
L06983: 
L06984: · 0 + Ey
L06985: h µ[x]−y[x]
L06986: 2i
L06987: =
L06988:  f[x, ϕ] −µ[x]
L06989: 2 + σ2,
L06990: (8.3)
L06991: where we have made use of the rules for manipulating expectations. In the second line, we
L06992: Appendix C.2.1
L06993: Expectation rules
L06994: have distributed the expectation operator and removed it from terms with no dependence
L06995: on y[x], and in the third line, we note that the second term is zero since Ey[y[x]] = µ[x]
L06996: by definition. Finally, in the fourth line, we have substituted in the definition of the
L06997: Draft: please send errata to udlbookmail@gmail.com.
L07000: <!-- page 138 -->
L07001: 124
L07002: 8
L07003: Measuring performance
L07004: noise σ2. We can see that the expected loss has been broken down into two terms; the
L07005: first term is the squared deviation between the model and the true function mean, and
L07006: the second term is the noise.
L07007: The first term can be further partitioned into bias and variance. The parameters ϕ of
L07008: the model f[x, ϕ] depend on the training dataset D = {xi, yi}, so more properly, we should
L07009: write f [x, ϕ[D]].
L07010: The training dataset is a random sample from the data generation
L07011: process; with a different sample of training data, we would learn different parameter
L07012: values. The expected model output fµ[x] with respect to all possible datasets D is hence:
L07013: fµ[x] = ED
L07014: h
L07015: f
L07016: 
L07017: x, ϕ[D]
L07018: i
L07019: .
L07020: (8.4)
L07021: Returning to the first term of equation 8.3, we add and subtract fµ[x] and expand:
L07022:  f[x, ϕ[D]]−µ[x]
L07023: 2
L07024: (8.5)
L07025: =
L07026:  f[x, ϕ[D]]−fµ[x]
L07027: 
L07028: +
L07029:  fµ[x] −µ[x]
L07030: 2
L07031: =
L07032:  f[x, ϕ[D]]−fµ[x]
L07033: 2 + 2
L07034:  f[x, ϕ[D]]−fµ[x]
L07035:  fµ[x]−µ[x]
L07036: 
L07037: +
L07038:  fµ[x]−µ[x]
L07039: 2.
L07040: We then take the expectation with respect to the training dataset D:
L07041: ED
L07042: h f[x, ϕ[D]] −µ[x]
L07043: 2i
L07044: = ED
L07045: h f[x, ϕ[D]] −fµ[x]
L07046: 2i
L07047: +
L07048:  fµ[x] −µ[x]
L07049: 2,
L07050: (8.6)
L07051: where we have simplified using similar steps as for equation 8.3. Finally, we substitute
L07052: this result into equation 8.3:
L07053: ED
L07054: h
L07055: Ey[L[x]]
L07056: i
L07057: = ED
L07058: h f[x, ϕ[D]] −fµ[x]
L07059: 2i
L07060: |
L07061: {z
L07062: }
L07063: variance
L07064: +
L07065:  fµ[x]−µ[x]
L07066: 2
L07067: |
L07068: {z
L07069: }
L07070: bias
L07071: + σ2.
L07072: |{z}
L07073: noise
L07074: (8.7)
L07075: This equation says that the expected loss after considering the uncertainty in the training
L07076: data D and the test data y consists of three additive components.
L07077: The variance is
L07078: uncertainty in the fitted model due to the particular training dataset we sample. The bias
L07079: is the systematic deviation of the model from the mean of the function we are modeling.
L07080: The noise is the inherent uncertainty in the true mapping from input to output. These
L07081: three sources of error will be present for any task. They combine additively for regression
L07082: tasks with a least squares loss. However, their interaction can be more complex for other
L07083: types of problems.
L07084: 8.3
L07085: Reducing error
L07086: In the previous section, we saw that test error results from three sources: noise, bias,
L07087: and variance. The noise component is insurmountable; there is nothing we can do to
L07088: circumvent this, and it represents a fundamental limit on expected model performance.
L07089: However, it is possible to reduce the other two terms.
L07090: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L07093: <!-- page 139 -->
L07094: 8.3
L07095: Reducing error
L07096: 125
L07097: 8.3.1
L07098: Reducing variance
L07099: Recall that the variance results from limited noisy training data.
L07100: Fitting the model
L07101: to two different training sets results in slightly different parameters. It follows we can
L07102: reduce the variance by increasing the quantity of training data. This averages out the
L07103: inherent noise and ensures that the input space is well sampled.
L07104: Figure 8.6 shows the effect of training with 6, 10, and 100 samples. For each dataset
L07105: size, we show the best-fitting model for three training datasets. With only six samples,
L07106: the fitted function is quite different each time: the variance is significant. As we increase
L07107: the number of samples, the fitted models become very similar, and the variance reduces.
L07108: In general, adding training data almost always improves test performance.
L07109: 8.3.2
L07110: Reducing bias
L07111: The bias term results from the inability of the model to describe the true underlying
L07112: function. This suggests that we can reduce this error by making the model more flexible.
L07113: This is usually done by increasing the model capacity. For neural networks, this means
L07114: adding more hidden units and/or hidden layers.
L07115: In the simplified model, adding capacity corresponds to adding more hidden units
L07116: so that the interval [0, 1] is divided into more linear regions. Figures 8.7a–c show that
L07117: (unsurprisingly) this does indeed reduce the bias; as we increase the number of linear
L07118: regions to ten, the model becomes flexible enough to fit the true function closely.
L07119: 8.3.3
L07120: Bias-variance trade-off
L07121: However, figures 8.7d–f show an unexpected side-effect of increasing the model capacity.
L07122: For a fixed-size training dataset, the variance term typically increases as the model
L07123: capacity increases.
L07124: Consequently, increasing the model capacity does not necessarily
L07125: reduce the test error. This is known as the bias-variance trade-off.
L07126: Figure 8.8 explores this phenomenon. In panels a–c), we fit the simplified three-region
L07127: model to three different datasets of fifteen points. Although the datasets differ, the final
L07128: model is much the same; the noise in the dataset roughly averages out in each linear
L07129: region. In panels d–f), we fit a model with ten regions to the same three datasets. This
L07130: model has more flexibility, but this is disadvantageous; the model certainly fits the data
L07131: better, and the training error will be lower, but much of the extra descriptive power is
L07132: devoted to modeling the noise. This phenomenon is known as overfitting.
L07133: We’ve seen that as we add capacity to the model, the bias decreases, but the variance
L07134: increases for a fixed-size training dataset. This suggests that there is an optimal capacity
L07135: where the bias is not too large and the variance is still relatively small. Figure 8.9 shows
L07136: how these terms vary numerically for the toy model as we increase the capacity, using
L07137: Notebook 8.2
L07138: Bias-variance
L07139: trade-off
L07140: the data from figure 8.8. For regression models, the total expected error is the sum of
L07141: the bias and the variance, and this sum is minimized when the model capacity is four
L07142: (i.e., with four hidden units and four linear regions in the range of the data).
L07143: Draft: please send errata to udlbookmail@gmail.com.
L07146: <!-- page 140 -->
L07147: 126
L07148: 8
L07149: Measuring performance
L07150: Figure 8.6 Reducing variance by increasing training data. a–c) The three-region
L07151: model fitted to three different randomly sampled datasets of six points.
L07152: The
L07153: fitted model is quite different each time. d) We repeat this experiment many
L07154: times and plot the mean model predictions (cyan line) and the variance of the
L07155: model predictions (gray area shows two standard deviations). e–h) We do the
L07156: same experiment, but this time with datasets of size ten. The variance of the
L07157: predictions is reduced. i–l) We repeat this experiment with datasets of size 100.
L07158: Now the fitted model is always similar, and the variance is small.
L07159: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
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
