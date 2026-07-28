L12018: <!-- page 251 -->
L12019: Notes
L12020: 237
L12021: Extending transformers to longer sequences:
L12022: The complexity of the self-attention mech-
L12023: anism increases quadratically with the sequence length.
L12024: Some tasks like summarization or
L12025: question answering may require long inputs, so this quadratic dependence limits performance.
L12026: Three lines of work have attempted to address this problem. The first decreases the size of the
L12027: attention matrix, the second makes the attention sparse, and the third modifies the attention
L12028: mechanism to make it more eﬀicient.
L12029: To decrease the size of the attention matrix, Liu et al. (2018b) introduced memory-compressed
L12030: attention. This applies strided convolution to the keys and values, which reduces the number
L12031: of positions in a very similar way to downsampling in a convolutional network. Attention is
L12032: now applied between weighted combinations of neighboring positions, where the weights are
L12033: learned. Along similar lines, Wang et al. (2020b) observed that the quantities in the attention
L12034: mechanism are often low rank in practice and developed the LinFormer, which projects the keys
L12035: and values onto a smaller subspace before computing the attention matrix.
L12036: To make attention sparse, Liu et al. (2018b) proposed local attention, in which neighboring
L12037: blocks of tokens only attend to one another. This creates a block diagonal interaction matrix (see
L12038: figure 12.15). Information cannot pass from block to block, so such layers are typically alternated
L12039: with full attention.
L12040: Along the same lines, GPT3 (Brown et al., 2020) uses a convolutional
L12041: interaction matrix and alternates this with full attention. Child et al. (2019) and Beltagy et al.
L12042: (2020) experimented with various interaction matrices, including convolutional structures with
L12043: different dilation rates but allowing some queries to interact with every other key.
L12044: Ainslie
L12045: et al. (2020) introduced the extended transformer construction (figure 12.15h), which uses a
L12046: set of global embeddings that interact with every other token. This can only be done in the
L12047: encoder version, or these implicitly allow the system to “look ahead.” When combined with
L12048: relative position encoding, this scheme requires special encodings for mapping to, from, and
L12049: between these global embeddings. BigBird (Ainslie et al., 2020) combined global embeddings
L12050: and a convolutional structure with a random sampling of possible connections. Other work
L12051: has investigated learning the sparsity pattern of the attention matrix (Roy et al., 2021; Kitaev
L12052: et al., 2020; Tay et al., 2020).
L12053: Finally, it has been noted that the terms in the numerator and denominator of the softmax oper-
L12054: ation that computes attention have the form exp[kT q]. This can be treated as a kernel function
L12055: and, as such, can be expressed as the dot product g[k]T g[q] where g[•] is a nonlinear transforma-
L12056: Problem 12.10
L12057: tion. This formulation decouples the queries and keys, making the attention computation more
L12058: eﬀicient. Unfortunately, to replicate the form of the exponential terms, the transformation g[•]
L12059: must map the inputs to the infinite space. The linear transformer (Katharopoulos et al., 2020)
L12060: recognizes this and replaces the exponential term with a different similarity measure. The Per-
L12061: former (Choromanski et al., 2020) approximates this infinite mapping with a finite-dimensional
L12062: one.
L12063: More details about extending transformers to longer sequences can be found in Tay et al.
L12064: (2023) and Prince (2021a).
L12065: Training transformers:
L12066: Training transformers is challenging and requires both learning rate
L12067: warm-up (Goyal et al., 2018) and Adam (Kingma & Ba, 2015). Indeed Xiong et al. (2020a) and
L12068: Huang et al. (2020a) show that the gradients vanish, and the Adam updates decrease in magni-
L12069: tude without learning rate warm-up. Several interacting factors cause this problem. Residual
L12070: connections cause the exploding gradients (figure 11.6), but normalization layers prevent this.
L12071: Vaswani et al. (2017) used LayerNorm rather than BatchNorm because NLP statistics are highly
L12072: variable between batches, although subsequent work has modified BatchNorm for transformers
L12073: (Shen et al., 2020a). The positioning of the LayerNorm outside of the residual block causes
L12074: gradients to shrink as they pass back through the network (Xiong et al., 2020a). In addition,
L12075: the relative weight of the residual connections and main self-attention mechanism varies as we
L12076: move through the network upon initialization (see figure 11.6c). There is the additional com-
L12077: plication that the gradients for the query and key parameters are smaller than for the value
L12078: parameters (Liu et al., 2020), which necessitates the use of Adam. These factors interact in a
L12079: complex way, making training unstable and necessitating learning rate warm-up.
L12080: Draft: please send errata to udlbookmail@gmail.com.
L12083: <!-- page 252 -->
L12084: 238
L12085: 12
L12086: Transformers
L12087: There have been various attempts to stabilize training, including (i) a variation of FixUp called
L12088: TFixup (Huang et al., 2020a) that allows the LayerNorm components to be removed, (ii) chang-
L12089: ing the position of the LayerNorm components in the network (Liu et al., 2020), and (iii)
L12090: re-weighting the two paths in the residual branches (Liu et al., 2020; Bachlechner et al., 2021).
L12091: Xu et al. (2021b) introduced an initialization scheme called DTFixup that allows transformers
L12092: to be trained with smaller datasets. A detailed discussion can be found in Prince (2021b).
L12093: Applications in vision:
L12094: ImageGPT (Chen et al., 2020a) and the Vision Transformer (Doso-
L12095: vitskiy et al., 2021) were both early transformer architectures applied to images. Transformers
L12096: have been used for image classification (Dosovitskiy et al., 2021; Touvron et al., 2021), object
L12097: detection (Carion et al., 2020; Zhu et al., 2020b; Fang et al., 2021), semantic segmentation (Ye
L12098: et al., 2019; Xie et al., 2021; Gu et al., 2022), super-resolution (Yang et al., 2020a), action
L12099: recognition (Sun et al., 2019; Girdhar et al., 2019), image generation (Chen et al., 2021b; Nash
L12100: et al., 2021), visual question answering (Su et al., 2019b; Tan & Bansal, 2019), inpainting (Wan
L12101: et al., 2021; Zheng et al., 2021; Zhao et al., 2020b; Li et al., 2022), colorization (Kumar et al.,
L12102: 2021), and many other vision tasks (Khan et al., 2022; Liu et al., 2023b).
L12103: Transformers and convolutional networks:
L12104: Transformers have been combined with con-
L12105: volutional neural networks for many tasks, including image classification (Wu et al., 2020a),
L12106: object detection (Hu et al., 2018a; Carion et al., 2020), video processing (Wang et al., 2018c;
L12107: Sun et al., 2019), unsupervised object discovery (Locatello et al., 2020) and various text/vision
L12108: tasks (Chen et al., 2020d; Lu et al., 2019; Li et al., 2019). Transformers can outperform convolu-
L12109: tional networks for vision tasks but usually require large quantities of data to achieve superior
L12110: performance. Often, they are pre-trained on enormous datasets like JRT (Sun et al., 2017)
L12111: and LAION (Schuhmann et al., 2021).
L12112: The transformer doesn’t have the inductive bias of
L12113: convolutional networks, but by using huge amounts of data, it can surmount this disadvantage.
L12114: From pixels to video:
L12115: Non-local networks (Wang et al., 2018c) were an early application of
L12116: self-attention to image data. Transformers were initially applied to pixels in local neighborhoods
L12117: (Parmar et al., 2018; Hu et al., 2019; Parmar et al., 2019; Zhao et al., 2020a). ImageGPT (Chen
L12118: et al., 2020a) scaled this to model all pixels in a small image. The Vision Transformer (ViT)
L12119: (Dosovitskiy et al., 2021) used non-overlapping patches to analyze bigger images.
L12120: Since then, many multi-scale systems have been developed, including the SWin transformer
L12121: (Liu et al., 2021c), SWinV2 (Liu et al., 2022), multi-scale transformers (MViT) (Fan et al.,
L12122: 2021), and pyramid vision transformers (Wang et al., 2021). The Crossformer (Wang et al.,
L12123: 2022b) models interactions between spatial scales. Ali et al. (2021) introduced cross-covariance
L12124: image transformers, in which the channels rather than spatial positions attend to one another,
L12125: hence making the size of the attention matrix indifferent to the image size. The dual attention
L12126: vision transformer (DaViT) was developed by Ding et al. (2022) and alternates between local
L12127: spatial attention within sub-windows and spatially global attention between channels. Chu et al.
L12128: (2021) similarly alternate between local attention within sub-windows and global attention by
L12129: subsampling the spatial domain. Dong et al. (2022) adapt the ideas of figure 12.15, in which
L12130: the interactions between elements are sparsified to the 2D image domain.
L12131: Transformers were subsequently adapted to video processing (Arnab et al., 2021; Bertasius et al.,
L12132: 2021; Liu et al., 2021c; Neimark et al., 2021; Patrick et al., 2021). A survey of transformers
L12133: applied to video can be found in Selva et al. (2022).
L12134: Combining images and text:
L12135: CLIP (Radford et al., 2021) learns a joint encoder for images
L12136: and their captions using a contrastive pre-training task.
L12137: The system ingests N images and
L12138: their captions and produces a matrix of compatibility between images and captions. The loss
L12139: function encourages the correct pairs to have a high score and the incorrect pairs to have a low
L12140: score. Ramesh et al. (2021) and Ramesh et al. (2022) train a diffusion decoder to invert the
L12141: CLIP image encoder for text-conditional image generation (see chapter 18).
L12142: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L12145: <!-- page 253 -->
L12146: Notes
L12147: 239
L12148: Problems
L12149: Problem 12.1 Consider a self-attention mechanism that processes N inputs of length D to
L12150: produce N outputs of the same size. How many weights and biases are used to compute the
L12151: queries, keys, and values? Assume that all three quantities are also of length D. How many
L12152: attention weights a[•, •] will there be? How many weights and biases would there be in a fully
L12153: connected shallow network relating all DN inputs to all DN outputs?
L12154: Problem 12.2 Why might we want to ensure that the input to the self-attention mechanism is
L12155: the same size as the output?
L12156: Problem 12.3∗
L12157: Show that the self-attention mechanism (equation 12.8) is equivariant to a
L12158: permutation XP of the data X, where P is a permutation matrix. In other words, show that:
L12159: Appendix B.4.4
L12160: Permutation
L12161: matrix
L12162: Sa[XP] = Sa[X]P.
L12163: (12.18)
L12164: Problem 12.4 Consider the softmax operation:
L12165: yi = softmaxi[z] =
L12166: exp[zi]
L12167: P5
L12168: j=1 exp[zj]
L12169: ,
L12170: (12.19)
L12171: in the case where there are five inputs with values: z1 = −3, z2 = 1, z3 = 100, z4 = 5, z5 = −1.
L12172: Compute the 25 derivatives, ∂yi/∂zj for all i, j ∈{1, 2, 3, 4, 5}. What do you conclude?
L12173: Problem 12.5 Why is implementation more eﬀicient if the values, queries, and keys in each of
L12174: the H heads each have dimension D/H where D is the original dimension of the data?
L12175: Problem 12.6 BERT was pre-trained using two tasks. The first task requires the system to pre-
L12176: dict missing (masked) words. The second task requires the system to classify pairs of sentences
L12177: as being adjacent or not in the original text. Identify whether each of these tasks is generative
L12178: or contrastive (see section 9.3.7). Why do you think they used two tasks? Propose two novel
L12179: contrastive tasks that could be used to pre-train a language model.
L12180: Problem 12.7 Consider adding a new token to a precomputed masked self-attention mechanism
L12181: with N tokens. Describe the extra computation that must be done to incorporate this new
L12182: token.
L12183: Problem 12.8 Computation in vision transformers expands quadratically with the number of
L12184: patches. Devise two methods to reduce the computation using the principles from figure 12.15.
L12185: Problem 12.9 Consider representing an image with a grid of 16 × 16 patches, each represented
L12186: by a patch embedding of length 512.
L12187: Compare the amount of computation required in the
L12188: DaViT transformer to perform attention (i) between the patches, using all of the channels, and
L12189: (ii) between the channels, using all of the patches.
L12190: Problem 12.10∗Attention weights are usually computed as:
L12191: a[xm, xn] = softmaxm
L12192: h
L12193: kT
L12194: • qn
L12195: i
L12196: =
L12197: exp
L12198: 
L12199: kT
L12200: mqn
L12201: 
L12202: PN
L12203: m′=1 exp
L12204: 
L12205: kT
L12206: m′qn
L12207: .
L12208: (12.20)
L12209: Consider replacing exp
L12210: 
L12211: kT
L12212: mqn
L12213: 
L12214: with the dot product g[km]T g[qn] where g[•] is a nonlinear
L12215: transformation. Show how this makes the computation of the attention weights more eﬀicient.
L12216: Draft: please send errata to udlbookmail@gmail.com.
L12219: <!-- page 254 -->
L12220: Chapter 13
L12221: Graph neural networks
L12222: Chapter 10 described convolutional networks, which specialize in processing regular ar-
L12223: rays of data (e.g., images). Chapter 12 described transformers, which specialize in pro-
L12224: cessing sequences of variable length (e.g., text). This chapter describes graph neural
L12225: networks. As the name suggests, these are neural architectures that process graphs (i.e.,
L12226: sets of nodes connected by edges).
L12227: There are three novel challenges associated with processing graphs. First, their topol-
L12228: ogy is variable, and it is hard to design networks that are both suﬀiciently expressive and
L12229: can cope with this variation. Second, graphs may be enormous; a graph representing
L12230: connections between users of a social network might have a billion nodes. Third, there
L12231: may only be a single monolithic graph available, so the usual protocol of training with
L12232: many data examples and testing with new data is not always appropriate.
L12233: This chapter starts by presenting real-world examples of graphs. It then describes
L12234: how to encode these graphs and how to formulate supervised learning problems for
L12235: graphs. The algorithmic requirements for processing graphs are discussed, and these lead
L12236: naturally to graph convolutional networks, a particular type of graph neural network.
L12237: 13.1
L12238: What is a graph?
L12239: A graph is a very general structure and consists of a set of nodes or vertices, where pairs
L12240: of nodes are connected by edges or links. Graphs are typically sparse; only a small subset
L12241: of the possible edges are present.
L12242: Some objects in the real world naturally take the form of graphs.
L12243: For example,
L12244: road networks can be considered graphs where the nodes are physical locations, and the
L12245: edges represent roads between them (figure 13.1a). Chemical molecules are small graphs
L12246: where the nodes represent atoms, and the edges represent chemical bonds (figure 13.1b).
L12247: Electrical circuits are graphs where the nodes represent components and junctions, and
L12248: the edges are electrical connections (figure 13.1c).
L12249: Furthermore, many datasets can also be represented by graphs, even if this is not
L12250: their obvious surface form. For example:
L12251: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L12254: <!-- page 255 -->
L12255: 13.1
L12256: What is a graph?
L12257: 241
L12258: Figure 13.1 Real-world graphs.
L12259: Some objects, such as a) road networks, b)
L12260: molecules, and c) electrical circuits, are naturally structured as graphs.
L12261: • Social networks are graphs where nodes are people, and the edges represent friend-
L12262: ships between them.
L12263: • The scientific literature can be viewed as a graph where the nodes are papers, and
L12264: the edges represent citations.
L12265: • Wikipedia can be considered a graph where the nodes are articles, and the edges
L12266: represent hyperlinks between articles.
L12267: • Computer programs can be represented as graphs where the nodes are syntax
L12268: tokens (variables at different points in the program flow), and the edges represent
L12269: computations involving these variables.
L12270: • Geometric point clouds can be represented as graphs. Here, each point is a node
L12271: with edges connecting to other nearby points.
L12272: • Protein interactions in a cell can be expressed as graphs, where the nodes are the
L12273: proteins, and there is an edge between two proteins if they interact.
L12274: In addition, a set (an unordered list) can be treated as a graph in which every member
L12275: is a node and connects to every other. An image can be treated as a graph with regular
L12276: topology, in which each pixel is a node with edges to the adjacent pixels.
L12277: 13.1.1
L12278: Types of graphs
L12279: Graphs can be categorized in various ways. The social network in figure 13.2a contains
L12280: undirected edges; each pair of individuals with a connection between them have mutually
L12281: agreed to be friends, so there is no sense that the relationship is directional. In contrast,
L12282: the citation network in figure 13.2b contains directed edges.
L12283: Each paper cites other
L12284: papers, and this relationship is inherently one-way.
L12285: Figure 13.2c depicts a knowledge graph that encodes a set of facts about objects by
L12286: defining relations between them. Technically, this is a directed heterogeneous multigraph.
L12287: It is heterogeneous because the nodes can represent different types of entities (e.g., people,
L12288: countries, companies). It is a multigraph because there can be multiple edges of different
L12289: types between any two nodes.
L12290: Draft: please send errata to udlbookmail@gmail.com.
L12293: <!-- page 256 -->
L12294: 242
L12295: 13
L12296: Graph neural networks
L12297: Figure 13.2 Types of graphs. a) A social network is an undirected graph; the
L12298: connections between people are symmetric. b) A citation network is a directed
L12299: graph; one publication cites another, so the relationship is asymmetric.
L12300: c) A
L12301: knowledge graph is a directed heterogeneous multigraph. The nodes are hetero-
L12302: geneous in that they represent different object types (people, places, companies)
L12303: and multiple edges may represent different relations between each node. d) A
L12304: point set can be converted to a graph by forming edges between nearby points.
L12305: Each node has an associated position in 3D space, and this is termed a geometric
L12306: graph (adapted from Hu et al., 2022). e) The scene on the left can be represented
L12307: by a hierarchical graph. The topology of the room, table, and light are all repre-
L12308: sented by graphs. These graphs form nodes in a larger graph representing object
L12309: adjacency (adapted from Fernández-Madrigal & González, 2002).
L12310: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L12313: <!-- page 257 -->
L12314: 13.2
L12315: Graph representation
L12316: 243
L12317: Figure 13.3 Graph representation. a) Example graph with six nodes and seven
L12318: edges. Each node has an associated embedding of length five (brown vectors).
L12319: Each edge has an associated embedding of length four (blue vectors). This graph
L12320: can be represented by three matrices. b) The adjacency matrix is a binary matrix
L12321: where element (m, n) is set to one if node m connects to node n. c) The node
L12322: data matrix X contains the concatenated node embeddings. d) The edge data
L12323: matrix E contains the edge embeddings.
L12324: The point set representing the airplane in figure 13.2d can be converted into a graph
L12325: by connecting each point to its K nearest neighbors. The result is a geometric graph
L12326: where each point is associated with a position in 3D space. Figure 13.2e represents a
L12327: hierarchical graph. The table, light, and room are each described by graphs representing
L12328: the adjacency of their respective components. These three graphs are themselves nodes
L12329: in another graph that represents the topology of the objects in a larger model.
L12330: All types of graphs can be processed using deep learning.
L12331: However, this chapter
L12332: focuses on undirected graphs like the social network in figure 13.2a.
L12333: 13.2
L12334: Graph representation
L12335: In addition to the graph structure itself, information is typically associated with each
L12336: node. For example, in a social network, each individual might be characterized by a fixed-
L12337: length vector representing their interests. Sometimes, the edges also have information
L12338: attached. For example, in the road network example, each edge might be characterized
L12339: by its length, number of lanes, frequency of accidents, and speed limit. The information
L12340: at a node is stored in a node embedding, and the information at an edge is stored in an
L12341: edge embedding.
L12342: More formally, a graph consists of a set of N nodes connected by a set of E edges. The
L12343: graph can be encoded by three matrices A, X, and E, representing the graph structure,
L12344: node embeddings, and edge embeddings, respectively (figure 13.3).
L12345: Draft: please send errata to udlbookmail@gmail.com.
L12348: <!-- page 258 -->
L12349: 244
L12350: 13
L12351: Graph neural networks
L12352: Figure 13.4 Properties of the adjacency matrix.
L12353: a) Example graph.
L12354: b) Posi-
L12355: tion (m, n) of the adjacency matrix A contains the number of walks of length one
L12356: from node m to node n. c) Position (m, n) of the squared adjacency matrix A2
L12357: contains the number of walks of length two from node m to node n. d) One hot
L12358: vector representing node six, which was highlighted in panel (a). e) When we
L12359: pre-multiply this vector by A, the result contains the number of walks of length
L12360: one from node six to each node; we can reach nodes five, seven, and eight in one
L12361: move. f) When we pre-multiply this vector by A2, the resulting vector contains
L12362: the number of walks of length two from node six to each node; we can reach nodes
L12363: two, three, four, five, and eight in two moves, and we can return to the original
L12364: node in three different ways (via nodes five, seven, and eight).
L12365: The graph structure is represented by the adjacency matrix, A. This is an N × N
L12366: matrix where entry (m, n) is set to one if there is an edge between nodes m and n and
L12367: Problems 13.1–13.2
L12368: zero otherwise. For undirected graphs, this matrix is always symmetric. For large sparse
L12369: graphs, it can be stored as a list of connections (m, n) to save memory.
L12370: The nth node has an associated node embedding x(n) of length D. These embeddings
L12371: are concatenated and stored in the D×N node data matrix X. Similarly, the eth edge has
L12372: an associated edge embedding e(e) of length DE. These edge embeddings are collected
L12373: into the DE × E matrix E. For simplicity, we initially consider graphs that only have
L12374: node embeddings and return to edge embeddings in section 13.9.
L12375: 13.2.1
L12376: Properties of the adjacency matrix
L12377: The adjacency matrix can be used to find the neighbors of a node using linear algebra.
L12378: Consider encoding the nth node’s position as a one-hot column vector (a vector with only
L12379: one non-zero entry at position n, which is set to one). When we pre-multiply this vector
L12380: by the adjacency matrix, it extracts the nth column of the adjacency matrix and returns
L12381: a vector with ones at the positions of the neighbors (i.e., all the places we can reach in
L12382: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L12385: <!-- page 259 -->
L12386: 13.3
L12387: Graph neural networks, tasks, and loss functions
L12388: 245
L12389: a walk of length one from the nth node). If we repeat this procedure (i.e., pre-multiply
L12390: by A again), the resulting vector contains the number of walks of length two from node n
L12391: Problems 13.3–13.4
L12392: to every node (figures 13.4d–f).
L12393: In general, if we raise the adjacency matrix to the power of L, the entry at posi-
L12394: tion (m, n) of AL contains the number of unique walks of length L from node m to
L12395: Notebook 13.1
L12396: Encoding
L12397: graphs
L12398: node n (figures 13.4a–c). This is not the same as the number of unique paths since the
L12399: walks include routes that visit the same node more than once. Nonetheless, AL still
L12400: contains valuable information about the graph connectivity; a non-zero entry at posi-
L12401: tion (m, n) indicates that the distance from m to n must be less than or equal to L.
L12402: 13.2.2
L12403: Permutation of node indices
L12404: Node indexing in graphs is arbitrary; permuting the node indices results in a permu-
L12405: tation of the columns of the node data matrix X and a permutation of both the rows
L12406: and columns of the adjacency matrix A. However, the underlying graph is unchanged
L12407: (figure 13.5). This is in contrast to images, where permuting the pixels creates a different
L12408: image, and to text, where permuting the words creates a different sentence.
L12409: The operation of exchanging node indices can be expressed mathematically by a
L12410: permutation matrix, P.
L12411: This is a matrix where exactly one entry in each row and
L12412: column take the value one, and the remaining values are zero. When position (m, n) of
L12413: the permutation matrix is set to one, it indicates that node m will become node n after
L12414: Problem 13.5
L12415: the permutation. To map from one indexing to another, we use the operations:
L12416: X′
L12417: =
L12418: XP
L12419: A′
L12420: =
L12421: PT AP,
L12422: (13.1)
L12423: where post-multiplying by P permutes the columns and pre-multiplying by PT permutes
L12424: the rows. It follows that any processing applied to the graph should also be indifferent
L12425: to these permutations. Otherwise, the result will depend on the choice of node indices.
L12426: 13.3
L12427: Graph neural networks, tasks, and loss functions
L12428: A graph neural network is a model that takes the node embeddings X and the adjacency
L12429: matrix A as inputs and passes them through a series of K layers. The node embeddings
L12430: are updated at each layer to create intermediate “hidden” representations Hk before
L12431: finally computing output embeddings HK.
L12432: At the start of this network, each column of the input node embeddings X just con-
L12433: tains information about the node itself. At the end, each column of the model output HK
L12434: includes information about the node and its context within the graph. This is similar to
L12435: word embeddings passing through a transformer network. These represent words at the
L12436: start, but represent the word meanings in the context of the sentence at the end.
L12437: Draft: please send errata to udlbookmail@gmail.com.
L12440: <!-- page 260 -->
L12441: 246
L12442: 13
L12443: Graph neural networks
L12444: Figure 13.5 Permutation of node indices. a) Example graph, b) associated adja-
L12445: cency matrix and c) node embeddings. d) The same graph where the (arbitrary)
L12446: order of the indices has been changed.
L12447: e) The adjacency matrix and f) node
L12448: matrix are now different. Consequently, any network layer that operates on the
L12449: graph should be indifferent to the ordering of the nodes.
L12450: 13.3.1
L12451: Tasks and loss functions
L12452: We defer discussion of graph neural network models until section 13.4 and first describe
L12453: the types of problems these networks tackle and their associated loss functions. Super-
L12454: vised graph problems usually fall into one of three categories (figure 13.6).
L12455: Graph-level tasks:
L12456: The network assigns a label or estimates one or more values from
L12457: the entire graph, exploiting both the structure and node embeddings. For example, we
L12458: might want to predict the temperature at which a molecule becomes liquid (a regression
L12459: task) or whether a molecule is poisonous to human beings or not (a classification task).
L12460: For graph-level tasks, the output node embeddings are combined (e.g., by averaging),
L12461: and the resulting vector is mapped via a linear transformation or neural network to a
L12462: fixed-size vector. For regression, the mismatch between the result and the ground truth
L12463: values is computed using the least squares loss. For binary classification, the output
L12464: is passed through a sigmoid function, and the mismatch is calculated using the binary
L12465: cross-entropy loss. Here, the probability that the graph belongs to class one might be
L12466: given by:
L12467: Pr(y = 1|X, A) = sig [βK + ωKHK1/N] ,
L12468: (13.2)
L12469: where the scalar βK and 1 × D vector ωK are learned parameters. Post-multiplying the
L12470: output embedding matrix HK by the column vector 1 that contains ones has the effect
L12471: of summing together all the embeddings and subsequently dividing by the number of
L12472: nodes N computes the average. This is known as mean pooling (see figure 10.11).
L12473: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L12476: <!-- page 261 -->
L12477: 13.3
L12478: Graph neural networks, tasks, and loss functions
L12479: 247
L12480: Figure 13.6 Common tasks for graphs. In each case, the input is a graph repre-
L12481: sented by its adjacency matrix and node embeddings. The graph neural network
L12482: processes the node embeddings by passing them through a series of layers. The
L12483: node embeddings at the last layer contain information about both the node and
L12484: its context in the graph. a) Graph classification. The node embeddings are com-
L12485: bined (e.g., by averaging) and then mapped to a fixed-size vector that is passed
L12486: through a softmax function to produce class probabilities. b) Node classification.
L12487: Each node embedding is used individually as the basis for classification (cyan
L12488: and orange colors represent assigned node classes). c) Edge prediction. Node
L12489: embeddings adjacent to the edge are combined (e.g., by taking the dot product)
L12490: to compute a single number that is mapped via a sigmoid function to produce a
L12491: probability that a missing edge should be present.
L12492: Draft: please send errata to udlbookmail@gmail.com.
L12495: <!-- page 262 -->
L12496: 248
L12497: 13
L12498: Graph neural networks
L12499: Node-level tasks:
L12500: The network assigns a label (classification) or one or more values
L12501: (regression) to each node of the graph, using both the graph structure and node em-
L12502: beddings. For example, given a graph constructed from a 3D point cloud similar to
L12503: figure 13.2d, the goal might be to classify the nodes according to whether they belong
L12504: to the wings or fuselage. Loss functions are defined in the same way as for graph-level
L12505: tasks, except that now this is done independently at each node n:
L12506: Pr(y(n) = 1|X, A) = sig
L12507: h
L12508: βK + ωKh(n)
L12509: K
L12510: i
L12511: .
L12512: (13.3)
L12513: Edge prediction tasks:
L12514: The network predicts whether or not there should be an edge
L12515: between nodes n and m. For example, in the social network setting, the network might
L12516: predict whether two people know and like each other and suggest that they connect if
L12517: that is the case. This is a binary classification task where the two node embeddings must
L12518: be mapped to a single number representing the probability that the edge is present. One
L12519: possibility is to take the dot product of the node embeddings and pass the result through
L12520: a sigmoid function to create the probability:
L12521: Pr(y(mn) = 1|X, A) = sig
L12522: h
L12523: h(m)T h(n)i
L12524: .
L12525: (13.4)
L12526: 13.4
L12527: Graph convolutional networks
L12528: There are many types of graph neural networks, but here we focus on spatial-based
L12529: convolutional graph neural networks, or GCNs for short. These models are convolutional
L12530: in that they update each node by aggregating information from nearby nodes. As such,
L12531: they induce a relational inductive bias (i.e., a bias toward prioritizing information from
L12532: neighbors). They are spatial-based because they use the original graph structure. This
L12533: contrasts with spectral-based methods, which apply convolutions in the Fourier domain.
L12534: Each layer of the GCN is a function F[•] with parameters Φ that takes the node
L12535: embeddings and adjacency matrix and outputs new node embeddings. The network can
L12536: hence be written as:
L12537: H1
L12538: =
L12539: F[X, A, ϕ0]
L12540: H2
L12541: =
L12542: F[H1, A, ϕ1]
L12543: H3
L12544: =
L12545: F[H2, A, ϕ2]
L12546: ...
L12547: =
L12548: ...
L12549: HK
L12550: =
L12551: F[HK−1, A, ϕK−1],
L12552: (13.5)
L12553: where X is the input, A is the adjacency matrix, Hk contains the modified node em-
L12554: beddings at the kth layer, and ϕk denotes the parameters that map from layer k to
L12555: layer k+1.
L12556: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L12559: <!-- page 263 -->
L12560: 13.4
L12561: Graph convolutional networks
L12562: 249
L12563: 13.4.1
L12564: Equivariance and invariance
L12565: We noted before that the indexing of the nodes in the graph is arbitrary, and any
L12566: permutation of the node indices does not change the graph. It is hence imperative that
L12567: any model respects this property. It follows that each layer must be equivariant (see
L12568: section 10.1) with respect to permutations of the node indices. In other words, if we
L12569: permute the node indices, the node embeddings at each stage will be permuted in the
L12570: same way. In mathematical terms, if P is a permutation matrix, then we must have:
L12571: Hk+1P = F[HkP, PT AP, ϕk].
L12572: (13.6)
L12573: For node classification and edge prediction tasks, the output should also be equiv-
L12574: ariant with respect to permutations of the node indices. However, for graph-level tasks,
L12575: the final layer aggregates information from across the graph, so the output is invariant
L12576: Problem 13.6
L12577: to the node order. In fact, the output layer from equation 13.2 achieves this because:
L12578: y = sig [βK + ωKHK1/N] = sig [βK + ωKHKP1/N] ,
L12579: (13.7)
L12580: for any permutation matrix P (see problem 13.6).
L12581: This mirrors the case for images, where segmentation should be equivariant to geo-
L12582: metric transformations, and image classification should be invariant (figure 10.1). Here,
L12583: convolutional and pooling layers partially achieve this with respect to translations, but
L12584: there is no known way to guarantee these properties exactly for more general transfor-
L12585: mations. However, for graphs, it is possible to define networks that ensure equivariance
L12586: or invariance to permutations.
L12587: 13.4.2
L12588: Parameter sharing
L12589: Chapter 10 argued applying fully connected networks to images isn’t sensible because
L12590: this requires the network to learn how to recognize an object separately at every image
L12591: position. Instead, we used convolutional layers that processed every position in the image
L12592: identically. This reduced the number of parameters and introduced an inductive bias
L12593: that forced the model to treat every part of the image in the same way.
L12594: The same argument can be made about nodes in a graph. We could learn a model
L12595: with separate parameters associated with each node. However, now the network must
L12596: independently learn the meaning of the connections in the graph at each position, and
L12597: training would require many graphs with the same topology. Instead, we build a model
L12598: that uses the same parameters at every node, reducing the number of parameters and
L12599: sharing what the network learns at each node across the entire graph.
L12600: Recall that a convolution (equation 10.3) updates a variable by taking a weighted
L12601: sum of information from its neighbors. One way to think of this is that each neighbor
L12602: sends a message to the variable of interest, which aggregates these messages to form the
L12603: update. When we considered images, the neighbors were pixels from a fixed-size square
L12604: region around the current position, so the spatial relationships at each position are the
L12605: same. However, in a graph, each node may have a different number of neighbors, and
L12606: there are no consistent relationships; there is no sense that we can weight information
L12607: Draft: please send errata to udlbookmail@gmail.com.
L12610: <!-- page 264 -->
L12611: 250
L12612: 13
L12613: Graph neural networks
L12614: Figure 13.7 Simple Graph CNN layer. a) Input graph consists of structure (em-
L12615: bodied in graph adjacency matrix A, not shown) and node embeddings (stored
L12616: in columns of X). b) Each node in the first hidden layer is updated by (i) ag-
L12617: gregating the neighboring nodes to form a single vector, (ii) applying a linear
L12618: transformation Ω0 to the aggregated vector, (iii) applying the same linear trans-
L12619: formation Ω0 to the original node, (iv) adding these together with a bias β0,
L12620: and finally (v) applying a nonlinear activation function a[•] like a ReLU. c) This
L12621: process is repeated at subsequent layers (but with different parameters for each
L12622: layer) until we produce the final embeddings at the end of the network.
L12623: from a node that is “above” the node of interest differently to information from a node
L12624: that is “below” it.
L12625: 13.4.3
L12626: Example GCN layer
L12627: These considerations lead to a simple GCN layer (figure 13.7). At each node n in layer k,
L12628: we aggregate information from neighboring nodes by summing their node embeddings h•:
L12629: agg[n, k] =
L12630: X
L12631: m∈ne[n]
L12632: h(m)
L12633: k
L12634: ,
L12635: (13.8)
L12636: where ne[n] returns the set of indices of the neighbors of node n.
L12637: Then we apply a
L12638: linear transformation Ωk to the embedding h(n)
L12639: k
L12640: at the current node and to this ag-
L12641: gregated value, add a bias term βk, and pass the result through a nonlinear activation
L12642: function a[•], which is applied independently to every member of its vector argument:
L12643: h(n)
L12644: k+1 = a
L12645: h
L12646: βk + Ωk · h(n)
L12647: k
L12648: + Ωk · agg[n, k]
L12649: i
L12650: .
L12651: (13.9)
L12652: We can write this more succinctly by noting that post-multiplication of a matrix
L12653: by a vector returns a weighted sum of its columns. The nth column of the adjacency
L12654: matrix A contains ones at the positions of the neighbors. Hence, if we collect the node
L12655: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
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
