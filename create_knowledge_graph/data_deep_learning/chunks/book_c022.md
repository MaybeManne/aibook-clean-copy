L13241: <!-- page 277 -->
L13242: Notes
L13243: 263
L13244: weights, and pass through an activation function to create the node embeddings. Gilmer et al.
L13245: (2017) introduced message-passing neural networks, which defined convolutions on the graph
L13246: as propagating messages from spatial neighbors. The “aggregate and combine” formulation of
L13247: GraphSAGE (Hamilton et al., 2017a) fits into this framework.
L13248: Aggregate and combine:
L13249: Graph convolutional networks (Kipf & Welling, 2017) take a
L13250: weighted average of the neighbors and current node and then apply a linear mapping and
L13251: ReLU. GraphSAGE (Hamilton et al., 2017a) applies a neural network layer to each neighbor,
L13252: taking the elementwise maximum to aggregate. Chiang et al. (2019) propose diagonal enhance-
L13253: ment in which the previous embedding is weighted more than the neighbors. Kipf & Welling
L13254: (2017) introduced Kipf normalization, which normalizes the sum of the neighboring embeddings
L13255: based on the degrees of the current node and its neighbors (see equation 13.19).
L13256: The mixture model network or MoNet (Monti et al., 2017) takes this one step further by learning
L13257: a weighting based on the degrees of the current node and the neighbor. They associate a pseudo-
L13258: coordinate system with each node, where the positions of the neighbors depend on these two
L13259: quantities. They then learn a continuous function based on a mixture of Gaussians and sample
L13260: this at the pseudo-coordinates of the neighbors to get the weights. In this way, they can learn
L13261: the weightings for nodes and neighbors with arbitrary degrees. Pham et al. (2017) use a linear
L13262: interpolation of the node embedding and neighbors with a different weighted combination for
L13263: each dimension. The weight of this gating mechanism is generated as a function of the data.
L13264: Higher-order convolutional layers:
L13265: Zhou & Li (2017) used higher-order convolutions by
L13266: replacing the adjacency matrix A with ˜A = Min[AL + I, 1] where L is the maximum walk-
L13267: length, 1 is a matrix containing only ones, and Min[•] takes the pointwise minimum of its two
L13268: matrix arguments; the updates now sum together contributions from any nodes where there is
L13269: at least one walk of length L. Abu-El-Haija et al. (2019) proposed MixHop, which computes
L13270: node updates from the neighbors (using the adjacency matrix A), the neighbors of the neighbors
L13271: (using A2), and so on. They concatenate these updates at each layer. Lee et al. (2018) combined
L13272: information from nodes beyond the immediate neighbors using geometric motifs, which are small
L13273: local geometric patterns in the graph (e.g., a fully connected clique of five nodes).
L13274: Residual connections:
L13275: Kipf & Welling (2017) proposed a residual connection in which the
L13276: original embeddings are added to the updated ones. Hamilton et al. (2017b) concatenate the
L13277: previous embedding to the output of the next layer (see equation 13.16). Rossi et al. (2020)
L13278: present an inception-style network where the node embedding is concatenated to not only the
L13279: aggregation of its neighbors but also the aggregation of all neighbors within a walk of two (via
L13280: computing powers of the adjacency matrix). Xu et al. (2018) introduced jump knowledge con-
L13281: nections in which the final output at each node consists of the concatenated node embeddings
L13282: throughout the network. Zhang & Meng (2019) present a general formulation of residual em-
L13283: beddings called GResNet and investigate several variations in which the embeddings from the
L13284: previous layer are added, the input embeddings are added, or versions of these that aggregate
L13285: information from their neighbors (without further transformation) are added.
L13286: Attention in graph neural networks:
L13287: Veličković et al. (2019) developed the graph attention
L13288: network (figure 13.12c). Their formulation uses multiple heads whose outputs are combined
L13289: symmetrically. Gated Attention Networks (Zhang et al., 2018a) weight the output of the different
L13290: heads in a way that depends on the data itself. Graph-BERT (Zhang et al., 2020) performs
L13291: node classification using self-attention alone; the graph’s structure is captured by adding position
L13292: embeddings to the data, similarly to how the absolute or relative position of words is captured
L13293: in the transformer (chapter 12). For example, they add positional information that depends on
L13294: the number of hops between nodes in the graph.
L13295: Draft: please send errata to udlbookmail@gmail.com.
L13298: <!-- page 278 -->
L13299: 264
L13300: 13
L13301: Graph neural networks
L13302: Permutation invariance:
L13303: In DeepSets, Zaheer et al. (2017) presented a general permutation
L13304: invariant operator for processing sets. Janossy pooling (Murphy et al., 2018) accepts that many
L13305: functions are not permutation equivariant and instead uses a permutation-sensitive function
L13306: and averages the results across many permutations.
L13307: Edge graphs:
L13308: The notation of the edge graph, line graph, or adjoint graph dates to Whitney
L13309: (1932). The idea of “weaving” layers that update node embeddings from node embeddings,
L13310: node embeddings from edge embeddings, edge embeddings from edge embeddings, and edge
L13311: embeddings from node embeddings was proposed by Kearnes et al. (2016). However, here the
L13312: node-node and edge-edge updates do not involve the neighbors. Monti et al. (2018) introduced
L13313: the dual-primal graph CNN, a modern formulation in a CNN framework that alternates between
L13314: updates in the original and edge graphs.
L13315: Power of graph neural networks:
L13316: Xu et al. (2019) argue that a neural network should
L13317: be able to distinguish different graph structures; it is undesirable to map two graphs to the
L13318: same output if they have the same initial node embeddings but different adjacency matrices.
L13319: They identified graph structures that could not be distinguished by previous approaches such
L13320: as GCNs (Kipf & Welling, 2017) and GraphSAGE (Hamilton et al., 2017a). They developed a
L13321: more powerful architecture with the same discriminative power as the Weisfeiler-Lehman graph
L13322: isomorphism test (Weisfeiler & Leman, 1968), which is known to discriminate a broad class of
L13323: graphs. This resulting graph isomorphism network was based on the aggregation operation:
L13324: h(n)
L13325: k+1 = mlp
L13326: 
L13327: (1 + ϵk) h(n)
L13328: k
L13329: +
L13330: X
L13331: m∈ne[n]
L13332: h(m)
L13333: k
L13334: 
L13335: .
L13336: (13.26)
L13337: Batches:
L13338: The original paper on graph convolutional networks (Kipf & Welling, 2017) used full-
L13339: batch gradient descent. This has memory requirements proportional to the number of nodes,
L13340: embedding size, and number of layers during training.
L13341: Since then, three types of methods
L13342: have been proposed to reduce the memory requirements and create batches for SGD in the
L13343: transductive setting: node sampling, layer sampling, and sub-graph sampling.
L13344: Node sampling methods start by randomly selecting a subset of target nodes and then work
L13345: back through the network, adding a subset of the nodes in the receptive field at each stage.
L13346: GraphSAGE (Hamilton et al., 2017a) proposed a fixed number of neighborhood samples as
L13347: in figure 13.10b. Chen et al. (2018b) introduce a variance reduction technique, but this uses
L13348: historical activations of nodes and so still has a high memory requirement. PinSAGE (Ying
L13349: et al., 2018a) uses random walks from the target nodes and chooses the K nodes with the highest
L13350: visit count. This prioritizes ancestors that are more closely connected.
L13351: Node sampling still requires increasing numbers of nodes as we pass back through the graph.
L13352: Layer sampling methods address this by directly sampling the receptive field in each layer
L13353: independently. Examples of layer sampling include FastGCN (Chen et al., 2018a), adaptive
L13354: sampling (Huang et al., 2018b), and layer-dependent importance sampling (Zou et al., 2019).
L13355: Subgraph sampling methods randomly draw subgraphs or divide the original graph into sub-
L13356: graphs. These are then trained as independent data examples. Examples of these approaches
L13357: include GraphSAINT (Zeng et al., 2020), which samples sub-graphs during training using ran-
L13358: dom walks and then runs a full GCN on the subgraph while also correcting for the bias and
L13359: variance of the minibatch. Cluster GCN (Chiang et al., 2019) partitions the graph into clusters
L13360: (by maximizing the embedding utilization or number of within-batch edges) in a pre-processing
L13361: stage and randomly selects clusters to form minibatches. To create more randomness, they train
L13362: random subsets of these clusters plus the edges between them (see figure 13.11).
L13363: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L13366: <!-- page 279 -->
L13367: Notes
L13368: 265
L13369: Wolfe et al. (2021) proposed a distributed training method that both partitions the graph and
L13370: trains narrower GCNs in parallel by partitioning the feature space at different layers. More
L13371: information about sampling graphs can be found in Rozemberczki et al. (2020).
L13372: Regularization and normalization:
L13373: Rong et al. (2020) proposed DropEdge, which randomly
L13374: drops edges from the graph during each training iteration by masking the adjacency matrix. This
L13375: can be done for the whole neural network or differently in each layer (layer-wise DropEdge). In a
L13376: sense, this is similar to dropout in that it breaks connections in the flow of data, but it can also be
L13377: considered an augmentation method since changing the graph is similar to perturbing the data.
L13378: Schlichtkrull et al. (2018), Teru et al. (2020), and Veličković et al. (2019) also proposed randomly
L13379: dropping edges from the graph as a form of regularization similar to dropout. Node sampling
L13380: methods (Hamilton et al., 2017a; Huang et al., 2018b; Chen et al., 2018a) can also be considered
L13381: regularizers. Hasanzadeh et al. (2020) present a general framework called DropConnect that
L13382: unifies many of the above approaches.
L13383: There are also many proposed normalization schemes for graph neural networks, including
L13384: PairNorm (Zhao & Akoglu, 2020), weight normalization (Oono & Suzuki, 2019), differentiable
L13385: group normalization (Zhou et al., 2020b), and GraphNorm (Cai et al., 2021).
L13386: Multi-relational graphs:
L13387: Schlichtkrull et al. (2018) proposed a variation of graph convolu-
L13388: tional networks for multi-relational graphs (i.e., graphs with more than one edge type). Their
L13389: scheme separately aggregates information from each edge type using different parameters. If
L13390: there are many edge types, the number of parameters may become large, and to combat this,
L13391: they propose that each edge type uses a different weighting of a basis set of parameters.
L13392: Hierarchical representations and pooling:
L13393: CNNs for image classification gradually de-
L13394: crease the representation size but increase the number of channels as the network progresses.
L13395: However, the GCNs for graph classification in this chapter maintain the entire graph until the
L13396: last layer and then combine all the nodes to compute the final prediction. Ying et al. (2018b)
L13397: proposed DiffPool, which clusters graph nodes to make a graph that gets progressively smaller
L13398: as the depth increases in a way that is differentiable, and so can be learned. This can be done
L13399: based on the graph structure alone or adaptively based on the graph structure and the embed-
L13400: dings. Other pooling methods include SortPool (Zhang et al., 2018b) and self-attention graph
L13401: pooling (Lee et al., 2019). A comparison of pooling layers for graph neural networks can be
L13402: found in Grattarola et al. (2022). Gao & Ji (2019) propose an encoder-decoder structure for
L13403: graphs based on the U-Net (see figure 11.10).
L13404: Geometric graphs:
L13405: The MoNet model (Monti et al., 2017) can exploit geometric information
L13406: because neighboring nodes have well-defined spatial positions. They learn a mixture of Gaus-
L13407: sians function and sample from this based on the relative coordinates of the neighbor. In this
L13408: way, they can weight neighboring nodes based on their relative positions as in standard convolu-
L13409: tional neural networks, even though these positions are not constant. The geodesic CNN (Masci
L13410: et al., 2015) and anisotropic CNN (Boscaini et al., 2016) both adapt convolution to manifolds
L13411: (i.e., surfaces) as represented by triangular meshes. They locally approximate the surface as a
L13412: plane and define a coordinate system on this plane around the current node.
L13413: Oversmoothing and suspended animation:
L13414: Unlike other deep learning models, graph neu-
L13415: ral networks did not, until recently, benefit significantly from increasing depth. Indeed, the orig-
L13416: inal GCN paper (Kipf & Welling, 2017) and GraphSAGE (Hamilton et al., 2017a) both only
L13417: use two layers, and Chiang et al. (2019) trained a five-layer Cluster-GCN to get state-of-the-art
L13418: performance on the PPI dataset. One possible explanation is over-smoothing (Li et al., 2018c);
L13419: at each layer, the network incorporates information from a larger neighborhood, and it may
L13420: be that this ultimately results in the dissolution of (important) local information. Indeed (Xu
L13421: et al., 2018) prove that the influence of one node on another is proportional to the probability
L13422: Draft: please send errata to udlbookmail@gmail.com.
L13425: <!-- page 280 -->
L13426: 266
L13427: 13
L13428: Graph neural networks
L13429: of reaching that node in a K-step random walk. This approaches the stationary distribution of
L13430: walks over the graph with increasing K, causing the local neighborhood to be washed out.
L13431: Alon & Yahav (2021) proposed another explanation for why performance doesn’t improve with
L13432: network depth. They argue that adding depth allows information to be aggregated from longer
L13433: paths. However, in practice, the exponential growth in the number of neighbors means there is
L13434: a bottleneck whereby too much information is “squashed” into the fixed-size node embeddings.
L13435: Ying et al. (2018a) also note that when the depth of the network exceeds a certain limit, the
L13436: gradients no longer propagate back, and learning fails for both the training and test data. They
L13437: term this effect suspended animation. This is similar to when many layers are naïvely added to
L13438: convolutional neural networks (figure 11.2). They propose a family of residual connections that
L13439: allow deeper networks to be trained. Vanishing gradients (section 7.5) have also been identified
L13440: as a limitation by Li et al. (2021b).
L13441: It has recently become possible to train deeper graph neural networks using various forms of
L13442: residual connection (Xu et al., 2018; Li et al., 2020a; Gong et al., 2020; Chen et al., 2020b; Xu
L13443: et al., 2021a). Li et al. (2021a) train a state-of-the-art model with more than 1000 layers using
L13444: an invertible network to reduce the memory requirements of training (see chapter 16).
L13445: Problems
L13446: Problem 13.1 Write out the adjacency matrices for the two graphs in figure 13.14.
L13447: Problem 13.2∗Draw graphs that correspond to the following adjacency matrices:
L13448: A1 =
L13449: 
L13450: 
L13451: 0
L13452: 1
L13453: 1
L13454: 0
L13455: 0
L13456: 0
L13457: 0
L13458: 1
L13459: 0
L13460: 0
L13461: 1
L13462: 1
L13463: 1
L13464: 0
L13465: 1
L13466: 0
L13467: 0
L13468: 0
L13469: 0
L13470: 1
L13471: 1
L13472: 0
L13473: 1
L13474: 0
L13475: 0
L13476: 0
L13477: 1
L13478: 1
L13479: 0
L13480: 1
L13481: 0
L13482: 0
L13483: 0
L13484: 0
L13485: 1
L13486: 0
L13487: 1
L13488: 1
L13489: 1
L13490: 0
L13491: 0
L13492: 0
L13493: 0
L13494: 0
L13495: 1
L13496: 1
L13497: 1
L13498: 0
L13499: 0
L13500: 
L13501: 
L13502: and
L13503: A2 =
L13504: 
L13505: 
L13506: 0
L13507: 0
L13508: 1
L13509: 1
L13510: 0
L13511: 0
L13512: 1
L13513: 0
L13514: 0
L13515: 1
L13516: 1
L13517: 1
L13518: 0
L13519: 0
L13520: 1
L13521: 1
L13522: 0
L13523: 0
L13524: 0
L13525: 0
L13526: 0
L13527: 1
L13528: 1
L13529: 0
L13530: 0
L13531: 1
L13532: 1
L13533: 1
L13534: 0
L13535: 1
L13536: 0
L13537: 1
L13538: 0
L13539: 0
L13540: 1
L13541: 0
L13542: 0
L13543: 0
L13544: 1
L13545: 0
L13546: 0
L13547: 1
L13548: 1
L13549: 0
L13550: 0
L13551: 1
L13552: 1
L13553: 1
L13554: 0
L13555: 
L13556: 
L13557: .
L13558: Problem 13.3∗Consider the two graphs in figure 13.14. How many ways are there to walk from
L13559: node one to node two in (i) three steps and (ii) seven steps?
L13560: Problem 13.4 The diagonal of A2 in figure 13.4c contains the number of edges that connect to
L13561: each corresponding node. Explain this phenomenon.
L13562: Problem 13.5 What permutation matrix is responsible for the transformation between the
L13563: Appendix B.4.4
L13564: Permutation
L13565: matrix
L13566: graphs in figures 13.5a–c and figure 13.5d–f?
L13567: Problem 13.6 Prove that:
L13568: sig [βK + ωKHK1] = sig [βK + ωKHKP1] ,
L13569: (13.27)
L13570: where P is an N ×N permutation matrix (a matrix that is all zeros except for exactly one entry
L13571: in each row and each column, which is one), and 1 is an N × 1 vector of ones.
L13572: Problem 13.7∗Consider the simple GNN layer:
L13573: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L13576: <!-- page 281 -->
L13577: Notes
L13578: 267
L13579: Figure 13.14 Graphs for problems 13.1, 13.3, and 13.8.
L13580: Figure 13.15 Graphs for problems 13.11–13.13.
L13581: Hk+1
L13582: =
L13583: GraphLayer[Hk, A]
L13584: =
L13585: a
L13586: 
L13587: βk1T + Ωk
L13588:  Hk
L13589: HkA
L13590: 
L13591: ,
L13592: (13.28)
L13593: where H is a D × N matrix containing the N node embeddings in its columns, A is the N × N
L13594: adjacency matrix, β is the bias vector, and Ωis the weight matrix. Show that this layer is
L13595: equivariant to permutations of the node order so that:
L13596: GraphLayer[Hk, A]P = GraphLayer[HkP, PT AP],
L13597: (13.29)
L13598: where P is an N × N permutation matrix.
L13599: Problem 13.8 What is the degree matrix D for each graph in figure 13.14?
L13600: Problem 13.9 The authors of GraphSAGE (Hamilton et al., 2017a) propose a pooling method
L13601: in which the node embedding is averaged together with its neighbors so that:
L13602: agg[n] =
L13603: 1
L13604: 1 + |ne[n]|
L13605: 
L13606: hn +
L13607: X
L13608: m∈ne[n]
L13609: hm
L13610: 
L13611: .
L13612: (13.30)
L13613: Show how this operation can be computed simultaneously for all node embeddings in the D×N
L13614: embedding matrix H using linear algebra. You will need to use both the adjacency matrix A
L13615: and the degree matrix D.
L13616: Problem 13.10∗Devise a graph attention mechanism based on dot-product self-attention and
L13617: draw its mechanism in the style of figure 13.12.
L13618: Problem 13.11∗Draw the edge graph associated with the graph in figure 13.15a.
L13619: Draft: please send errata to udlbookmail@gmail.com.
L13622: <!-- page 282 -->
L13623: 268
L13624: 13
L13625: Graph neural networks
L13626: Problem 13.12∗Draw the node graph corresponding to the edge graph in figure 13.15b.
L13627: Problem 13.13 For a general undirected graph, describe how the adjacency matrix of the node
L13628: graph relates to the adjacency matrix of the corresponding edge graph.
L13629: Problem 13.14∗Design a layer that updates a node embedding hn based on its neighboring
L13630: node embeddings {hm}m∈ne[n] and neighboring edge embeddings {em}m∈nee[n]. You should
L13631: consider the possibility that the edge embeddings are not the same size as the node embeddings.
L13632: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L13635: <!-- page 283 -->
L13636: Chapter 14
L13637: Unsupervised learning
L13638: Chapters 2–9 walked through the supervised learning pipeline. We defined models that
L13639: mapped observed data x to output values y and introduced loss functions that measured
L13640: the quality of that mapping for a training dataset {xi, yi}.
L13641: Then we discussed how
L13642: to fit and measure the performance of these models. Chapters 10–13 introduced more
L13643: sophisticated model architectures incorporating parameter sharing and allowing parallel
L13644: computational paths.
L13645: The defining characteristic of unsupervised learning models is that they are learned
L13646: from a set of observed data {xi} in the absence of labels. All unsupervised models share
L13647: this property, but they have diverse goals. They may be used to generate plausible new
L13648: samples from the dataset or to manipulate, denoise, interpolate between, or compress
L13649: examples. They can also be used to reveal the internal structure of a dataset (e.g., by
L13650: dividing it into coherent clusters) or to distinguish whether new examples belong to the
L13651: same dataset or are outliers.
L13652: This chapter introduces a taxonomy of unsupervised learning models and then dis-
L13653: cusses the desirable properties of models and how to measure their performance. The
L13654: four subsequent chapters discuss four particular models: generative adversarial networks
L13655: (GANs), normalizing flows, variational autoencoders (VAEs), and diffusion models.1
L13656: 14.1
L13657: Taxonomy of unsupervised learning models
L13658: A common strategy in unsupervised learning is to define a mapping between the data
L13659: examples x and a set of unseen latent variables z. These latent variables capture un-
L13660: derlying structure in the dataset and usually have a lower dimension than the original
L13661: data; in this sense, a latent variable z can be considered a compressed version of a data
L13662: example x that captures its essential qualities (figures 1.9–1.10).
L13663: In principle, the mapping between the observed and latent variables can be in either
L13664: direction. Some models map from the data x to latent variables z. For example, the
L13665: 1Until this point, almost all of the relevant math has been embedded in the text. However, the
L13666: following four chapters require a solid knowledge of probability. Appendix C covers the relevant material.
L13667: Draft: please send errata to udlbookmail@gmail.com.
L13670: <!-- page 284 -->
L13671: 270
L13672: 14
L13673: Unsupervised learning
L13674: Figure 14.1 Taxonomy of unsupervised
L13675: learning models. Unsupervised learning
L13676: refers to any model trained on datasets
L13677: without labels.
L13678: Generative models can
L13679: synthesize (generate) new examples with
L13680: similar statistics to the training data. A
L13681: subset of these are probabilistic and de-
L13682: fine a distribution over the data.
L13683: We
L13684: draw samples from this distribution to
L13685: generate new examples.
L13686: Latent vari-
L13687: able models define a mapping between
L13688: an underlying explanatory (latent) vari-
L13689: able and the data and may fall into any
L13690: of the above categories.
L13691: famous k-means algorithm maps the data x to a cluster assignment z ∈{1, 2, . . . , K}.
L13692: Other models map from the latent variables z to the data x. Consider defining a dis-
L13693: tribution Pr(z) over the latent variable z in these models. New examples can now be
L13694: generated by (i) drawing from this distribution and (ii) mapping the sample to the data
L13695: space x. Accordingly, these are termed generative models (see figure 14.1).
L13696: The four models in chapters 15 to 18 are all generative models that use latent vari-
L13697: ables. Generative adversarial networks (chapter 15) learn to generate data examples x∗
L13698: from latent variables z, using a loss that encourages the generated samples to be indis-
L13699: tinguishable from real examples (figure 14.2a).
L13700: Normalizing flows, variational autoencoders, and diffusion models (chapters 16–18)
L13701: are probabilistic generative models. In addition to generating new examples, they assign a
L13702: probability Pr(x|ϕ) to each data point x. This will depend on the model parameters ϕ,
L13703: and in training, we maximize the probability of the observed data {xi}, so the loss is
L13704: the sum of the negative log-likelihoods (figure 14.2b):
L13705: L[ϕ] = −
L13706: I
L13707: X
L13708: i=1
L13709: log
L13710: h
L13711: Pr(xi|ϕ)
L13712: i
L13713: .
L13714: (14.1)
L13715: Since probability distributions must sum to one, this implicitly reduces the probability
L13716: of examples that lie far from the observed data. As well as providing a training criterion,
L13717: assigning probabilities is useful in its own right; the probability on a test set can be
L13718: used to compare two models quantitatively, and the probability for an example can be
L13719: thresholded to determine if it belongs to the same dataset or is an outlier.2
L13720: 14.2
L13721: What makes a good generative model?
L13722: Generative models based on latent variables should have the following properties:
L13723: 2Note that not all probabilistic generative models rely on latent variables. The transformer decoder
L13724: (section 12.7) was learned without labels, can generate new examples, and can assign a probability to
L13725: these examples but is based on an autoregressive formulation (equation 12.15).
L13726: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L13729: <!-- page 285 -->
L13730: 14.2
L13731: What makes a good generative model?
L13732: 271
L13733: Figure 14.2 Fitting generative models a) Generative adversarial models provide
L13734: a mechanism for generating samples (orange points). As training proceeds (left
L13735: to right), the loss function encourages these samples to become progressively less
L13736: distinguishable from real examples (cyan points). b) Probabilistic models (in-
L13737: cluding variational autoencoders, normalizing flows, and diffusion models) learn
L13738: a probability distribution over the training data. As training proceeds (left to
L13739: right), the likelihood of the real examples increases under this distribution, which
L13740: can be used to draw new samples and assess the probability of new data points.
L13741: • Eﬀicient sampling: Generating samples from the model should be computation-
L13742: ally inexpensive and take advantage of the parallelism of modern hardware.
L13743: • High-quality sampling: The samples should be indistinguishable from the real
L13744: data with which the model was trained.
L13745: • Coverage: Samples should represent the entire training distribution. It is insuf-
L13746: ficient to generate samples that all look like a subset of the training examples.
L13747: • Well-behaved latent space: Every latent variable z corresponds to a plausible
L13748: data example x. Smooth changes in z correspond to smooth changes in x.
L13749: • Disentangled latent space: Manipulating each dimension of z should correspond
L13750: to changing an interpretable property of the data. For example, in a model of
L13751: language, it might change the topic, tense, or verbosity.
L13752: • Eﬀicient likelihood computation: If the model is probabilistic, we would like
L13753: to be able to calculate the probability of new examples eﬀiciently and accurately.
L13754: This naturally leads to the question of whether the generative models that we consider
L13755: satisfy these properties. The answer is subjective, but figure 14.3 provides guidance.
L13756: The precise assignments are disputable, but most practitioners would agree that there is
L13757: no single model that satisfies all of these characteristics.
L13758: Draft: please send errata to udlbookmail@gmail.com.
L13761: <!-- page 286 -->
L13762: 272
L13763: 14
L13764: Unsupervised learning
L13765: Model
L13766: Eﬀicient
L13767: Sample
L13768: Coverage
L13769: Well-behaved
L13770: Disentangled
L13771: Eﬀicient
L13772: quality
L13773: latent space
L13774: latent space
L13775: likelihood
L13776: GANs
L13777: ✓
L13778: ✓
L13779: 
L13780: ✓
L13781: ?
L13782: n/a
L13783: VAEs
L13784: ✓
L13785: 
L13786: ?
L13787: ✓
L13788: ?
L13789: 
L13790: Flows
L13791: ✓
L13792: 
L13793: ?
L13794: ✓
L13795: ?
L13796: ✓
L13797: Diffusion
L13798: 
L13799: ✓
L13800: ?
L13801: 
L13802: 
L13803: 
L13804: Figure 14.3 Properties of four generative models. Neither generative adversarial
L13805: networks (GANs), variational autoencoders (VAEs), normalizing flows (Flows),
L13806: nor diffusion models (diffusion) have the full complement of desirable properties.
L13807: 14.3
L13808: Quantifying performance
L13809: The previous section discussed the desirable properties of generative models. We now
L13810: consider quantitative measures of success for generative models. Much experimentation
L13811: with generative models has used images due to the widespread availability of that data
L13812: and the ease of qualitatively judging the samples. Consequently, some of these metrics
L13813: only apply to images.
L13814: Test likelihood:
L13815: One way to compare probabilistic models is to measure their likelihood
L13816: for a test dataset. It is ineffective to measure the training data likelihood because a model
L13817: could assign a very high probability to each training point and very low probabilities in
L13818: between. This model would have a very high training likelihood but could only reproduce
L13819: the training data. The test likelihood captures how well the model generalizes from the
L13820: training data and also the coverage; if the model assigns a high probability to just a
L13821: subset of the training data, it must assign lower probabilities elsewhere, so a portion of
L13822: the test examples will have low probability.
L13823: Test likelihood is a sensible way to quantify probabilistic models, but unfortunately,
L13824: it is not relevant for generative adversarial models (which do not assign a probability)
L13825: and is expensive to estimate for variational autoencoders and diffusion models (although
L13826: it is possible to compute a lower bound on the log-likelihood). Normalizing flows are the
L13827: only type of model for which the likelihood can be computed exactly and eﬀiciently.
L13828: Inception score:
L13829: The inception score (IS) is specialized for images and ideally for gen-
L13830: erative models trained on the ImageNet database. The score is calculated using a pre-
L13831: trained classification model – usually the “Inception” model, from which the name is
L13832: derived. It is based on two criteria. First, each generated image x∗should look like one
L13833: and only one of the 1000 possible classes y in the ImageNet database. Hence, the prob-
L13834: ability distribution Pr(y|x∗
L13835: i ) should be highly peaked at the correct class. Second, the
L13836: entire set of generated images should be assigned to the classes with equal probability,
L13837: so Pr(y) should be flat when averaged over all generated examples.
L13838: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L13841: <!-- page 287 -->
L13842: 14.3
L13843: Quantifying performance
L13844: 273
L13845: Figure 14.4 Inception score.
L13846: a) A pretrained network classifies the generated
L13847: images.
L13848: If the images are realistic, the resulting class probabilities Pr(y|x∗
L13849: i )
L13850: should be peaked at the correct class. b) If the model generates all classes equally
L13851: frequently, the marginal (average) class probabilities should be flat. The inception
L13852: score measures the average distance between the distributions in (a) and the
L13853: distribution in (b). Images from Deng et al. (2009).
L13854: The inception score measures the average distance between these two distributions
L13855: over the generated set. This distance will be large if one is peaked and the other flat
L13856: (figure 14.4). More precisely, it returns the exponential of the expected KL-divergence
L13857: Appendix C.5.1
L13858: KL divergence
L13859: between Pr(y|x∗
L13860: i ) and Pr(y):
L13861: IS
L13862: =
L13863: exp
L13864: "
L13865: 1
L13866: I
L13867: I
L13868: X
L13869: i=1
L13870: DKL
L13871: h
L13872: Pr(y|x∗
L13873: i )||Pr(y)
L13874: i#
L13875: ,
L13876: (14.2)
L13877: where I is the number of generated examples and:
L13878: Pr(y) = 1
L13879: I
L13880: I
L13881: X
L13882: i=1
L13883: Pr(y|x∗
L13884: i ).
L13885: (14.3)
L13886: This metric is only sensible for generative models of the ImageNet database and
L13887: is sensitive to the particular classification model; retraining this model can give quite
L13888: different numerical results. Moreover, it does not reward diversity within an object class;
L13889: it returns a high value if the model only generates one realistic example of each class.
L13890: Fréchet inception distance:
L13891: This measure is also intended for images and computes a
L13892: symmetric distance between the distributions of generated samples and real examples.
L13893: This must be approximate since it is hard to characterize either distribution (indeed,
L13894: Draft: please send errata to udlbookmail@gmail.com.
L13897: <!-- page 288 -->
L13898: 274
L13899: 14
L13900: Unsupervised learning
L13901: characterizing the distribution of real examples is the job of generative models in the
L13902: first place). Hence, the Fréchet inception distance approximates both distributions by
L13903: Appendix C.5.4
L13904: Fréchet distance
L13905: multivariate Gaussians and (as the name suggests) estimates the distance between them
L13906: using the Fréchet distance.
L13907: However, it does not model the distance with respect to the original data but rather
L13908: the activations in the deepest layer of the inception classification network. These hidden
L13909: units are the ones most associated with object classes, so the comparison occurs at a
L13910: semantic level, ignoring the more fine-grained details of the images. This metric does
L13911: take account of diversity within classes but relies heavily on the information retained by
L13912: the features in the inception network; any information discarded by the network does
L13913: not contribute to the result. Some of this discarded information may still be important
L13914: to generate realistic samples.
L13915: Manifold precision/recall:
L13916: Fréchet inception distance is sensitive both to the realism
L13917: of the samples and their diversity but does not distinguish between these factors. To
L13918: disentangle these qualities, we consider the overlap between the data manifold (i.e., the
L13919: subset of the data space where the real examples lie) and the model manifold (i.e., where
L13920: the generated samples lie). The precision is the fraction of model samples that fall into
L13921: the data manifold. This measures the proportion of generated samples that are realistic.
L13922: The recall is the fraction of data examples that fall within the model manifold. This
L13923: measures the proportion of the real data the model can generate (figure 14.5).
L13924: To estimate the manifold, we place a hypersphere around each data example, whose
L13925: radius is the distance to the kth nearest neighbor. The union of these spheres is an
L13926: approximation of the manifold, and it’s easy to determine if a new point lies within it.
L13927: This manifold is also typically computed in the feature space of a classifier with the
L13928: advantages and disadvantages that entails.
L13929: 14.4
L13930: Summary
L13931: Unsupervised models learn about the structure of a dataset in the absence of labels. A
L13932: subset of these models is generative and can synthesize new data examples. A further
L13933: subset is probabilistic in that they can both generate new examples and assign a proba-
L13934: bility to observed data. The models considered in the following four chapters start with
L13935: a latent variable z which has a known distribution. A deep neural network then maps
L13936: from the latent variable to the observed data space. We considered desirable properties
L13937: of generative models and introduced metrics that attempt to quantify their performance.
L13938: Notes
L13939: Popular generative models include generative adversarial networks (Goodfellow et al., 2014),
L13940: variational autoencoders (Kingma & Welling, 2014), normalizing flows (Rezende & Mohamed,
L13941: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L13944: <!-- page 289 -->
L13945: Notes
L13946: 275
L13947: Figure 14.5 Manifold precision/recall. a) True distributions of real examples and
L13948: samples synthesized by the generative model. b) The overlap can be summarized
L13949: by the precision (the proportion of synthesized samples that overlap with the
L13950: distribution or manifold of real examples), and c) recall (the proportion of real
L13951: examples that overlap with the manifold of the synthesized samples). d) The
L13952: manifold of synthesized samples can be approximated by taking the union of a
L13953: set of hyperspheres centered on each sample. Here, these have constant radius, but
L13954: more commonly, the radius is based on the distance to the kth nearest neighbor.
L13955: e) The manifold for real examples is approximated similarly. f) The precision
L13956: can be computed as the proportion of samples that lie within the approximated
L13957: manifold of real examples. Similarly, the recall is computed as the proportion of
L13958: real examples that lie within the approximated manifold of samples (not shown).
L13959: Adapted from Kynkäänniemi et al. (2019).
L13960: 2015), diffusion models (Sohl-Dickstein et al., 2015; Ho et al., 2020), autoregressive models
L13961: (Bengio et al., 2000; Van den Oord et al., 2016b), and energy-based models (LeCun et al.,
L13962: 2006). All except energy models are discussed in this book. Bond-Taylor et al. (2022) provide
L13963: a recent survey of generative models.
L13964: Evaluation:
L13965: Salimans et al. (2016) introduced the inception score, and Heusel et al. (2017)
L13966: introduced the Fréchet inception distance, both of which are based on the Pool-3 layer of the
L13967: Inception V3 model (Szegedy et al., 2016). Nash et al. (2021) used earlier layers of the same
L13968: network that retain more spatial information to ensure that the spatial statistics of images are
L13969: also replicated. Kynkäänniemi et al. (2019) introduced the manifold precision/recall method.
L13970: Barratt & Sharma (2018) discuss the inception score in detail and point out its weaknesses.
L13971: Borji (2022) discusses the pros and cons of different methods for assessing generative models.
L13972: Draft: please send errata to udlbookmail@gmail.com.
L13975: <!-- page 290 -->
L13976: Chapter 15
L13977: Generative adversarial networks
L13978: A generative adversarial network or GAN is an unsupervised model that aims to generate
L13979: new samples that are indistinguishable from a set of training examples. GANs are just
L13980: mechanisms to create new samples; they do not build a probability distribution over the
L13981: modeled data and hence cannot evaluate the probability that a new data point belongs
L13982: to the same distribution.
L13983: In a GAN, the main generator network creates samples by mapping random noise to
L13984: the output data space. If a second discriminator network cannot distinguish between the
L13985: generated samples and the real examples, the samples must be plausible. If this network
L13986: can tell the difference, this provides a training signal that can be fed back to improve the
L13987: quality of the samples. This idea is simple, but training GANs is diﬀicult: the learning
L13988: algorithm can be unstable, and although GANs may learn to generate realistic samples,
L13989: this does not imply that they learn to generate all possible samples.
L13990: GANs have been applied to many types of data, including audio, 3D models, text,
L13991: video, and graphs. However, they have found the most success in the image domain,
L13992: where they can produce samples that are almost indistinguishable from real pictures.
L13993: Accordingly, the examples in this chapter focus on synthesizing images.
L13994: 15.1
L13995: Discrimination as a signal
L13996: We aim to generate new samples {x∗
L13997: j} that are drawn from the same distribution as a
L13998: set of real training data {xi}. A single new sample x∗
L13999: j is generated by (i) choosing a
L14000: latent variable zj from a simple base distribution (e.g., a standard normal) and then (ii)
L14001: passing this data through a network x∗
L14002: j = g[zj, θ] with parameters θ. This network is
L14003: known as the generator. During the learning process, the goal is to find parameters θ so
L14004: that the samples {x∗
L14005: j} look “similar” to the real data {xi} (see figure 14.2a).
L14006: Similarity can be defined in many ways, but the GAN uses the principle that the
L14007: samples should be statistically indistinguishable from the true data.
L14008: To this end, a
L14009: second network f[•, ϕ] with parameters ϕ called the discriminator is introduced. This
L14010: network aims to classify its input as being a real example or a generated sample. If this
L14011: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L14014: <!-- page 291 -->
L14015: 15.1
L14016: Discrimination as a signal
L14017: 277
L14018: Figure 15.1 GAN mechanism. a) Given a parameterized function (a generator)
L14019: that synthesizes samples (orange arrows) and a batch of real examples (cyan
L14020: arrows), we train a discriminator to distinguish the real examples from the gen-
L14021: erated samples (sigmoid curve indicates the estimated probability that the data
L14022: point is real). b) The generator is trained by modifying its parameters so that the
L14023: discriminator becomes less confident the samples were synthetic (in this case, by
L14024: moving the orange samples to the right). The discriminator is then updated. c)
L14025: Alternating updates to the generator and discriminator cause the generated sam-
L14026: ples to become indistinguishable from real examples and the impetus to change
L14027: the generator (i.e., the slope of the sigmoid function) to diminish.
L14028: proves impossible, the generated samples are indistinguishable from the real examples,
L14029: and we have succeeded. If it is possible, the discriminator provides a signal that can be
L14030: used to improve the generation process.
L14031: Figure 15.1 illustrates this scheme.
L14032: We start with a training set {xi} of real 1D
L14033: examples. A different batch of ten of these examples {xi}10
L14034: i=1 is shown in each panel
L14035: (cyan arrows). To create a batch of samples {x∗
L14036: j}, we use the simple generator:
L14037: x∗
L14038: j = g[zj, θ] = zj + θ,
L14039: (15.1)
L14040: where latent variables {zj} are drawn from a standard normal distribution, and the
L14041: parameter θ translates the generated samples along the x-axis (figure 15.1).
L14042: At initialization, θ = 3.0, and the generated samples (orange arrows) lie to the left of
L14043: the real examples (cyan arrows). The discriminator is trained to distinguish the generated
L14044: samples from the real examples (the sigmoid curve indicates the probability that a data
L14045: point is real). During training, the generator parameters θ are manipulated to increase
L14046: the probability that its samples are classified as real. Here, this means increasing θ so
L14047: that the samples move rightwards where the sigmoid curve is higher.
L14048: We alternate between updating the discriminator and the generator. Figures 15.1b–c
L14049: show two iterations of this process. It gradually becomes harder to classify the data,
L14050: Notebook 15.1
L14051: GAN toy example
L14052: so the impetus to change θ becomes weaker (i.e., the sigmoid becomes flatter). At the
L14053: end of the process, there is no way to distinguish the two sets of data; the discriminator,
L14054: which now has chance performance, is discarded, and we are left with a generator that
L14055: makes plausible samples.
L14056: Draft: please send errata to udlbookmail@gmail.com.
