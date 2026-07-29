L11594: <!-- page 242 -->
L11595: 228
L11596: 12
L11597: Transformers
L11598: Figure 12.15 Interaction matrices for self-attention. a) In an encoder, every token
L11599: interacts with every other token, and computation expands quadratically with the
L11600: number of tokens. b) In a decoder, each token only interacts with the previous
L11601: tokens, but complexity is still quadratic. c) Complexity can be reduced by using
L11602: a convolutional structure (encoder case). d) Convolutional structure for decoder
L11603: case. e–f) Convolutional structure with dilation rate of two and three (decoder
L11604: case). g) Another strategy is to allow selected tokens to interact with all the
L11605: other tokens (encoder case) or all the previous tokens (decoder case pictured).
L11606: h) Alternatively, global tokens can be introduced (left two columns and top two
L11607: rows). These interact with all of the tokens as well as with each other.
L11608: former to cope with longer sequences. One approach is to prune the self-attention in-
L11609: teractions or, equivalently, to sparsify the interaction matrix (figures 12.15c-h).
L11610: For
L11611: example, this can be restricted to a convolutional structure so that each token only in-
L11612: teracts with a few neighboring tokens. Across multiple layers, tokens still interact at
L11613: larger distances as the receptive field expands. As for convolution in images, the kernel
L11614: can vary in size and dilation rate.
L11615: A pure convolutional approach requires many layers to integrate information over
L11616: large distances. One way to speed up this process is to allow certain tokens (perhaps at
L11617: the start of every sentence) to attend to all other tokens (encoder model) or all previous
L11618: tokens (decoder model). A similar idea is to have a small number of global tokens that
L11619: connect to all the other tokens and themselves. Like the <cls> token, these do not
L11620: represent any word but serve to provide long-distance connections.
L11621: 12.10
L11622: Transformers for images
L11623: Transformers were initially developed for text data. Their enormous success in this area
L11624: led to experimentation on images.
L11625: This was not obviously a promising idea for two
L11626: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L11629: <!-- page 243 -->
L11630: 12.10
L11631: Transformers for images
L11632: 229
L11633: reasons. First, there are many more pixels in an image than words in a sentence, so the
L11634: quadratic complexity of self-attention poses a practical bottleneck. Second, convolutional
L11635: nets have a good inductive bias because each layer is equivariant to spatial translation,
L11636: and takes into account the 2D structure of the image. However, this must be learned in
L11637: a transformer network.
L11638: Regardless of these apparent disadvantages, transformer networks for images have
L11639: now eclipsed the performance of convolutional networks for image classification and other
L11640: tasks. This is partly because of the enormous scale at which they can be constructed
L11641: and the large amounts of data that can be used to pre-train the networks. This section
L11642: describes transformer models for images.
L11643: 12.10.1
L11644: ImageGPT
L11645: ImageGPT is a transformer decoder; it builds an autoregressive model of image pixels
L11646: that ingests a partial image and predicts the subsequent pixel value.
L11647: The quadratic
L11648: complexity of the transformer network means that the largest model (which contained
L11649: 6.8 billion parameters) could still only operate on 64×64 images. Moreover, to make this
L11650: tractable, the original 24-bit RGB color space had to be quantized into a nine-bit color
L11651: space, so the system ingests (and predicts) one of 512 possible tokens at each position.
L11652: Images are naturally 2D objects, but ImageGPT simply learns a different positional
L11653: encoding at each pixel. Hence it must learn that each pixel has a close relationship with
L11654: its preceding neighbors and also with nearby pixels in the row above. Figure 12.16 shows
L11655: example generation results.
L11656: The internal representation of this decoder was used as a basis for image classifi-
L11657: cation. Each pixel’s final embedding is averaged, and a linear layer maps these values
L11658: to activations which are passed through a softmax layer to predict class probabilities.
L11659: The system is pre-trained on a large corpus of web images and then fine-tuned on the
L11660: ImageNet database resized to 48 × 48 pixels using a loss function that contains both a
L11661: cross-entropy term for image classification and a generative loss term for predicting the
L11662: pixels. Despite using a large amount of external training data, the system achieved only
L11663: a 27.4% top-1 error rate on ImageNet (figure 10.15). This was worse than convolutional
L11664: architectures of the time (see figure 10.21) but is still impressive given the small input
L11665: image size; unsurprisingly, it fails where the target object is small or thin.
L11666: 12.10.2
L11667: Vision Transformer (ViT)
L11668: The Vision Transformer tackled the problem of image resolution by dividing the image
L11669: into 16×16 patches (figure 12.17). Each patch is mapped to an input embedding via
L11670: Problem 12.8
L11671: a learned linear transformation, and these representations are fed into the transformer
L11672: network. Once again, standard 1D positional encodings are learned.
L11673: This is an encoder model with a <cls> token (see figures 12.10–12.11). However,
L11674: unlike BERT, it uses supervised pre-training on a large database of 303 million labeled
L11675: images from 18,000 classes. The <cls> token is mapped via a final network layer to
L11676: create activations that are fed into a softmax function to generate class probabilities.
L11677: After pre-training, the system is applied to the final classification task by replacing this
L11678: Draft: please send errata to udlbookmail@gmail.com.
L11681: <!-- page 244 -->
L11682: 230
L11683: 12
L11684: Transformers
L11685: Figure 12.16 ImageGPT. a) Images generated from the autoregressive ImageGPT
L11686: model. The top-left pixel is drawn from the estimated empirical distribution at
L11687: this position. Subsequent pixels are generated in turn, conditioned on the previous
L11688: ones, working along the rows until the bottom-right of the image is reached. For
L11689: each pixel, the transformer decoder generates a conditional distribution as in
L11690: equation 12.15, and a sample is drawn. The extended sequence is then fed back
L11691: into the network to generate the next pixel, and so on. b) Image completion.
L11692: In each case, the lower half of the image is removed (top row), and ImageGPT
L11693: completes the remaining part pixel by pixel (three different completions shown).
L11694: Adapted from https://openai.com/blog/image-gpt/.
L11695: final layer with one that maps to the desired number of classes and is fine-tuned.
L11696: For the ImageNet benchmark, this system achieved an 11.45% top-1 error rate. How-
L11697: ever, it did not perform as well as the best contemporary convolutional networks without
L11698: supervised pre-training. The strong inductive bias of convolutional networks can only
L11699: be superseded by employing extremely large amounts of training data.
L11700: 12.10.3
L11701: Multi-scale vision transformers
L11702: The Vision Transformer differs from convolutional architectures in that it operates on a
L11703: single scale and has a receptive field that covers the whole image. Several transformer
L11704: models that process the image at multiple scales have been proposed.
L11705: Similarly to
L11706: convolutional networks, these generally start with small high resolution patches and few
L11707: channels and gradually enlarge the receptive field, decrease the spatial resolution and
L11708: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L11711: <!-- page 245 -->
L11712: 12.10
L11713: Transformers for images
L11714: 231
L11715: Figure 12.17 Vision transformer. The Vision Transformer (ViT) breaks the image
L11716: into a grid of patches (16×16 in the original implementation).
L11717: Each of these
L11718: is projected via a learned linear transformation to become a patch embedding.
L11719: These patch embeddings are fed into a transformer encoder network, and the
L11720: <cls> token is used to predict the class probabilities.
L11721: Figure 12.18 Shifted window (SWin) transformer (Liu et al., 2021c). a) Original
L11722: image. b) The SWin transformer breaks the image into a grid of windows and
L11723: each of these windows into a sub-grid of patches. The transformer network applies
L11724: self-attention to the patches within each window independently (i.e., patches only
L11725: attend to other patches in the same window). c) Each alternate layer shifts the
L11726: windows so that the subsets of patches that interact with one another change,
L11727: and information can propagate across the whole image. d) After several layers,
L11728: the 2×2 blocks of patch representations are concatenated to increase the effective
L11729: patch (and window) size. e) Alternate layers use shifted windows at this new lower
L11730: resolution. f) Eventually, the resolution is such that there is just a single window,
L11731: and the patches span the entire image.
L11732: Draft: please send errata to udlbookmail@gmail.com.
L11735: <!-- page 246 -->
L11736: 232
L11737: 12
L11738: Transformers
L11739: increase the number of channels (embedding dimension).
L11740: A representative example of a multi-scale transformer is the shifted-window or SWin
L11741: transformer. This is an encoder transformer that divides the image into patches and
L11742: groups these patches into a grid of windows within which self-attention is applied in-
L11743: dependently (figure 12.18). These windows are shifted in adjacent transformers, so the
L11744: effective receptive field at a given patch can expand beyond the window border.
L11745: The scale is reduced periodically by concatenating features from non-overlapping 2×2
L11746: patches and applying a linear transformation that maps these concatenated features to
L11747: twice the original number of channels. This architecture does not have a <cls> token
L11748: but instead averages the output features at the last layer. These are then mapped via a
L11749: linear layer to the desired number of classes and passed through a softmax function to
L11750: output class probabilities. At the time of writing, the most sophisticated version of this
L11751: architecture achieves a 9.89% top-1 error rate on the ImageNet database.
L11752: A related idea is periodically to integrate information from across the whole image.
L11753: Dual attention vision transformers (DaViT) alternate two types of transformers. In the
L11754: first, image patches attend to one another, and the self-attention computation uses all
L11755: the channels. In the second, the channels attend to one another, and the self-attention
L11756: computation uses all the image patches. This architecture reaches a 9.60% top-1 error
L11757: Problem 12.9
L11758: rate on ImageNet and is close to the state-of-the-art at the time of writing.
L11759: 12.11
L11760: Summary
L11761: This chapter introduced self-attention and the transformer architecture. Encoder, de-
L11762: coder, and encoder-decoder models were then described. The transformer operates on
L11763: sets of high-dimensional embeddings. It has a low computational complexity per layer,
L11764: and much of the computation can be performed in parallel using the matrix form. Since
L11765: every input embedding interacts with every other, it can describe long-range dependen-
L11766: cies in text. Ultimately, the computation scales quadratically with the sequence length;
L11767: one approach to reducing the complexity is sparsifying the interaction matrix.
L11768: The training of transformers with very large unlabeled datasets is the first example
L11769: of unsupervised learning (learning without labels) in this book. Encoders learn a repre-
L11770: sentation that can be used for other tasks by predicting missing tokens. Decoders build
L11771: an autoregressive model over the inputs and are the first example of a generative model
L11772: in this book. The generative decoders can be used to create new data examples.
L11773: Chapter 13 considers networks for processing graph data. These have connections
L11774: with transformers in that the nodes of the graph attend to one another in each network
L11775: layer. Chapters 14–18 return to unsupervised learning and generative models.
L11776: Notes
L11777: Natural language processing:
L11778: Transformers were developed for natural language processing
L11779: (NLP) tasks. This is an enormous area that deals with text analysis, categorization, generation,
L11780: and manipulation. Example tasks include part of speech tagging, translation, text classification,
L11781: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L11784: <!-- page 247 -->
L11785: Notes
L11786: 233
L11787: Figure 12.19 Recurrent neural networks (RNNs).
L11788: The word embeddings are
L11789: passed sequentially through a series of identical neural networks. Each network
L11790: has two outputs; one is the output embedding, and the other (orange arrows)
L11791: feeds back into the next neural network, along with the next word embedding.
L11792: Each output embedding contains information about the word itself and its con-
L11793: text in the preceding sentence fragment. In principle, the final output contains
L11794: information about the entire sentence and could be used to support classification
L11795: tasks similarly to the <cls> token in a transformer encoder model. However,
L11796: RNNs sometimes gradually “forget” about tokens that are further back in time.
L11797: entity recognition (people, places, companies, etc.), text summarization, question answering,
L11798: word sense disambiguation, and document clustering. NLP was initially tackled by rule-based
L11799: methods that exploited the structure and statistics of grammar. See Manning & Schutze (1999)
L11800: and Jurafsky & Martin (2000) for early approaches.
L11801: Recurrent neural networks:
L11802: Before the introduction of transformers, many state-of-the-art
L11803: NLP applications used recurrent neural networks, or RNNs for short (figure 12.19). The term
L11804: “recurrent” was introduced by Rumelhart et al. (1985), but the main idea dates to at least
L11805: Minsky & Papert (1969). RNNs ingest a sequence of inputs (words in NLP) one at a time.
L11806: At each step, the network receives both the new input and a hidden representation computed
L11807: from the previous time step (the recurrent connection). The final output contains information
L11808: about the whole input. This representation can then support NLP tasks like classification or
L11809: translation. They have also been used in a decoding context in which generated tokens are
L11810: fed back into the model to form the next input to the sequence. For example, the PixelRNN
L11811: (Van den Oord et al., 2016c) used RNNs to build an autoregressive model of images.
L11812: From RNNs to transformers:
L11813: One of the problems with RNNs is that they can forget in-
L11814: formation that is further back in the sequence. More sophisticated versions of this architecture,
L11815: such as long short-term memory networks or LSTMs (Hochreiter & Schmidhuber, 1997b) and
L11816: gated recurrent units or GRUs (Cho et al., 2014; Chung et al., 2014) partially addressed this
L11817: problem. However, in machine translation, the idea emerged that all of the intermediate rep-
L11818: resentations in the RNN could be exploited to produce the output sentence. Moreover, certain
L11819: output words should attend more to certain input words according to their relation (Bahdanau
L11820: et al., 2015). This ultimately led to dispensing with the recurrent structure and replacing it with
L11821: the encoder-decoder transformer (Vaswani et al., 2017). Here input tokens attend to one another
L11822: (self-attention), output tokens attend to those earlier in the sequence (masked self-attention),
L11823: and output tokens also attend to the input tokens (cross-attention). A formal algorithmic de-
L11824: scription of the transformer can be found in Phuong & Hutter (2022), and a survey of work can
L11825: be found in Lin et al. (2022). The literature should be approached with caution, as many en-
L11826: Draft: please send errata to udlbookmail@gmail.com.
L11829: <!-- page 248 -->
L11830: 234
L11831: 12
L11832: Transformers
L11833: hancements to transformers do not make meaningful performance improvements when carefully
L11834: assessed in controlled experiments (Narang et al., 2021).
L11835: Applications:
L11836: Models based on self-attention and/or the transformer architecture have been
L11837: applied to text sequences (Vaswani et al., 2017), image patches (Dosovitskiy et al., 2021),
L11838: protein sequences (Rives et al., 2021), graphs (Veličković et al., 2019), database schema (Xu
L11839: et al., 2021b), speech (Wang et al., 2020c), mathematical integration when formulated as a
L11840: translation problem (Lample & Charton, 2020), and time series (Wu et al., 2020b). However,
L11841: their most celebrated successes have been in building language models and, more recently, as a
L11842: replacement for convolutional networks in computer vision.
L11843: Large language models:
L11844: Vaswani et al. (2017) targeted translation tasks, but transformers
L11845: are now more usually used to build either pure encoder or pure decoder models, the most famous
L11846: of which are BERT (Devlin et al., 2019) and GPT2/GPT3 (Radford et al., 2019; Brown et al.,
L11847: 2020), respectively. These models are usually tested against benchmarks like GLUE (Wang
L11848: et al., 2019b), which includes the SQuAD question-answering task (Rajpurkar et al., 2016)
L11849: described in section 12.6.2, SuperGLUE (Wang et al., 2019a) and BIG-bench (Srivastava et al.,
L11850: 2022), which combine many NLP tasks to create an aggregate score for measuring language
L11851: ability. Decoder models are generally not fine-tuned for these tasks but can perform well anyway
L11852: when given a few examples of questions and answers and asked to complete the text from the
L11853: next question. This is referred to as few-shot learning (Brown et al., 2020).
L11854: Since GPT3, many decoder language models have been released with steady improvement in
L11855: few-shot results. These include GLaM (Du et al., 2022), Gopher (Rae et al., 2021), Chinchilla
L11856: (Hoffmann et al., 2023), Megatron-Turing NLG (Smith et al., 2022), and LaMDa (Thoppilan
L11857: et al., 2022). Most of the performance improvement is attributable to increased model size,
L11858: using sparsely activated modules, and exploiting larger datasets. At the time of writing, the
L11859: most recent model is PaLM (Chowdhery et al., 2022), which has 540 billion parameters and
L11860: was trained on 780 billion tokens across 6144 processors.
L11861: Interestingly, since text is highly
L11862: compressible, this model has more than enough capacity to memorize the entire training dataset.
L11863: This is true for many language models. Many bold statements have been made about how large
L11864: language models exceed human performance. This is probably true for some tasks, but such
L11865: statements should be treated with caution (see Ribeiro et al.,2021; McCoy et al., 2019; Bowman
L11866: & Dahl, 2021; and Dehghani et al., 2021).
L11867: These models have considerable world knowledge. For example, in section 12.7.4, the model
L11868: knows key facts about deep learning, including that it is a type of machine learning with
L11869: associated algorithms and applications. Indeed, one such model has been mistakenly identified
L11870: as being sentient (Clark, 2022). However, there are persuasive arguments that the degree of
L11871: “understanding” this type of model can ever have is limited (Bender & Koller, 2020).
L11872: Tokenizers:
L11873: Schuster & Nakajima (2012) and Sennrich et al. (2015) introduced WordPiece
L11874: and byte pair encoding (BPE), respectively. Both methods greedily merge pairs of tokens based
L11875: on their frequency of adjacency (figure 12.8), with the main difference being how the initial
L11876: tokens are chosen. For example, in BPE, the initial tokens are characters or punctuation with
L11877: a special token to denote whitespace. The merges cannot occur over the whitespace. As the
L11878: algorithm proceeds, new tokens are formed by combining characters recursively so that sub-
L11879: word and word tokens emerge. The unigram language model (Kudo, 2018) generates several
L11880: possible candidate merges and chooses the best one based on the likelihood in a language model.
L11881: Provilkov et al. (2020) develop BPE dropout, which generates the candidates more eﬀiciently
L11882: by introducing randomness into the process of counting frequencies. Versions of both byte pair
L11883: encoding and the unigram language model are included in the SentencePiece library (Kudo &
L11884: Richardson, 2018), which works directly on Unicode characters and can work with any language.
L11885: He et al. (2020) introduce a method that treats the sub-word segmentation as a latent variable
L11886: that should be marginalized out for learning and inference.
L11887: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L11890: <!-- page 249 -->
L11891: Notes
L11892: 235
L11893: Decoding algorithms:
L11894: Transformer decoder models take a body of text and return a prob-
L11895: ability over the next token. This is then added to the preceding text, and the model is run
L11896: again. The process of choosing tokens from these probability distributions is known as decoding.
L11897: Näive ways to do this would be to either (i) greedily choose the most likely token or (ii) choose
L11898: a token randomly according to the distribution. However, neither of these methods works well
L11899: in practice. In the former case, the results may be very generic, and the latter case may lead
L11900: to degraded quality outputs (Holtzman et al., 2020). This is partly because, during training,
L11901: the model was only exposed to sequences of ground truth tokens (known as teacher forcing) but
L11902: sees its own output when deployed.
L11903: It is not computationally feasible to try every combination of tokens in the output sequence,
L11904: but it is possible to maintain a fixed number of parallel hypotheses and choose the most likely
L11905: overall sequence. This is known as beam search. Beam search tends to produce many similar
L11906: hypotheses and has been modified to investigate more diverse sequences (Vijayakumar et al.,
L11907: 2016; Kulikov et al., 2018). One possible problem with random sampling is that there is a very
L11908: long tail of unlikely following words that collectively have a significant probability. This has
L11909: led to the development of top-K sampling, in which tokens are sampled from only the K most
L11910: likely hypotheses (Fan et al., 2018). Top-K sampling still sometimes allows unreasonable token
L11911: choices when there are only a few high-probability choices. To resolve this problem, Holtzman
L11912: et al. (2020) proposed nucleus sampling, in which tokens are sampled from a fixed proportion of
L11913: the total probability mass. El Asri & Prince (2020) discuss decoding algorithms in more depth.
L11914: Types of attention:
L11915: Scaled dot-product attention (Vaswani et al., 2017) is just one of a
L11916: family of attention mechanisms that includes additive attention (Bahdanau et al., 2015), multi-
L11917: plicative attention (Luong et al., 2015), key-value attention (Daniluk et al., 2017), and memory-
L11918: compressed attention (Liu et al., 2019c). Zhai et al. (2021) constructed “attention-free” trans-
L11919: formers, in which the tokens interact in a way that does not have quadratic complexity. Multi-
L11920: head attention was also introduced by Vaswani et al. (2017). Interestingly, it appears that most
L11921: of the heads can be pruned after training without critically affecting the performance (Voita
L11922: et al., 2019); it has been suggested that their role is to guard against bad initializations. Hu et al.
L11923: (2018b) propose squeeze-and-excitation networks, attention-like mechanisms that re-weight the
L11924: channels in a convolutional layer based on globally computed features.
L11925: Relationship of self-attention to other models:
L11926: The self-attention computation has close
L11927: connections to other models. First, it is an example of a hypernetwork (Ha et al., 2017) in that
L11928: it uses one part of the network to choose the weights of another part: the attention matrix forms
L11929: the weights of a sparse network layer that maps the values to the outputs (figure 12.3). The
L11930: synthesizer (Tay et al., 2021) simplifies this idea by using a neural network to create each row of
L11931: the attention matrix from the corresponding input embedding. Even though the input tokens no
L11932: longer interact with each other to create the attention weights, this works surprisingly well. Wu
L11933: et al. (2019) present a similar system that produces an attention matrix with a convolutional
L11934: structure so the tokens attend to their neighbors. The gated multi-layer perceptron (Wu et al.,
L11935: 2019) computes a matrix that pointwise multiplies the values and hence modifies them without
L11936: mixing them. Transformers are also closely related to fast weight memory systems, which were
L11937: the intellectual forerunners of hypernetworks (Schlag et al., 2021).
L11938: Self-attention can also be thought of as a routing mechanism (figure 12.1), and from this view-
L11939: point, there is a connection to capsule networks (Sabour et al., 2017). These capture hierarchical
L11940: relations in images; lower network levels might detect facial parts (noses, mouths), which are
L11941: then combined (routed) in higher-level capsules that represent a face. However, capsule net-
L11942: works use routing by agreement. In self-attention, the inputs compete with each other for how
L11943: much they contribute to a given output (via the softmax operation). In capsule networks, the
L11944: outputs of the layer compete with each other for inputs from earlier layers. Once we consider
L11945: self-attention as a routing network, we can question whether making this routing dynamic (i.e.,
L11946: dependent on the data) is necessary. The random synthesizer (Tay et al., 2021) removed the de-
L11947: Draft: please send errata to udlbookmail@gmail.com.
L11950: <!-- page 250 -->
L11951: 236
L11952: 12
L11953: Transformers
L11954: pendence of the attention matrix on the inputs entirely and either used predetermined random
L11955: values or learned values. This performed surprisingly well across a variety of tasks.
L11956: Multi-head self-attention also has close connections to graph neural networks (see chapter 13),
L11957: convolution (Cordonnier et al., 2020), recurrent neural networks (Choromanski et al., 2020),
L11958: and memory retrieval in Hopfield networks (Ramsauer et al., 2021). For more information on
L11959: the relationships between transformers and other models, consult Prince (2021a).
L11960: Positional encoding:
L11961: The original transformer paper (Vaswani et al., 2017) experimented
L11962: with predefining the positional encoding matrix Π, and learning the positional encoding Π.
L11963: It might seem odd to add the positional encodings to the D × N data matrix X rather than
L11964: concatenate them.
L11965: However, the data dimension D is usually greater than the number of
L11966: tokens N, so the positional encoding lies in a subspace. The word embeddings in X are learned,
L11967: so the system can theoretically keep the two components in orthogonal subspaces and retrieve
L11968: the positional encodings as required.
L11969: The predefined embeddings chosen by Vaswani et al.
L11970: (2017) were a family of sinusoidal components with two attractive properties: (i) the relative
L11971: position of two embeddings is easy to recover using a linear operation and (ii) their dot product
L11972: generally decreased as the distance between positions increased (see Prince, 2021a, for more
L11973: details). Many systems, such as GPT3 and BERT, learn positional encodings. Wang et al.
L11974: (2020a) examined the cosine similarities of the positional encodings in these models and showed
L11975: that they generally decline with relative distance, although they also have a periodic component.
L11976: Much subsequent work has modified just the attention matrix so that in the scaled dot-product
L11977: self-attention equation:
L11978: Sa[X] = V · Softmax
L11979: "
L11980: KT Q
L11981: √
L11982: Dq
L11983: #
L11984: ,
L11985: (12.16)
L11986: only the queries and keys contain position information:
L11987: V
L11988: =
L11989: βv1T + ΩvX
L11990: Q
L11991: =
L11992: βq1T + Ωq(X + Π)
L11993: K
L11994: =
L11995: βk1T + Ωk(X + Π).
L11996: (12.17)
L11997: This has led to the idea of multiplying out the quadratic component in the numerator of equa-
L11998: tion 12.16 and retaining only some of the terms. For example, Ke et al. (2021) decouple or untie
L11999: the content and position information by retaining only the content-content and position-position
L12000: terms and using different projection matrices Ω• for each.
L12001: Another modification is to inject information directly about the relative position. This is more
L12002: important than absolute position since a batch of text can start at an arbitrary place in a
L12003: document. Shaw et al. (2018), Raffel et al. (2020), and Huang et al. (2020b) all developed
L12004: systems where a single term was learned for each relative position offset, and the attention
L12005: matrix was modified in various ways using these relative positional encodings. Wei et al. (2019)
L12006: investigated relative positional encodings based on predefined sinusoidal embeddings rather than
L12007: learned values. DeBERTa (He et al., 2021) combines these ideas; they retain only a subset of
L12008: terms from the quadratic expansion, apply different projection matrices to them, and use relative
L12009: positional encodings. Other work has explored sinusoidal embeddings that encode absolute and
L12010: relative position information in more complex ways (Su et al., 2021).
L12011: Wang et al. (2020a) compare the performance of transformers in BERT with different posi-
L12012: tional encodings. They found that relative positional encodings perform better than absolute
L12013: positional encodings, but there was little difference between using sinusoidal and learned em-
L12014: beddings. A survey of positional encodings can be found in Dufter et al. (2021).
L12015: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
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
