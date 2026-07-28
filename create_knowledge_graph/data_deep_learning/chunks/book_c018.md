L11032: <!-- page 228 -->
L11033: 214
L11034: 12
L11035: Transformers
L11036: Relative positional encodings:
L11037: The input to a self-attention mechanism may be an
L11038: entire sentence, many sentences, or just a fragment of a sentence, and the absolute
L11039: position of a word is much less important than the relative position between two words.
L11040: Of course, this can be recovered if the system knows the absolute position of both,
L11041: but relative positional encodings encode this information directly. Each element of the
L11042: attention matrix corresponds to a particular offset between key position a and query
L11043: position b. Relative positional encodings learn a parameter πa,b for each offset and use
L11044: this to modify the attention matrix by adding these values, multiplying by them, or
L11045: using them to alter the attention matrix in some other way.
L11046: 12.3.2
L11047: Scaled dot-product self-attention
L11048: The dot products in the attention computation can have large magnitudes and move
L11049: the arguments to the softmax function into a region where the largest value completely
L11050: dominates. Small changes to the inputs to the softmax function now have little effect on
L11051: Problem 12.4
L11052: the output (i.e., the gradients are very small), making the model diﬀicult to train. To
L11053: prevent this, the dot products are scaled by the square root of the dimension Dq of the
L11054: queries and keys (i.e., the number of rows in Ωq and Ωk, which must be the same):
L11055: Sa[X] = V · Softmax
L11056: "
L11057: KT Q
L11058: √
L11059: Dq
L11060: #
L11061: .
L11062: (12.9)
L11063: This is known as scaled dot-product self-attention.
L11064: 12.3.3
L11065: Multiple heads
L11066: Multiple self-attention mechanisms are usually applied in parallel, and this is known as
L11067: multi-head self-attention. Now H different sets of values, keys, and queries are computed:
L11068: Vh
L11069: =
L11070: βvh1T + ΩvhX
L11071: Qh
L11072: =
L11073: βqh1T + ΩqhX
L11074: Kh
L11075: =
L11076: βkh1T + ΩkhX.
L11077: (12.10)
L11078: The hth self-attention mechanism or head can be written as:
L11079: Sah[X] = Vh · Softmax
L11080: "
L11081: KT
L11082: h Qh
L11083: √
L11084: Dq
L11085: #
L11086: ,
L11087: (12.11)
L11088: where we have different parameters {βvh, Ωvh}, {βqh, Ωqh}, and {βkh, Ωkh} for each
L11089: head. Typically, if the dimension of the inputs xm is D and there are H heads, the values,
L11090: queries, and keys will all be of size D/H, as this allows for an eﬀicient implementation.
L11091: Problem 12.5
L11092: The outputs of these self-attention mechanisms are vertically concatenated, and another
L11093: linear transform Ωc is applied to combine them (figure 12.6):
L11094: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L11097: <!-- page 229 -->
L11098: 12.4
L11099: Transformer layers
L11100: 215
L11101: Figure 12.6 Multi-head self-attention.
L11102: Self-attention occurs in parallel across
L11103: multiple “heads.” Each has its own queries, keys, and values. Here two heads are
L11104: depicted, in the cyan and orange boxes, respectively. The outputs are vertically
L11105: concatenated, and another linear transformation Ωc is used to recombine them.
L11106: MhSa[X] = Ωc
L11107: h
L11108: Sa1[X]T , Sa2[X]T , . . . , SaH[X]T iT
L11109: .
L11110: (12.12)
L11111: Multiple heads seem to be necessary to make self-attention work well.
L11112: It has been
L11113: Notebook 12.2
L11114: Multi-head
L11115: self-attention
L11116: speculated that they make the self-attention network more robust to bad initializations.
L11117: 12.4
L11118: Transformer layers
L11119: Self-attention is just one part of a larger transformer layer. This consists of a multi-
L11120: head self-attention unit (which allows the word representations to interact with each
L11121: Draft: please send errata to udlbookmail@gmail.com.
L11124: <!-- page 230 -->
L11125: 216
L11126: 12
L11127: Transformers
L11128: Figure 12.7 Transformer layer. The input consists of a D × N matrix containing
L11129: the D-dimensional word embeddings for each of the N input tokens. The output is
L11130: a matrix of the same size. The transformer layer consists of a series of operations.
L11131: First, there is a multi-head attention block, allowing the word embeddings to
L11132: interact with one another. This forms the processing of a residual block, so the
L11133: inputs are added back to the output. Second, a LayerNorm operation is applied
L11134: separately to each embedding. Third, there is a second residual layer where the
L11135: same fully connected neural network is applied separately to each of the N word
L11136: representations (columns). Finally, LayerNorm is applied again.
L11137: other) followed by a fully connected network mlp[x•] (that operates separately on each
L11138: word). Both units are residual networks (i.e., their output is added back to the original
L11139: input).
L11140: In addition, it is typical to add a LayerNorm operation after both the self-
L11141: attention and fully connected networks. This is similar to BatchNorm but normalizes
L11142: each embedding in each batch element separately using statistics calculated across its
L11143: D embedding dimensions (section 11.4 and figure 11.14). The complete layer can be
L11144: described by the following series of operations (figure 12.7):
L11145: X
L11146: ←
L11147: X + MhSa[X]
L11148: X
L11149: ←
L11150: LayerNorm[X]
L11151: xn
L11152: ←
L11153: xn + mlp[xn]
L11154: ∀n ∈{1, . . . , N}
L11155: X
L11156: ←
L11157: LayerNorm[X],
L11158: (12.13)
L11159: where the column vectors xn are separately taken from the full data matrix X. In a real
L11160: network, the data passes through a series of these transformer layers.
L11161: 12.5
L11162: Transformers for natural language processing
L11163: The previous section described the transformer layer. This section describes how it is
L11164: used in natural language processing (NLP) tasks. A typical NLP pipeline starts with a
L11165: tokenizer that splits the text into words or word fragments. Then each of these tokens
L11166: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L11169: <!-- page 231 -->
L11170: 12.5
L11171: Transformers for natural language processing
L11172: 217
L11173: Figure 12.8 Sub-word tokenization. a) A passage of text from a nursery rhyme.
L11174: The tokens are initially just the characters and whitespace (represented by an
L11175: underscore), and their frequencies are displayed in the table. b) At each iteration,
L11176: the sub-word tokenizer looks for the most commonly occurring adjacent pair of
L11177: tokens (in this case, se) and merges them. This creates a new token and decreases
L11178: the counts for the original tokens s and e. Note that the last character of the first
L11179: token to be merged cannot be whitespace, which prevents merging across words.
L11180: c) At the second iteration, the algorithm merges e and the whitespace character_.
L11181: d) After 23 iterations, the tokens consist of a mix of letters, word fragments, and
L11182: commonly occurring words. e) If we continue this process indefinitely, the tokens
L11183: eventually represent the full words. f) Over time, the number of tokens increases
L11184: as we add word fragments to the letters and then decreases again as we merge
L11185: these fragments. In a real situation, there would be a very large number of words,
L11186: and the algorithm would terminate when the vocabulary size (number of tokens)
L11187: reached a predetermined value. Punctuation and capital letters would also be
L11188: treated as separate input characters.
L11189: Draft: please send errata to udlbookmail@gmail.com.
L11192: <!-- page 232 -->
L11193: 218
L11194: 12
L11195: Transformers
L11196: is mapped to a learned embedding. These embeddings are passed through a series of
L11197: transformer layers. We now consider each of these stages in turn.
L11198: 12.5.1
L11199: Tokenization
L11200: A text processing pipeline begins with a tokenizer.
L11201: This splits the text into smaller
L11202: constituent units (tokens) from a vocabulary of possible tokens. In the discussion above,
L11203: we have implied that these tokens represent words, but there are several diﬀiculties.
L11204: • Inevitably, some words (e.g., names) will not be in the vocabulary.
L11205: • It’s unclear how to handle punctuation, but this is important. If a sentence ends
L11206: in a question mark, we must encode this information.
L11207: • The vocabulary would need different tokens for versions of the same word with
L11208: different suﬀixes (e.g., walk, walks, walked, walking), and there is no way to clarify
L11209: that these variations are related.
L11210: One approach would be to use letters and punctuation marks as the vocabulary, but this
L11211: would mean splitting text into very small parts and requiring the subsequent network to
L11212: re-learn the relations between them.
L11213: In practice, a compromise between letters and full words is used, and the final vo-
L11214: Notebook 12.3
L11215: Tokenization
L11216: cabulary includes both common words and word fragments from which larger and less
L11217: frequent words can be composed. The vocabulary is computed using a sub-word tok-
L11218: enizer such as byte pair encoding (figure 12.8) that greedily merges commonly occurring
L11219: sub-strings based on their frequency.
L11220: 12.5.2
L11221: Embeddings
L11222: Each token in the vocabulary V is mapped to a unique word embedding, and the embed-
L11223: dings for the whole vocabulary are stored in a matrix Ωe ∈RD×|V|. To accomplish this,
L11224: the N input tokens are first encoded in the matrix T ∈R|V|×N, where the nth column
L11225: corresponds to the nth token and is a |V| × 1 one-hot vector (i.e., a vector where every
L11226: entry is zero except for the entry corresponding to the token, which is set to one). The
L11227: input embeddings are computed as X = ΩeT, and Ωe is learned like any other network
L11228: parameter (figure 12.9). A typical embedding size D is 1024, and a typical total vocab-
L11229: ulary size |V| is 30,000, so even before the main network, there are many parameters
L11230: in Ωe to learn.
L11231: 12.5.3
L11232: Transformer model
L11233: Finally, the embedding matrix X representing the text is passed through a series of K
L11234: transformer layers, called a transformer model. There are three types of transformer
L11235: models.
L11236: An encoder transforms the text embeddings into a representation that can
L11237: support a variety of tasks.
L11238: A decoder predicts the next token to continue the input
L11239: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L11242: <!-- page 233 -->
L11243: 12.6
L11244: Encoder model example: BERT
L11245: 219
L11246: Figure 12.9 The input embedding matrix X ∈RD×N contains N embeddings of
L11247: length D and is created by multiplying a matrix Ωe containing the embeddings
L11248: for the entire vocabulary with a matrix containing one-hot vectors in its columns
L11249: that correspond to the word or sub-word indices. The vocabulary matrix Ωe is
L11250: considered a parameter of the model and is learned along with the other param-
L11251: eters. Note that the two embeddings for the word an in X are the same.
L11252: text. Encoder-decoders are used in sequence-to-sequence tasks, where one text string is
L11253: converted into another (e.g., machine translation). These variations are described in
L11254: sections 12.6–12.8, respectively.
L11255: 12.6
L11256: Encoder model example: BERT
L11257: BERT is an encoder model that uses a vocabulary of 30,000 tokens. Input tokens are
L11258: converted to 1024-dimensional word embeddings and passed through 24 transformer
L11259: layers. Each contains a self-attention mechanism with 16 heads. The queries, keys, and
L11260: values for each head are of dimension 64 (i.e., the matrices Ωvh, Ωqh, Ωkh are 64×1024).
L11261: The dimension of the single hidden layer in the fully connected networks is 4096. The
L11262: total number of parameters is ∼340 million. When BERT was introduced, this was
L11263: considered large, but it is now much smaller than state-of-the-art models.
L11264: Encoder models like BERT exploit transfer learning (section 9.3.6).
L11265: During pre-
L11266: training, the parameters of the transformer architecture are learned using self-supervision
L11267: from a large corpus of text. The goal here is for the model to learn general information
L11268: about the statistics of language. In the fine-tuning stage, the resulting network is adapted
L11269: to solve a particular task using a smaller body of labelled training data.
L11270: Draft: please send errata to udlbookmail@gmail.com.
L11273: <!-- page 234 -->
L11274: 220
L11275: 12
L11276: Transformers
L11277: Figure 12.10 Pre-training for BERT-like encoder. The input tokens (and a spe-
L11278: cial <cls> token denoting the start of the sequence) are converted to word em-
L11279: beddings. Here, these are represented as rows rather than columns, so the box
L11280: labeled “word embeddings” is XT . These embeddings are passed through a se-
L11281: ries of transformer layers (orange connections indicate that every token attends
L11282: to every other token in these layers) to create a set of output embeddings. A
L11283: small fraction of the input tokens are randomly replaced with a generic <mask>
L11284: token. In pre-training, the goal is to predict the missing word from the associated
L11285: output embedding. To this end, the outputs corresponding to the masked tokens
L11286: are passed through softmax functions, and a multiclass classification loss (sec-
L11287: tion 5.24) is applied to each. This task has the advantage that it uses both the
L11288: left and right context to predict the missing word but has the disadvantage that
L11289: it does not make eﬀicient use of data; here, seven tokens need to be processed to
L11290: add two terms to the loss function.
L11291: 12.6.1
L11292: Pre-training
L11293: In the pre-training stage, the network is trained using self-supervision. This allows the
L11294: use of enormous amounts of data without the need for manual labels. For BERT, the self-
L11295: supervision task consists of predicting missing words from sentences from a large internet
L11296: Problem 12.6
L11297: corpus (figure 12.10).1 During training, the maximum input length is 512 tokens, and
L11298: the batch size is 256. The system is trained for a million steps, corresponding to roughly
L11299: 50 epochs of the 3.3-billion word corpus.
L11300: Predicting missing words forces the transformer network to understand some syntax.
L11301: For example, it might learn that the adjective red is often found before nouns like house
L11302: or car but never before a verb like shout. It also allows the model to learn superficial
L11303: common sense about the world. For example, after training, the model will assign a
L11304: higher probability to the missing word train in the sentence The <mask> pulled into
L11305: the station than it would to the word peanut. However, the degree of “understanding”
L11306: this type of model can ever have is limited.
L11307: 1BERT also uses a secondary task that predicts whether two sentences were originally adjacent in
L11308: the text or not, but this only marginally improves performance.
L11309: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L11312: <!-- page 235 -->
L11313: 12.6
L11314: Encoder model example: BERT
L11315: 221
L11316: Figure 12.11 After pre-training, the encoder is fine-tuned using manually labeled
L11317: data to solve a particular task. Usually, a linear transformation or a multi-layer
L11318: perceptron (MLP) is appended to the encoder to produce whatever output is
L11319: required.
L11320: a) Example text classification task.
L11321: In this sentiment classification
L11322: task, the <cls> token embedding is used to predict the probability that the
L11323: review is positive.
L11324: b) Example word classification task.
L11325: In this named entity
L11326: recognition problem, the embedding for each word is used to predict whether the
L11327: word corresponds to a person, place, or organization, or is not an entity.
L11328: 12.6.2
L11329: Fine-tuning
L11330: In the fine-tuning stage, the model parameters are adjusted to specialize the network to
L11331: a particular task. An extra layer is appended onto the transformer network to convert
L11332: the output vectors to the desired output format. Examples include:
L11333: Text classification:
L11334: In BERT, a special token known as the classification or <cls>
L11335: token is placed at the start of each string during pre-training. For text classification
L11336: tasks like sentiment analysis (in which the passage is labeled as having a positive or
L11337: negative emotional tone), the vector associated with the <cls> token is mapped to a
L11338: single number and passed through a logistic sigmoid (figure 12.11a). This contributes to
L11339: a standard binary cross-entropy loss (section 5.4).
L11340: Draft: please send errata to udlbookmail@gmail.com.
L11343: <!-- page 236 -->
L11344: 222
L11345: 12
L11346: Transformers
L11347: Word classification:
L11348: The goal of named entity recognition is to classify each word as
L11349: an entity type (e.g., person, place, organization, or no-entity). To this end, each input
L11350: embedding xn is mapped to an E × 1 vector where the E entries correspond to the E
L11351: entity types. This is passed through a softmax function to create probabilities for each
L11352: class, which contribute to a multiclass cross-entropy loss (figure 12.11b).
L11353: Text span prediction:
L11354: In the SQuAD 1.1 question answering task, the question and a
L11355: passage from Wikipedia containing the answer are concatenated and tokenized. BERT
L11356: is then used to predict the text span in the passage that contains the answer. Each
L11357: token maps to two numbers indicating how likely it is that the text span begins and
L11358: ends at this location. The resulting two sets of numbers are put through two softmax
L11359: functions. The likelihood of any text span being the answer can be derived by combining
L11360: the probability of starting and ending at the appropriate places.
L11361: 12.7
L11362: Decoder model example: GPT3
L11363: This section presents a high-level description of GPT3, an example of a decoder model.
L11364: The basic architecture is extremely similar to the encoder model and comprises a series
L11365: of transformer layers that operate on learned word embeddings. However, the goal is
L11366: different. The encoder aimed to build a representation of the text that could be fine-
L11367: tuned to solve a variety of more specific NLP tasks. Conversely, the decoder has one
L11368: purpose: to generate the next token in a sequence.
L11369: It can generate a coherent text
L11370: passage by feeding the extended sequence back into the model.
L11371: 12.7.1
L11372: Language modeling
L11373: GPT3 is an autoregressive language model. This is easiest to understand with a concrete
L11374: example. Consider the sentence It takes great courage to let yourself appear weak. For
L11375: simplicity, let’s assume that the tokens are the full words. The probability of the full
L11376: sentence can be factored as:
L11377: Pr(It takes great courage to let yourself appear weak)
L11378: =
L11379: Pr(It) × Pr(takes|It) × Pr(great|It takes) × Pr(courage|It takes great) ×
L11380: Pr(to|It takes great courage) × Pr(let|It takes great courage to) ×
L11381: Pr(yourself|It takes great courage to let) ×
L11382: Pr(appear|It takes great courage to let yourself) ×
L11383: Pr(weak|It takes great courage to let yourself appear).
L11384: (12.14)
L11385: An autoregressive model predicts the conditional distributions Pr(tn|t1, . . . , tn−1) of
L11386: each token given all the prior tokens, and hence indirectly computes the joint proba-
L11387: bility Pr(t1, t2, . . . , tN) of all N tokens:
L11388: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L11391: <!-- page 237 -->
L11392: 12.7
L11393: Decoder model example: GPT3
L11394: 223
L11395: Pr(t1, t2, . . . , tN) = Pr(t1)
L11396: N
L11397: Y
L11398: n=2
L11399: Pr(tn|t1, . . . , tn−1).
L11400: (12.15)
L11401: The autoregressive formulation demonstrates the connection between maximizing the
L11402: joint probability of the tokens and the next token prediction task.
L11403: 12.7.2
L11404: Masked self-attention
L11405: To train a decoder, we seek parameters that maximize the log probability of the input
L11406: text under the autoregressive model (i.e., that maximize the sum of the log conditional
L11407: probability terms). Ideally, we would pass in the whole sentence and compute all the
L11408: log probabilities and gradients in the same forward pass rather than doing a forward
L11409: pass for each token in the sentence. However, if we pass in the full sentence, the term
L11410: computing log [Pr(great|It takes)] would have access to both the answer great and the
L11411: right context courage to let yourself appear weak. Hence, the system can cheat rather
L11412: than learn to predict the following words and won’t train properly.
L11413: Fortunately, the tokens only interact in the self-attention layers in a transformer
L11414: network.
L11415: Hence, the problem can be resolved by ensuring that the attention to the
L11416: answer and the right context is zero. This can be achieved by setting the corresponding
L11417: dot products in the self-attention computation (equation 12.5) to negative infinity before
L11418: they are passed through the softmax[•] function. This is known as masked self-attention.
L11419: The effect is to make the weight of all the upward-angled arrows in figure 12.1 zero.
L11420: The entire decoder network operates as follows. The input text is tokenized, and the
L11421: tokens are converted to embeddings. The embeddings are passed into the transformer
L11422: network, but now the transformer layers use masked self-attention so that they can
L11423: only attend to the current and previous tokens. Each of the output embeddings can be
L11424: thought of as representing a partial sentence, and for each, the goal is to predict the next
L11425: token in the sequence. Consequently, after the transformer layers, a single linear layer
L11426: maps each output embedding to the size of the vocabulary, followed by a softmax[•]
L11427: function that converts these values to probabilities. During training, we aim to maximize
L11428: the sum of the log probabilities of the next token in the ground truth sequence at every
L11429: position using a standard multiclass cross-entropy loss (figure 12.12).
L11430: 12.7.3
L11431: Generating text from a decoder
L11432: The autoregressive language model is the first example of a generative model discussed
L11433: in this book. Since it defines a probability model over text sequences, it can be used
L11434: to sample new examples of plausible text. To generate from the model, we start with
L11435: an input sequence of text (which might be just the special <start> token indicating
L11436: the beginning of the sequence) and feed this into the network, which then outputs the
L11437: probabilities over possible subsequent tokens. We can then either pick the most likely
L11438: token or sample from this probability distribution. The new extended sequence can be
L11439: fed back into the decoder network to yield the probability distribution over the next
L11440: Draft: please send errata to udlbookmail@gmail.com.
L11443: <!-- page 238 -->
L11444: 224
L11445: 12
L11446: Transformers
L11447: Figure 12.12 Training GPT3-type decoder network. The tokens are mapped to
L11448: word embeddings with a special <start> token at the beginning of the sequence.
L11449: The embeddings are passed through a series of transformer layers that use masked
L11450: self-attention.
L11451: Here, each position in the sentence can only attend to its own
L11452: embedding and those of tokens earlier in the sequence (orange connections). The
L11453: goal at each position is to maximize the probability of the following ground truth
L11454: token in the sequence. In other words, at position one, we want to maximize the
L11455: probability of the token It; at position two, we want to maximize the probability
L11456: of the token takes; and so on. Masked self-attention ensures the system cannot
L11457: cheat by looking at subsequent inputs. The autoregressive task has the advantage
L11458: of making eﬀicient use of the data since every word contributes a term to the loss
L11459: function. However, it only exploits the left context of each word.
L11460: token. By repeating this process, we can generate large bodies of text. The computation
L11461: can be made quite eﬀicient as prior embeddings do not depend on subsequent ones due
L11462: to the masked self-attention. Hence, much of the earlier computation can be recycled as
L11463: Problem 12.7
L11464: we generate subsequent tokens.
L11465: In practice, many strategies can make the output text more coherent. For example,
L11466: Notebook 12.4
L11467: Decoding
L11468: strategies
L11469: beam search keeps track of multiple possible sentence completions to find the overall most
L11470: likely sequence of words (which is not necessarily found by greedily choosing the most
L11471: likely word at each step). Top-k sampling randomly draws the next word from only the
L11472: top-K most likely possibilities to prevent the system from accidentally choosing from the
L11473: long tail of low-probability tokens and leading to an unnecessary linguistic dead end.
L11474: 12.7.4
L11475: GPT3 and few-shot learning
L11476: Large language models like GPT3 apply these ideas on a massive scale. In GPT3, the
L11477: sequence lengths are 2048 tokens long, and the total batch size is 3.2 million tokens.
L11478: There are 96 transformer layers (some of which implement a sparse version of attention),
L11479: each processing a word embedding of size 12288. There are 96 heads in the self-attention
L11480: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L11483: <!-- page 239 -->
L11484: 12.7
L11485: Decoder model example: GPT3
L11486: 225
L11487: layers, and the value, query, and key dimension is 128. It is trained with 300 billion
L11488: tokens and contains 175 billion parameters.
L11489: Here’s an example of completing text from the GPT3 model where the text provided
L11490: to the model is in orange, and the generated text is in cyan:
L11491: Understanding Deep Learning is a new textbook from MIT Press by Simon Prince that’s de-
L11492: signed to offer an accessible, broad introduction to the field.
L11493: Deep learning is a branch of
L11494: machine learning that is concerned with algorithms that learn from data that is unstructured
L11495: or unlabeled. The book is divided into four sections:
L11496: 1. Introduction to deep learning
L11497: 2. Deep learning architecture
L11498: 3. Deep learning algorithms
L11499: 4. Applications of deep learning
L11500: The first section offers an introduction to deep learning, including its history and origins.
L11501: The second section covers deep learning architecture, discussing various types of neural net-
L11502: works and their applications. The third section dives into deep learning algorithms, including
L11503: supervised and unsupervised learning, reinforcement learning, and more. The fourth section
L11504: applies deep learning to various domains, such as computer vision, natural language processing,
L11505: and robotics.
L11506: This continuation is plausible, albeit only partially accurate.
L11507: One surprising property of learning models on this scale is that they can perform many
L11508: tasks without fine-tuning. If we provide several examples of correct question/answer pairs
L11509: and then another question, they often answer the final question correctly by completing
L11510: the sequence. One example is correcting English grammar:
L11511: Poor English input: I eated the purple berries.
L11512: Good English output: I ate the purple berries.
L11513: Poor English input: Thank you for picking me as your designer. I’d appreciate it.
L11514: Good English output: Thank you for choosing me as your designer. I appreciate it.
L11515: Poor English input: The mentioned changes have done. or I did the alteration that you
L11516: requested. or I changed things you wanted and did the modifications.
L11517: Good English output: The requested changes have been made. or I made the alteration that
L11518: you requested. or I changed things you wanted and made the modifications.
L11519: Poor English input: I’d be more than happy to work with you in another project.
L11520: Good English output: I’d be more than happy to work with you on another project.
L11521: (result from Brown et al., 2020)
L11522: Here, the text containing the paired examples in orange was provided as context for
L11523: GPT3, and the system then generated the correct answer in cyan. This phenomenon
L11524: extends to many situations, including generating code snippets based on natural language
L11525: descriptions, arithmetic, translating between languages, and answering questions about
L11526: text passages. Consequently, it is argued that enormous language models are few-shot
L11527: learners; they can learn to do novel tasks based on just a few examples.
L11528: However,
L11529: performance is erratic in practice, and the extent to which it is extrapolating from
L11530: learned examples rather than merely interpolating or copying verbatim is unclear.
L11531: Draft: please send errata to udlbookmail@gmail.com.
L11534: <!-- page 240 -->
L11535: 226
L11536: 12
L11537: Transformers
L11538: Figure 12.13 Encoder-decoder architecture.
L11539: Two sentences are passed to the
L11540: system with the goal of translating the first into the second. a) The first sentence
L11541: is passed through a standard encoder. b) The second sentence is passed through a
L11542: decoder that uses masked self-attention but also attends to the output embeddings
L11543: of the encoder using cross-attention (orange rectangle). The loss function is the
L11544: same as for the decoder model; we want to maximize the probability of the next
L11545: word in the output sequence.
L11546: 12.8
L11547: Encoder-decoder model example: machine translation
L11548: Translation between languages is an example of a sequence-to-sequence task. One com-
L11549: mon approach uses both an encoder (to compute a good representation of the source
L11550: sentence) and a decoder (to generate the sentence in the target language). This is aptly
L11551: called an encoder-decoder model.
L11552: Consider translating from English to French.
L11553: The encoder receives the sentence
L11554: in English and processes it through a series of transformer layers to create an output
L11555: representation for each token. During training, the decoder receives the ground truth
L11556: translation in French and passes it through a series of transformer layers that use masked
L11557: self-attention and predict the following word at each position. However, the decoder
L11558: layers also attend to the output of the encoder. Consequently, each French output word is
L11559: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L11562: <!-- page 241 -->
L11563: 12.9
L11564: Transformers for long sequences
L11565: 227
L11566: Figure 12.14 Cross-attention. The flow of computation is the same as in standard
L11567: self-attention, but the queries are calculated from the decoder embeddings Xdec,
L11568: and the keys and values from the encoder embeddings Xenc.
L11569: For translation
L11570: tasks, the encoder contains information about the source language statistics, and
L11571: the decoder contains information about the target language statistics.
L11572: conditioned on the previous output words and the source English sentence (figure 12.13).
L11573: This is achieved by modifying the transformer layers in the decoder.
L11574: Originally,
L11575: these consisted of a masked self-attention layer followed by a neural network applied
L11576: individually to each embedding (figure 12.12). A new self-attention layer is added be-
L11577: tween these two components, in which the decoder embeddings attend to the encoder
L11578: embeddings. This uses a version of self-attention known as encoder-decoder attention or
L11579: cross-attention, where the queries are computed from the decoder embeddings and the
L11580: keys and values from the encoder embeddings (figure 12.14).
L11581: 12.9
L11582: Transformers for long sequences
L11583: Since each token in a transformer encoder model interacts with every other token, the
L11584: computational complexity scales quadratically with the length of the sequence. For a
L11585: decoder model, each token only interacts with previous tokens, so there are roughly
L11586: half the number of interactions, but the complexity still scales quadratically.
L11587: These
L11588: relationships can be visualized as interaction matrices (figure 12.15a–b).
L11589: This quadratic increase in the amount of computation ultimately limits the length of
L11590: sequences that can be used. Many methods have been developed to extend the trans-
L11591: Draft: please send errata to udlbookmail@gmail.com.
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
