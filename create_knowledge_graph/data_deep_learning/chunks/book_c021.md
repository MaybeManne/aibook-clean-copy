L12658: <!-- page 265 -->
L12659: 13.5
L12660: Example: graph classification
L12661: 251
L12662: embeddings into the D × N matrix Hk and post-multiply by the adjacency matrix A,
L12663: the nth column of the result is agg[n, k]. The update for the nodes is now:
L12664: Hk+1
L12665: =
L12666: a
L12667: 
L12668: βk1T + ΩkHk + ΩkHkA
L12669: 
L12670: =
L12671: a
L12672: 
L12673: βk1T + ΩkHk(A + I)
L12674: 
L12675: ,
L12676: (13.10)
L12677: where 1 is an N ×1 vector containing ones. Here, the nonlinear activation function a[•]
L12678: is applied independently to every member of its matrix argument.
L12679: This layer satisfies the design considerations: it is equivariant to permutations of the
L12680: Problem 13.7
L12681: node indices, can cope with any number of neighbors, exploits the graph structure to
L12682: provide a relational inductive bias, and shares parameters throughout the graph.
L12683: 13.5
L12684: Example: graph classification
L12685: We now combine these ideas to describe a network that classifies molecules as toxic or
L12686: harmless. The network inputs are the adjacency matrix and node embedding matrix X.
L12687: Notebook 13.2
L12688: Graph classification
L12689: The adjacency matrix A ∈RN×N derives from the molecular structure. The columns
L12690: of the node embedding matrix X ∈R118×N are one-hot vectors indicating which of the
L12691: 118 elements of the periodic table are present. In other words, they are vectors of length
L12692: 118 where every position is zero except for the position corresponding to the relevant
L12693: element, which is set to one. The node embeddings can be transformed to an arbitrary
L12694: size D by the first weight matrix Ω0 ∈RD×118.
L12695: The network equations are:
L12696: H1
L12697: =
L12698: a
L12699: 
L12700: β01T + Ω0X(A + I)
L12701: 
L12702: H2
L12703: =
L12704: a
L12705: 
L12706: β11T + Ω1H1(A + I)
L12707: 
L12708: ...
L12709: =
L12710: ...
L12711: HK
L12712: =
L12713: a
L12714: 
L12715: βK−11T + ΩK−1Hk−1(A + I)
L12716: 
L12717: f[X, A, Φ]
L12718: =
L12719: sig [βK + ωKHK1/N] ,
L12720: (13.11)
L12721: where the network output f[X, A, Φ] is a single value that determines the probability
L12722: that the molecule is toxic (see equation 13.2).
L12723: 13.5.1
L12724: Training with batches
L12725: Given I training graphs {Xi, Ai} and their labels yi, the parameters Φ = {βk, Ωk}K
L12726: k=0
L12727: can be learned using SGD and the binary cross-entropy loss (equation 5.19).
L12728: Fully
L12729: connected networks, convolutional networks, and transformers all exploit the parallelism
L12730: of modern hardware to process an entire batch of training examples concurrently. To this
L12731: end, the batch elements are concatenated into a higher-dimensional tensor (section 7.4.2).
L12732: Draft: please send errata to udlbookmail@gmail.com.
L12735: <!-- page 266 -->
L12736: 252
L12737: 13
L12738: Graph neural networks
L12739: Figure 13.8 Inductive vs. transductive problems. a) Node classification task in the
L12740: inductive setting. We are given a set of I training graphs, where the node labels
L12741: (orange and cyan colors) are known. After training, we are given a test graph
L12742: and must assign labels to each node. b) Node classification in the transductive
L12743: setting. There is one large graph in which some nodes have labels (orange and
L12744: cyan colors), and others are unknown. We train the model to predict the known
L12745: labels correctly and then examine the predictions at the unknown nodes.
L12746: However, each graph may have a different number of nodes. Hence, the matrices Xi
L12747: and Ai have different sizes, and there is no way to concatenate them into 3D tensors.
L12748: Luckily, a simple trick allows us to process the whole batch in parallel. The graphs
L12749: in the batch are treated as disjoint components of a single large graph. The network can
L12750: then be run as a single instance of the network equations. The mean pooling is carried
L12751: out only over the individual graphs to make a single representation per graph that can
L12752: be fed into the loss function.
L12753: 13.6
L12754: Inductive vs. transductive models
L12755: Until this point, all of the models in this book have been inductive: we exploit a training
L12756: set of labeled data to learn the relation between the inputs and outputs. Then we apply
L12757: this to new test data. One way to think of this is that we are learning the rule that maps
L12758: inputs to outputs and then applying it elsewhere.
L12759: By contrast, a transductive model considers both the labeled and unlabeled data
L12760: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L12763: <!-- page 267 -->
L12764: 13.7
L12765: Example: node classification
L12766: 253
L12767: at the same time. It does not produce a rule but merely a labeling for the unknown
L12768: outputs. This is sometimes termed semi-supervised learning. It has the advantage that
L12769: it can use patterns in the unlabeled data to help make its decisions. However, it has the
L12770: disadvantage that the model needs to be retrained when extra unlabeled data are added.
L12771: Both problem types are commonly encountered for graphs (figure 13.8). Sometimes,
L12772: we have many labeled graphs and learn a mapping between the graph and the labels.
L12773: For example, we might have many molecules, each labeled according to whether it is
L12774: toxic to humans. We learn the rule that maps the graph to the toxic/non-toxic label and
L12775: then apply this rule to new molecules. However, sometimes there is a single monolithic
L12776: graph. In the graph of scientific paper citations, we might have labels indicating the field
L12777: (physics, biology, etc.) for some nodes and wish to label the remaining nodes. Here, the
L12778: training and test data are irrevocably connected.
L12779: Graph-level tasks only occur in the inductive setting where there are training and test
L12780: graphs. However, node-level tasks and edge prediction tasks can occur in either setting.
L12781: In the transductive case, the loss function minimizes the mismatch between the model
L12782: output and the ground truth where this is known. New predictions are computed by
L12783: running the forward pass and retrieving the results where the ground truth is unknown.
L12784: 13.7
L12785: Example: node classification
L12786: As a second example, consider a binary node classification task in a transductive setting.
L12787: We start with a commercial-sized graph with millions of nodes. Some nodes have ground
L12788: truth binary labels, and the goal is to label the remaining unlabeled nodes. The body
L12789: of the network will be the same as in the previous example (equation 13.11) but with a
L12790: different final layer that produces an output vector of size 1 × N:
L12791: f[X, A, Φ] = sig
L12792: 
L12793: βK1T + ωKHK
L12794: 
L12795: ,
L12796: (13.12)
L12797: where the function sig[•] applies the sigmoid function independently to every element
L12798: of the row vector input. As usual, we use the binary cross-entropy loss, but now only
L12799: at nodes where we know the ground truth label y. Note that equation 13.12 is just a
L12800: vectorized version of the node classification loss from equation 13.3.
L12801: Training this network raises two problems. First, it is logistically diﬀicult to train a
L12802: graph neural network of this size. Consider that we must store the node embeddings at
L12803: every network layer in the forward pass. This will involve both storing and processing
L12804: a structure several times the size of the entire graph, and this may not be practical.
L12805: Second, we have only a single graph, so it’s not obvious how to perform stochastic
L12806: gradient descent. How can we form a batch if there is only a single object?
L12807: 13.7.1
L12808: Choosing batches
L12809: One way to form a batch is to choose a random subset of labeled nodes at each training
L12810: step. Each node depends on its neighbors in the previous layer. These, in turn, depend
L12811: Draft: please send errata to udlbookmail@gmail.com.
L12814: <!-- page 268 -->
L12815: 254
L12816: 13
L12817: Graph neural networks
L12818: Figure 13.9 Receptive fields in graph neural networks. Consider the orange node
L12819: in hidden layer two (right).
L12820: This receives input from the nodes in the 1-hop
L12821: neighborhood in hidden layer one (shaded region in center).
L12822: These nodes in
L12823: hidden layer one receive inputs from their neighbors in turn, and the orange node
L12824: in layer two receives inputs from all the input nodes in the 2-hop neighborhood
L12825: (shaded area on left). The region of the graph that contributes to a given node
L12826: is equivalent to the notion of a receptive field in convolutional neural networks.
L12827: on their neighbors in the layer before, so (similarly to convolutional networks) each
L12828: node has a receptive field (figure 13.9). The receptive field region is termed the k-hop
L12829: neighborhood. We can hence perform a gradient descent step using the graph that forms
L12830: the union of the k-hop neighborhoods of the batch nodes; the remaining inputs do not
L12831: contribute.
L12832: Unfortunately, if there are many layers and the graph is densely connected, every
L12833: input node may be in the receptive field of every output, and this may not reduce the
L12834: graph size at all. This is known as the graph expansion problem. Two approaches that
L12835: tackle this problem are neighborhood sampling and graph partitioning.
L12836: Neighborhood sampling:
L12837: The full graph that feeds into the batch of nodes is sampled,
L12838: thereby reducing the connections at each network layer (figure 13.10). For example, we
L12839: might start with the batch nodes and randomly sample a fixed number of their neighbors
L12840: Notebook 13.3
L12841: Neighborhood
L12842: sampling
L12843: in the previous layer. Then, we randomly sample a fixed number of their neighbors in
L12844: the layer before, and so on.
L12845: The graph still increases in size with each layer but in
L12846: a much more controlled way.
L12847: This is done anew for each batch, so the contributing
L12848: neighbors differ even if the same batch is drawn twice.
L12849: This is also reminiscent of
L12850: dropout (section 9.3.3) and adds some regularization.
L12851: Graph partitioning:
L12852: A second approach is to cluster the original graph into disjoint
L12853: subsets of nodes (i.e., smaller graphs that are not connected to one another) before
L12854: processing (figure 13.11).
L12855: There are standard algorithms to choose these subsets to
L12856: maximize the number of internal links. These smaller graphs can each be treated as
L12857: batches, or a random subset of them can be combined to form a batch (reinstating any
L12858: edges between them from the original graph).
L12859: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L12862: <!-- page 269 -->
L12863: 13.7
L12864: Example: node classification
L12865: 255
L12866: Figure 13.10 Neighborhood sampling. a) One way of forming batches on large
L12867: graphs is to choose a subset of labeled nodes in the output layer (here, just one
L12868: node in layer two, right) and then working back to find all of the nodes in the K-
L12869: hop neighborhood (receptive field). Only this sub-graph is needed to train this
L12870: batch. Unfortunately, if the graph is densely connected, this may retain a large
L12871: proportion of the graph. b) One solution is neighborhood sampling. As we work
L12872: back from the final layer, we select a subset of neighbors (here, three) in the
L12873: layer before and a subset of the neighbors of these in the layer before that. This
L12874: restricts the size of the graph for training the batch. In all panels, the brightness
L12875: represents the distance from the original node.
L12876: Draft: please send errata to udlbookmail@gmail.com.
L12879: <!-- page 270 -->
L12880: 256
L12881: 13
L12882: Graph neural networks
L12883: Figure 13.11 Graph partitioning. a) Input graph. b) The input graph is parti-
L12884: tioned into smaller subgraphs using a principled method that removes the fewest
L12885: edges. c-d) We can now use these subgraphs as batches to train in a transductive
L12886: setting, so here, there are four possible batches.
L12887: e) Alternatively, we can use
L12888: combinations of the subgraphs as batches, reinstating the edges between them.
L12889: If we use pairs of subgraphs, there would be six possible batches here.
L12890: Given one of the above methods to form batches, we can now train the network
L12891: parameters in the same way as for the inductive setting, dividing the labeled nodes into
L12892: train, test, and validation sets as desired; we have effectively converted a transductive
L12893: problem to an inductive one.
L12894: To perform inference, we compute predictions for the
L12895: unknown nodes based on their k-hop neighborhood. Unlike training, this does not require
L12896: storing the intermediate representations, so it is much more memory eﬀicient.
L12897: 13.8
L12898: Layers for graph convolutional networks
L12899: In the previous examples, we combined messages from adjacent nodes by summing them
L12900: together with the transformed current node. This was accomplished by post-multiplying
L12901: the node embedding matrix H by the adjacency matrix plus the identity A + I. We now
L12902: consider different approaches to both (i) the combination of the current embedding with
L12903: the aggregated neighbors and (ii) the aggregation process itself.
L12904: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L12907: <!-- page 271 -->
L12908: 13.8
L12909: Layers for graph convolutional networks
L12910: 257
L12911: 13.8.1
L12912: Combining current node and aggregated neighbors
L12913: In the example GCN layer above, we combined the aggregated neighbors HA with the
L12914: current nodes H by just summing them:
L12915: Hk+1 = a
L12916: h
L12917: βk1T + ΩkHk(A + I)
L12918: i
L12919: .
L12920: (13.13)
L12921: In another variation, the current node is multiplied by a factor of (1 + ϵk) before con-
L12922: tributing to the sum, where ϵk is a learned scalar that is different for each layer:
L12923: Hk+1 = a
L12924: h
L12925: βk1T + ΩkHk(A + (1 + ϵk)I)
L12926: i
L12927: .
L12928: (13.14)
L12929: This is known as diagonal enhancement. A related variation applies a different linear
L12930: transform Ψk to the current node:
L12931: Hk+1
L12932: =
L12933: a
L12934: 
L12935: βk1T + ΩkHkA + ΨkHk
L12936: 
L12937: =
L12938: a
L12939: 
L12940: βk1T +
L12941: Ωk
L12942: Ψk
L12943:  HkA
L12944: Hk
L12945: 
L12946: =
L12947: a
L12948: 
L12949: βk1T + Ω′
L12950: k
L12951: HkA
L12952: Hk
L12953: 
L12954: ,
L12955: (13.15)
L12956: where we have defined Ω′
L12957: k =
L12958: Ωk
L12959: Ψk
L12960: 
L12961: in the third line.
L12962: 13.8.2
L12963: Residual connections
L12964: With residual connections, the aggregated representation from the neighbors is trans-
L12965: formed and passed through the activation function before summation or concatenation
L12966: with the current node. For the latter case, the associated network equations are:
L12967: Hk+1 =
L12968: 
L12969: a
L12970: 
L12971: βk1T + ΩkHkA
L12972: 
L12973: Hk
L12974: 
L12975: .
L12976: (13.16)
L12977: 13.8.3
L12978: Mean aggregation
L12979: The above methods aggregate the neighbors by summing the node embeddings. However,
L12980: it’s possible to combine the embeddings in different ways. Sometimes it’s better to take
L12981: the average of the neighbors rather than the sum; this can be superior if the embedding
L12982: information is more important and the structural information less so since the magnitude
L12983: of the neighborhood contributions will not depend on the number of neighbors:
L12984: agg[n] =
L12985: 1
L12986: |ne[n]|
L12987: X
L12988: m∈ne[n]
L12989: hm,
L12990: (13.17)
L12991: Draft: please send errata to udlbookmail@gmail.com.
L12994: <!-- page 272 -->
L12995: 258
L12996: 13
L12997: Graph neural networks
L12998: where as before, ne[n] denotes a set containing the indices of the neighbors of the nth
L12999: node. Equation 13.17 can be computed neatly in matrix form by introducing the diago-
L13000: nal N × N degree matrix D. Each non-zero element of this matrix contains the number
L13001: of neighbors for the associated node. It follows that each diagonal element in the inverse
L13002: Problem 13.8
L13003: matrix D−1 contains the denominator that we need to compute the average. The new
L13004: GCN layer can be written as:
L13005: Hk+1 = a
L13006: h
L13007: βk1T + ΩkHk(AD−1 + I)
L13008: i
L13009: .
L13010: (13.18)
L13011: 13.8.4
L13012: Kipf normalization
L13013: There are many variations of graph neural networks based on mean aggregation. Some-
L13014: times the current node is included with its neighbors in the mean computation rather
L13015: than treated separately. In Kipf normalization, the sum of the node representations is
L13016: Problem 13.9
L13017: normalized as:
L13018: agg[n] =
L13019: X
L13020: m∈ne[n]
L13021: hm
L13022: p
L13023: |ne[n]||ne[m]|
L13024: ,
L13025: (13.19)
L13026: with the logic that information coming from nodes with a very large number of neighbors
L13027: should be down-weighted since there are many connections and they provide less unique
L13028: information. This can also be expressed in matrix form using the degree matrix:
L13029: Hk+1 = a
L13030: h
L13031: βk1T + ΩkHk(D−1/2AD−1/2 + I)
L13032: i
L13033: .
L13034: (13.20)
L13035: 13.8.5
L13036: Max pooling aggregation
L13037: An alternative operation that is also invariant to permutation is computing the maximum
L13038: of a set of objects. The max pooling aggregation operator is:
L13039: agg[n] =
L13040: max
L13041: m∈ne[n]
L13042: 
L13043: hm
L13044: 
L13045: ,
L13046: (13.21)
L13047: where the operator max[•] returns the element-wise maximum of the vectors hm that
L13048: are neighbors to the current node n.
L13049: 13.8.6
L13050: Aggregation by attention
L13051: The aggregation methods discussed so far either weight the contribution of the neighbors
L13052: equally or in a way that depends on the graph topology. Conversely, in graph attention
L13053: layers, the weights depend on the data at the nodes. A linear transform is applied to
L13054: the current node embeddings so that:
L13055: H′
L13056: k = βk1T + ΩkHk.
L13057: (13.22)
L13058: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L13061: <!-- page 273 -->
L13062: 13.8
L13063: Layers for graph convolutional networks
L13064: 259
L13065: Figure 13.12 Comparison of graph convolutional network, dot product attention,
L13066: and graph attention network. In each case, the mechanism maps N embeddings
L13067: of size D stored in a D × N matrix X to an output of the same size. a) The
L13068: graph convolutional network applies a linear transformation X′ = ΩX to the
L13069: data matrix. It then computes a weighted sum of the transformed data, where
L13070: the weighting is based on the adjacency matrix. A bias β is added, and the result
L13071: is passed through an activation function. b) The outputs of the dot-product self-
L13072: attention mechanism in the transformer are also weighted sums of the transformed
L13073: inputs, but this time the weights depend on the data itself via the attention
L13074: matrix. c) The graph attention network combines both of these mechanisms; the
L13075: weights are both computed from the data and based on the adjacency matrix.
L13076: Draft: please send errata to udlbookmail@gmail.com.
L13079: <!-- page 274 -->
L13080: 260
L13081: 13
L13082: Graph neural networks
L13083: Then the similarity smn of each transformed node embedding h′
L13084: m to the transformed
L13085: node embedding h′
L13086: n is computed by concatenating the pairs, taking a dot product with
L13087: a column vector ϕk of learned parameters, and applying an activation function:
L13088: smn = a
L13089: 
L13090: ϕT
L13091: k
L13092: h′
L13093: m
L13094: h′
L13095: n
L13096: 
L13097: .
L13098: (13.23)
L13099: These variables are stored in an N × N matrix S, where each element represents the
L13100: similarity of every node to every other. As in dot-product self-attention, the attention
L13101: weights contributing to each output embedding are normalized to be positive and sum
L13102: to one using the softmax operation. However, only those values corresponding to the
L13103: current node and its neighbors should contribute. The attention weights are applied to
L13104: the transformed embeddings:
L13105: Hk+1 = a
L13106: h
L13107: H′
L13108: k · Softmask[S, A + I]
L13109: i
L13110: ,
L13111: (13.24)
L13112: where a[•] is a second activation function. The function Softmask[•, •] computes the
L13113: attention values by applying softmax operation separately to each column of its first
L13114: argument S, but only after setting values where the second argument A + I is zero to
L13115: negative infinity, so they do not contribute. This ensures that the attention to non-
L13116: neighboring nodes is zero.
L13117: This is very similar to the dot-product self-attention computation in transformers
L13118: Notebook 13.4
L13119: Graph
L13120: attention
L13121: (see figure 13.12), except that (i) The keys, queries, and values are all the same, (ii) The
L13122: measure of similarity is different, and (iii) The attentions are masked so that each node
L13123: Problem 13.10
L13124: only attends to itself and its neighbors. As in transformers, this system can be extended
L13125: to use multiple heads that are run in parallel and recombined.
L13126: 13.9
L13127: Edge graphs
L13128: Until now, we have focused on processing node embeddings. These evolve as they are
L13129: passed through the network so that by the end of the network, they represent both the
L13130: node and its context in the graph. We now consider the case where the information is
L13131: associated with the edges of the graph.
L13132: It is easy to adapt the machinery for node embeddings to process edge embeddings
L13133: using the edge graph (also known as the adjoint graph or line graph). This is a com-
L13134: plementary graph, in which each edge in the original graph becomes a node, and every
L13135: two edges with a common node in the original graph create an edge in the new graph
L13136: (figure 13.13). In general, a graph can be recovered from its edge graph, so it’s possible
L13137: to swap between these two representations.
L13138: Problems 13.11–13.13
L13139: To process edge embeddings, the graph is translated to its edge graph. Then we
L13140: use exactly the same techniques, aggregating information at each new node from its
L13141: neighbors and combining this with the current representation. When both node and
L13142: edge embeddings are present, we can translate back and forth between the two graphs.
L13143: Now there are four possible updates (nodes update nodes, nodes update edges, edges
L13144: update nodes, and edges update edges), and these can be alternated as desired, or with
L13145: Problem 13.14
L13146: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L13149: <!-- page 275 -->
L13150: 13.10
L13151: Summary
L13152: 261
L13153: Figure 13.13 Edge graph. a) Graph with six nodes. b) To create the edge graph,
L13154: we assign one node for each original edge (cyan circles), and c) connect the new
L13155: nodes if the edges they represent connect to the same node in the original graph.
L13156: minor modifications, nodes can be updated simultaneously from both nodes and edges.
L13157: 13.10
L13158: Summary
L13159: Graphs consist of a set of nodes, where pairs of these nodes are connected by edges. Both
L13160: nodes and edges can have data attached, and these are referred to as node embeddings
L13161: and edge embeddings, respectively. Many real-world problems can be framed in terms of
L13162: graphs, where the goal is to establish a property of the entire graph, properties of each
L13163: node or edge, or the presence of additional edges in the graph.
L13164: Graph neural networks are deep learning models that are applied to graphs. Since the
L13165: node order in graphs is arbitrary, the layers of graph neural networks must be equivariant
L13166: to permutations of the node indices. Spatial-based convolutional networks are a family
L13167: of graph neural networks that aggregate information from the neighbors of a node and
L13168: then use this to update the node embeddings.
L13169: One challenge of processing graphs is that they often occur in the transductive setting,
L13170: where there is only one partially labeled graph rather than sets of training and test
L13171: graphs. This graph can be extremely large, which adds further challenges in terms of
L13172: training and has led to sampling and partitioning algorithms. The edge graph has a
L13173: node for every edge in the original graph. By converting to this representation, graph
L13174: neural networks can be used to update the edge embeddings.
L13175: Draft: please send errata to udlbookmail@gmail.com.
L13178: <!-- page 276 -->
L13179: 262
L13180: 13
L13181: Graph neural networks
L13182: Notes
L13183: Sanchez-Lengeling et al. (2021) and Daigavane et al. (2021) present good introductory articles
L13184: on graph processing using neural networks. Recent surveys of research in graph neural networks
L13185: can be found in articles by Zhou et al. (2020a), Wu et al. (2020c), and Veličković (2023), and
L13186: the books of Hamilton (2020) and Ma & Tang (2021). GraphEDM (Chami et al., 2020) unifies
L13187: many existing graph algorithms into a single framework. In this chapter, we have related graphs
L13188: to convolutional networks following Bruna et al. (2013), but there are also strong connections
L13189: with belief propagation (Dai et al., 2016) and graph isomorphism tests (Hamilton et al., 2017a).
L13190: Zhang et al. (2019c) provide a review focusing specifically on graph convolutional networks.
L13191: Bronstein et al. (2021) provide a general overview of geometric deep learning, including learning
L13192: on graphs. Loukas (2020) discusses what types of functions graph neural networks can learn.
L13193: Applications:
L13194: Applications include graph classification (e.g., Zhang et al., 2018b), node clas-
L13195: sification (e.g., Kipf & Welling, 2017), edge prediction (e.g., Zhang & Chen, 2018), graph clus-
L13196: tering (e.g., Tsitsulin et al., 2020), and recommender systems (e.g., Wu et al., 2023). Methods
L13197: for node classification are reviewed by Xiao et al. (2022a), methods for graph classification by
L13198: Errica et al. (2019), and methods for edge prediction by Mutlu et al. (2020) and Kumar et al.
L13199: (2020a).
L13200: Graph neural networks:
L13201: Graph neural networks were introduced by Gori et al. (2005) and
L13202: Scarselli et al. (2008), who formulated them as a generalization of recursive neural networks.
L13203: The latter model used the iterative update:
L13204: hn ←f
L13205: 
L13206: xn, xm∈ne[n], ee∈nee[n], hm∈ne[n], ϕ
L13207: 
L13208: ,
L13209: (13.25)
L13210: in which each node embedding hn is updated from the initial embedding xn, initial embed-
L13211: dings xm∈ne[n] at the adjacent nodes, initial embeddings ee∈nee[n] at the adjacent edges, and
L13212: adjacent node embeddings hm∈ne[n].
L13213: For convergence, the function f[•, •, •, •, ϕ] must be a
L13214: contraction mapping (see figure 16.9). If we unroll this equation in time for K steps and allow
L13215: different parameters ϕk at each time K, then equation 13.25 becomes similar to the graph con-
L13216: volutional network. Subsequent work extended graph neural networks to use gated recurrent
L13217: units (Li et al., 2016b) and long short-term memory networks (Selsam et al., 2019).
L13218: Spectral methods:
L13219: Bruna et al. (2013) applied the convolution operation in the Fourier
L13220: domain. The Fourier basis vectors can be found by taking the eigendecomposition of the graph
L13221: Laplacian matrix, L = D −A where D is the degree matrix and A is the adjacency matrix.
L13222: This has disadvantages: the filters are not localized, and the decomposition is prohibitively
L13223: expensive for large graphs. Henaff et al. (2015) tackled the first problem by forcing the Fourier
L13224: representation to be smooth (and hence the spatial domain to be localized). Defferrard et al.
L13225: (2016) introduced ChebNet, which approximates the filters eﬀiciently by using the recursive
L13226: properties of Chebyshev polynomials. This both provides spatially localized filters and reduces
L13227: the computation. Kipf & Welling (2017) simplified this further to construct filters that use only
L13228: a 1-hop neighborhood, resulting in a formulation similar to the spatial methods described in
L13229: this chapter and providing a bridge between spectral and spatial methods.
L13230: Spatial methods:
L13231: Spectral methods are ultimately based on the Graph Laplacian, so if the
L13232: graph changes, the model must be retrained. This problem spurred the development of spatial
L13233: methods. Duvenaud et al. (2015) defined convolutions in the spatial domain, using a different
L13234: weight matrix to combine the adjacent embeddings for each node degree. This has the disad-
L13235: vantage that it becomes impractical if some nodes have a very large number of connections.
L13236: Diffusion convolutional neural networks (Atwood & Towsley, 2016) use powers of the normal-
L13237: ized adjacency matrix to blend features across different scales, sum these, pointwise multiply by
L13238: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
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
