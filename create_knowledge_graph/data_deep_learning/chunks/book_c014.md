L08878: <!-- page 179 -->
L08879: 10.2
L08880: Convolutional networks for 1D inputs
L08881: 165
L08882: distinguished by their stride, kernel size, and dilation rate. When we evaluate the output
L08883: at every position, we term this a stride of one. However, it is also possible to shift the
L08884: kernel by a stride greater than one. If we have a stride of two, we create roughly half
L08885: the number of outputs (figure 10.3a–b).
L08886: The kernel size can be increased to integrate over a larger area (figure 10.3c). How-
L08887: ever, it typically remains an odd number so that it can be centered around the current
L08888: position. Increasing the kernel size has the disadvantage of requiring more weights. This
L08889: leads to the idea of dilated or atrous convolutions, in which the kernel values are inter-
L08890: spersed with zeros. For example, we can turn a kernel of size five into a dilated kernel of
L08891: size three by setting the second and fourth elements to zero. We still integrate informa-
L08892: Problems 10.2–10.4
L08893: tion from a larger input region but only require three weights to do this (figure 10.3d).
L08894: The dilation rate is the number of zeros interspersed between the weights plus one.
L08895: 10.2.4
L08896: Convolutional layers
L08897: A convolutional layer computes its output by convolving the input, adding a bias β, and
L08898: passing each result through an activation function a[•]. With kernel size three, stride
L08899: one, and dilation rate one, the ith hidden unit hi would be computed as:
L08900: hi
L08901: =
L08902: a [β + ω1xi−1 + ω2xi + ω3xi+1]
L08903: =
L08904: a
L08905: 
L08906: β +
L08907: 3
L08908: X
L08909: j=1
L08910: ωjxi+j−2
L08911: 
L08912: ,
L08913: (10.4)
L08914: where the bias β and kernel weights ω1, ω2, ω3 are trainable parameters, and (with zero-
L08915: padding) we treat the input x as zero when it is out of the valid range. This is a special
L08916: case of a fully connected layer that computes the ith hidden unit as:
L08917: hi
L08918: =
L08919: a
L08920: 
L08921: βi +
L08922: D
L08923: X
L08924: j=1
L08925: ωijxj
L08926: 
L08927: .
L08928: (10.5)
L08929: If there are D inputs x• and D hidden units h•, this fully connected layer would have D2
L08930: weights ω•• and D biases β•. The convolutional layer only uses three weights and one
L08931: bias. A fully connected layer can reproduce this exactly if most weights are set to zero
L08932: Problem 10.5
L08933: and others are constrained to be identical (figure 10.4).
L08934: 10.2.5
L08935: Channels
L08936: If we only apply a single convolution, information will likely be lost; we are averaging
L08937: nearby inputs, and the ReLU activation function clips results that are less than zero.
L08938: Hence, it is usual to compute several convolutions in parallel. Each convolution produces
L08939: a new set of hidden variables, termed a feature map or channel.
L08940: Draft: please send errata to udlbookmail@gmail.com.
L08943: <!-- page 180 -->
L08944: 166
L08945: 10
L08946: Convolutional networks
L08947: Figure 10.4 Fully connected vs. convolutional layers. a) A fully connected layer
L08948: has a weight connecting each input x to each hidden unit h (colored arrows)
L08949: and a bias for each hidden unit (not shown). b) Hence, the associated weight
L08950: matrix Ωcontains 36 weights relating the six inputs to the six hidden units. c) A
L08951: convolutional layer with kernel size three computes each hidden unit as the same
L08952: weighted sum of the three neighboring inputs (arrows) plus a bias (not shown).
L08953: d) The weight matrix is a special case of the fully connected matrix where many
L08954: weights are zero and others are repeated (same colors indicate same value, white
L08955: indicates zero weight). e) A convolutional layer with kernel size three and stride
L08956: two computes a weighted sum at every other position. f) This is also a special
L08957: case of a fully connected network with a different sparse weight structure.
L08958: Figure 10.5 Channels. Typically, multiple convolutions are applied to the input x
L08959: and stored in channels. a) A convolution is applied to create hidden units h1
L08960: to h6, which form the first channel. b) A second convolution operation is applied
L08961: to create hidden units h7 to h12, which form the second channel. The channels
L08962: are stored in a 2D array H1 that contains all the hidden units in the first hidden
L08963: layer. c) If we add a further convolutional layer, there are now two channels at
L08964: each input position. Here, the 1D convolution defines a weighted sum over both
L08965: input channels at the three closest positions to create each new output channel.
L08966: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L08969: <!-- page 181 -->
L08970: 10.2
L08971: Convolutional networks for 1D inputs
L08972: 167
L08973: Figure 10.5a–b illustrates this with two convolution kernels of size three and with
L08974: zero-padding. The first kernel computes a weighted sum of the nearest three pixels, adds
L08975: a bias, and passes the results through the activation function to produce hidden units h1
L08976: to h6. These comprise the first channel. The second kernel computes a different weighted
L08977: sum of the nearest three pixels, adds a different bias, and passes the results through the
L08978: activation function to create hidden units h7 to h12. These comprise the second channel.
L08979: In general, the input and the hidden layers all have multiple channels (figure 10.5c). If
L08980: the incoming layer has Ci channels and we select a kernel size K per channel, the hidden
L08981: Problems 10.6–10.8
L08982: Notebook 10.1
L08983: 1D convolution
L08984: units in each output channel are computed as a weighted sum over all Ci channels and K
L08985: kernel entries using a weight matrix Ω∈RCi×K and one bias. Hence, if there are Co
L08986: channels in the next layer, then we need Ω∈RCi×Co×K weights and β ∈RCo biases.
L08987: 10.2.6
L08988: Convolutional networks and receptive fields
L08989: Chapter 4 described deep networks, which consisted of a sequence of fully connected
L08990: layers. Similarly, convolutional networks comprise a sequence of convolutional layers.
L08991: The receptive field of a hidden unit in the network is the region of the original input that
L08992: feeds into it. Consider a convolutional network where each convolutional layer has kernel
L08993: size three. The hidden units in the first layer take a weighted sum of the three closest
L08994: inputs, so have receptive fields of size three. The units in the second layer take a weighted
L08995: sum of the three closest positions in the first layer, which are themselves weighted sums
L08996: of three inputs. Hence, the hidden units in the second layer have a receptive field of size
L08997: five. In this way, the receptive field of units in successive layers increases, and information
L08998: from across the input is gradually integrated (figure 10.6).
L08999: Problems 10.9–10.11
L09000: 10.2.7
L09001: Example: MNIST-1D
L09002: We now apply a convolutional network to the MNIST-1D data (see figure 8.1). The
L09003: input x is a 40D vector, and the output f is a 10D vector that is passed through a
L09004: softmax layer to produce class probabilities. We use a network with three hidden layers
L09005: (figure 10.7). The fifteen channels of the first hidden layer H1 are each computed using
L09006: a kernel size of three and a stride of two with “valid” padding, giving nineteen spatial
L09007: positions. The second hidden layer H2 is also computed using a kernel size of three, a
L09008: stride of two, and “valid” padding. The third hidden layer is computed similarly. At this
L09009: stage, the representation has four spatial positions and fifteen channels. These values
L09010: are reshaped into a vector of size sixty, which is mapped by a fully connected layer to
L09011: the ten output activations.
L09012: This network was trained for 100,000 steps using SGD without momentum, a learning
L09013: rate of 0.01, and a batch size of 100 on a dataset of 4,000 examples. We compare this to
L09014: Problem 10.12
L09015: a fully connected network with the same number of layers and hidden units (i.e., three
L09016: hidden layers with 285, 135, and 60 hidden units, respectively). The convolutional net-
L09017: work has 2,050 parameters, and the fully connected network has 59,065 parameters. By
L09018: the logic of figure 10.4, the convolutional network is a special case of the fully connected
L09019: Draft: please send errata to udlbookmail@gmail.com.
L09022: <!-- page 182 -->
L09023: 168
L09024: 10
L09025: Convolutional networks
L09026: Figure 10.6 Receptive fields for network with kernel width of three. a) An input
L09027: with eleven dimensions feeds into a hidden layer with three channels and convo-
L09028: lution kernel of size three. The pre-activations of the three highlighted hidden
L09029: units in the first hidden layer H1 are different weighted sums of the nearest three
L09030: inputs, so the receptive field in H1 has size three. b) The pre-activations of the
L09031: four highlighted hidden units in layer H2 each take a weighted sum of the three
L09032: channels in layer H1 at each of the three nearest positions. Each hidden unit in
L09033: layer H1 weights the nearest three input positions. Hence, hidden units in H2
L09034: have a receptive field size of five. c) The hidden units in the third layer (kernel
L09035: size three, stride two) increases the receptive field size to seven. d) By the time
L09036: we add a fourth layer, the receptive field of the hidden units at position three
L09037: have a receptive field that covers the entire input.
L09038: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L09041: <!-- page 183 -->
L09042: 10.2
L09043: Convolutional networks for 1D inputs
L09044: 169
L09045: Figure 10.7 Convolutional network for classifying MNIST-1D data (see figure 8.1).
L09046: The MNIST-1D input has dimension Di = 40. The first convolutional layer has
L09047: fifteen channels, kernel size three, stride two, and only retains “valid” positions to
L09048: make a hidden layer with nineteen positions and fifteen channels. The following
L09049: two convolutional layers have the same settings, gradually reducing the repre-
L09050: sentation size at each subsequent hidden layer. Finally, a fully connected layer
L09051: takes all sixty hidden units from the third hidden layer. It outputs ten activations
L09052: that are subsequently passed through a softmax layer to produce the ten class
L09053: probabilities.
L09054: Figure 10.8 MNIST-1D results. a) The convolutional network from figure 10.7
L09055: eventually fits the training data perfectly and has ∼17% test error. b) A fully
L09056: connected network with the same number of hidden layers and the number of
L09057: hidden units in each learns the training data faster but fails to generalize well with
L09058: ∼40% test error. The latter model can reproduce the convolutional model but
L09059: fails to do so. The convolutional structure restricts the possible mappings to those
L09060: that process every position similarly, and this restriction improves performance.
L09061: Draft: please send errata to udlbookmail@gmail.com.
L09064: <!-- page 184 -->
L09065: 170
L09066: 10
L09067: Convolutional networks
L09068: one. The latter has enough flexibility to replicate the former exactly. Figure 10.8 shows
L09069: Notebook 10.2
L09070: Convolution
L09071: for MNIST-1D
L09072: both models fit the training data perfectly. However, the test error for the convolutional
L09073: network is much less than for the fully connected network.
L09074: This discrepancy is probably not due to the difference in the number of parameters;
L09075: we know overparameterization usually improves performance (section 8.4.1). The likely
L09076: explanation is that the convolutional architecture has a superior inductive bias (i.e.,
L09077: interpolates between the training data better) because we have embodied some prior
L09078: knowledge in the architecture; we have forced the network to process each position in
L09079: the input in the same way. We know that the data were created by starting with a
L09080: template that is (among other operations) randomly translated, so this is sensible.
L09081: The fully connected network has to learn what each digit template looks like at every
L09082: position. In contrast, the convolutional network shares information across positions and
L09083: hence learns to identify each category more accurately. Another way of thinking about
L09084: this is that when we train the convolutional network, we search through a smaller family
L09085: of input/output mappings, all of which are plausible. Alternatively, the convolutional
L09086: structure can be considered a regularizer that applies an infinite penalty to most of the
L09087: solutions that a fully connected network can describe.
L09088: 10.3
L09089: Convolutional networks for 2D inputs
L09090: The previous section described convolutional networks for processing 1D data.
L09091: Such
L09092: networks can be applied to financial time series, audio, and text. However, convolutional
L09093: networks are more usually applied to 2D image data. The convolutional kernel is now
L09094: a 2D object. A 3×3 kernel Ω∈R3×3 applied to a 2D input comprising of elements xij
L09095: computes a single layer of hidden units hij as:
L09096: hij
L09097: =
L09098: a
L09099: "
L09100: β +
L09101: 3
L09102: X
L09103: m=1
L09104: 3
L09105: X
L09106: n=1
L09107: ωmnxi+m−2,j+n−2
L09108: #
L09109: ,
L09110: (10.6)
L09111: where ωmn are the entries of the convolutional kernel. This is simply a weighted sum
L09112: over a square 3×3 input region. The kernel is translated both horizontally and vertically
L09113: Problem 10.13
L09114: across the 2D input (figure 10.9) to create an output at each position.
L09115: Often the input is an RGB image, which is treated as a 2D signal with three channels
L09116: (figure 10.10). Here, a 3×3 kernel would have 3×3×3 weights and be applied to the
L09117: Notebook 10.3
L09118: 2D convolution
L09119: three input channels at each of the 3×3 positions to create a 2D output that is the same
L09120: height and width as the input image (assuming zero-padding). To generate multiple
L09121: Problem 10.14
L09122: output channels, we repeat this process with different kernel weights and append the
L09123: results to form a 3D tensor. If the kernel is size K ×K, and there are Ci input channels,
L09124: Appendix B.3
L09125: Tensors
L09126: each output channel is a weighted sum of Ci ×K ×K quantities plus one bias. It follows
L09127: that to compute Co output channels, we need Ci × Co × K × K weights and Co biases.
L09128: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L09131: <!-- page 185 -->
L09132: 10.4
L09133: Downsampling and upsampling
L09134: 171
L09135: Figure 10.9 2D convolutional layer. Each output hij computes a weighted sum of
L09136: the 3×3 nearest inputs, adds a bias, and passes the result through an activation
L09137: function. a) Here, the output h23 (shaded output) is a weighted sum of the nine
L09138: positions from x12 to x34 (shaded inputs). b) Different outputs are computed
L09139: by translating the kernel across the image grid in two dimensions. c–d) With
L09140: zero-padding, positions beyond the image’s edge are considered to be zero.
L09141: 10.4
L09142: Downsampling and upsampling
L09143: The network in figure 10.7 increased receptive field size by scaling down the representa-
L09144: tion at each layer using stride two convolutions. We now consider methods for scaling
L09145: down or downsampling 2D input representations. We also describe methods for scaling
L09146: them back up (upsampling), which is useful when the output is also an image. Finally,
L09147: we consider methods to change the number of channels between layers. This is helpful
L09148: when recombining representations from two branches of a network (chapter 11).
L09149: 10.4.1
L09150: Downsampling
L09151: There are three main approaches to scaling down a 2D representation. Here, we consider
L09152: the most common case of scaling down both dimensions by a factor of two. First, we
L09153: Draft: please send errata to udlbookmail@gmail.com.
L09156: <!-- page 186 -->
L09157: 172
L09158: 10
L09159: Convolutional networks
L09160: Figure 10.10 2D convolution applied to an image. The image is treated as a 2D
L09161: input with three channels corresponding to the red, green, and blue components.
L09162: With a 3×3 kernel, each pre-activation in the first hidden layer is computed by
L09163: pointwise multiplying the 3×3×3 kernel weights with the 3×3 RGB image patch
L09164: centered at the same position, summing, and adding the bias. To calculate all
L09165: the pre-activations in the hidden layer, we “slide” the kernel over the image in
L09166: both horizontal and vertical directions. The output is a 2D layer of hidden units.
L09167: To create multiple output channels, we would repeat this process with multiple
L09168: kernels, resulting in a 3D tensor of hidden units at hidden layer H1.
L09169: can sample every other position. When we use a stride of two, we effectively apply this
L09170: Problem 10.15
L09171: method simultaneously with the convolution operation (figure 10.11a).
L09172: Second, max pooling retains the maximum of the 2×2 input values (figure 10.11b).
L09173: This induces some invariance to translation; if the input is shifted by one pixel, many
L09174: of these maximum values remain the same. Finally, mean pooling or average pooling
L09175: averages the inputs.
L09176: For all approaches, we apply downsampling separately to each
L09177: channel, so the output has half the width and height but the same number of channels.
L09178: 10.4.2
L09179: Upsampling
L09180: The simplest way to scale up a network layer to double the resolution is to duplicate
L09181: all the channels at each spatial position four times (figure 10.12a). A second method
L09182: is max unpooling; this is used where we have previously used a max pooling operation
L09183: for downsampling, and we distribute the values to the positions they originated from
L09184: (figure 10.12b). A third approach uses bilinear interpolation to fill in the missing values
L09185: between the points where we have samples. (figure 10.12c).
L09186: A fourth approach is roughly analogous to downsampling using a stride of two. In
L09187: Notebook 10.4
L09188: Downsampling
L09189: & upsampling
L09190: that method, there were half as many outputs as inputs, and for kernel size three, each
L09191: output was a weighted sum of the three closest inputs (figure 10.13a). In transposed
L09192: convolution, this picture is reversed (figure 10.13c). There are twice as many outputs
L09193: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L09196: <!-- page 187 -->
L09197: 10.4
L09198: Downsampling and upsampling
L09199: 173
L09200: Figure 10.11 Methods for scaling down representation size (downsampling). a)
L09201: Sub-sampling. The original 4×4 representation (left) is reduced to size 2×2 (right)
L09202: by retaining every other input. Colors on the left indicate which inputs contribute
L09203: to the outputs on the right. This is effectively what happens with a kernel of stride
L09204: two, except that the intermediate values are never computed. b) Max pooling.
L09205: Each output comprises the maximum value of the corresponding 2×2 block. c)
L09206: Mean pooling. Each output is the mean of the values in the 2×2 block.
L09207: Figure 10.12 Methods for scaling up representation size (upsampling). a) The
L09208: simplest way to double the size of a 2D layer is to duplicate each input four
L09209: times. b) In networks where we have previously used a max pooling operation
L09210: (figure 10.11b), we can redistribute the values to the same positions they originally
L09211: came from (i.e., where the maxima were). This is known as max unpooling. c) A
L09212: third option is bilinear interpolation between the input values.
L09213: Figure 10.13 Transposed convolution in 1D. a) Downsampling with kernel size
L09214: three, stride two, and zero-padding.
L09215: Each output is a weighted sum of three
L09216: inputs (arrows indicate weights). b) This can be expressed by a weight matrix
L09217: (same color indicates shared weight). c) In transposed convolution, each input
L09218: contributes three values to the output layer, which has twice as many outputs as
L09219: inputs. d) The associated weight matrix is the transpose of that in panel (b).
L09220: Draft: please send errata to udlbookmail@gmail.com.
L09223: <!-- page 188 -->
L09224: 174
L09225: 10
L09226: Convolutional networks
L09227: as inputs, and each input contributes to three of the outputs. When we consider the
L09228: associated weight matrix of this upsampling mechanism (figure 10.13d), we see that it is
L09229: the transpose of the matrix for the downsampling mechanism (figure 10.13b).
L09230: 10.4.3
L09231: Changing the number of channels
L09232: Sometimes we want to change the number of channels between one hidden layer and the
L09233: next without further spatial pooling. This is usually so we can combine the representation
L09234: with another parallel computation (see chapter 11).
L09235: To accomplish this, we apply a
L09236: convolution with kernel size one.
L09237: Each element of the output layer is computed by
L09238: taking a weighted sum of all the channels at the same position (figure 10.14). We can
L09239: repeat this multiple times with different weights to generate as many output channels as
L09240: we need. The associated convolution weights have size 1 × 1 × Ci × Co. Hence, this is
L09241: known as 1×1 convolution. Combined with a bias and activation function, it is equivalent
L09242: to running the same fully connected network on the input channels at every position.
L09243: 10.5
L09244: Applications
L09245: We conclude by describing three computer vision applications. We describe convolu-
L09246: tional networks for image classification where the goal is to assign the image to one of a
L09247: predetermined set of categories. Then we consider object detection, where the goal is to
L09248: identify multiple objects in an image and find the bounding box around each. Finally,
L09249: we describe an early system for semantic segmentation where the goal is to assign a label
L09250: to each pixel according to which object is present.
L09251: 10.5.1
L09252: Image classification
L09253: Much of the pioneering work on deep learning in computer vision focused on image
L09254: classification using the ImageNet dataset (figure 10.15). This contains 1,281,167 training
L09255: images, 50,000 validation images, and 100,000 test images, and every image is labeled as
L09256: belonging to one of 1000 possible categories.
L09257: Most methods reshape the input images to a standard size; in a typical system,
L09258: the input x to the network is a 224×224 RGB image, and the output is a probability
L09259: distribution over the 1000 classes. The task is challenging; there are a large number
L09260: of classes, and they exhibit considerable variation (figure 10.15). In 2011, before deep
L09261: networks were applied, the state-of-the-art method classified the test images with ∼25%
L09262: errors for the correct class being in the top five suggestions. Five years later, the best
L09263: deep learning models eclipsed human performance.
L09264: In 2012, AlexNet was the first convolutional network to perform well on this task.
L09265: It consists of eight hidden layers with ReLU activation functions, of which the first
L09266: five are convolutional and the rest fully connected (figure 10.16). The network starts by
L09267: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L09270: <!-- page 189 -->
L09271: 10.5
L09272: Applications
L09273: 175
L09274: Figure 10.14 1×1 convolution. To change the number of channels without spatial
L09275: pooling, we apply a 1×1 kernel.
L09276: Each output channel is computed by taking
L09277: a weighted sum of all of the channels at the same position, adding a bias, and
L09278: passing through an activation function. Multiple output channels are created by
L09279: repeating this operation with different weights and biases.
L09280: Figure 10.15 Example ImageNet classification images. The model aims to assign
L09281: an input image to one of 1000 classes.
L09282: This task is challenging because the
L09283: images vary widely along different attributes (columns). These include rigidity
L09284: (monkey < canoe), number of instances in image (lizard < strawberry), clutter
L09285: (compass<steel drum), size (candle<spiderweb), texture (screwdriver<leopard),
L09286: distinctiveness of color (mug < red wine), and distinctiveness of shape (headland
L09287: < bell). Adapted from Russakovsky et al. (2015).
L09288: Draft: please send errata to udlbookmail@gmail.com.
L09291: <!-- page 190 -->
L09292: 176
L09293: 10
L09294: Convolutional networks
L09295: Figure 10.16 AlexNet (Krizhevsky et al.,
L09296: 2012).
L09297: The network maps a 224 × 224
L09298: color image to a 1000-dimensional vec-
L09299: tor representing class probabilities. The
L09300: network first convolves with 11×11 ker-
L09301: nels and stride 4 to create 96 channels.
L09302: It decreases the resolution again using a
L09303: max pool operation and applies a 5×5
L09304: convolutional layer. Another max pool-
L09305: ing layer follows, and three 3×3 convo-
L09306: lutional layers are applied.
L09307: After a fi-
L09308: nal max pooling operation, the result
L09309: is vectorized and passed through three
L09310: fully connected (FC) layers and finally
L09311: the softmax layer.
L09312: downsampling the input using an 11×11 kernel with a stride of four to create 96 channels.
L09313: It then downsamples again using a max pooling layer before applying a 5×5 kernel to
L09314: create 256 channels. There are three more convolutional layers with kernel size 3×3,
L09315: Problems 10.16–10.17
L09316: eventually resulting in a 13×13 representation with 256 channels. A final max-pooling
L09317: layer yields a 6×6 representation with 256 channels which is resized into a vector of
L09318: length 9, 216 and passed through three fully connected layers containing 4096, 4096, and
L09319: 1000 hidden units, respectively. The last layer is passed through the softmax function to
L09320: output a probability distribution over the 1000 classes. The complete network contains
L09321: ∼60 million parameters, most of which are in the fully connected layers.
L09322: The dataset size was augmented by a factor of 2048 using (i) spatial transformations
L09323: Notebook 10.5
L09324: Convolution
L09325: for MNIST
L09326: and (ii) modifications of the input intensities. At test time, five different cropped and
L09327: mirrored versions of the image were run through the network, and their predictions
L09328: averaged. The system was learned using SGD with a momentum coeﬀicient of 0.9 and a
L09329: batch size of 128. Dropout was applied in the fully connected layers, and an L2 (weight
L09330: decay) regularizer was used. This system achieved a 16.4% top-5 error rate and a 38.1%
L09331: top-1 error rate. At the time, this was an enormous leap forward in performance at a task
L09332: considered far beyond the capabilities of contemporary methods. This result revealed
L09333: the potential of deep learning and kick-started the modern era of AI research.
L09334: The VGG network was also targeted at classification in the ImageNet task and
L09335: achieved a considerably better performance of 6.8% top-5 error rate and a 23.7% top-1
L09336: error rate. This network is similarly composed of a series of interspersed convolutional
L09337: and max pooling layers, where the spatial size of the representation gradually decreases,
L09338: but the number of channels increase. These are followed by three fully connected layers
L09339: (figure 10.17). The VGG network was also trained using data augmentation, weight
L09340: decay, and dropout.
L09341: Although there were various minor differences in the training regime, the most impor-
L09342: tant change between AlexNet and VGG was the depth of the network. The latter used
L09343: Problem 10.18
L09344: 19 hidden layers and 144 million parameters. The networks in figures 10.16 and 10.17
L09345: are depicted at the same scale for comparison. There was a general trend for several
L09346: years for performance on this task to improve as the depth of the networks increased,
L09347: and this is evidence that depth is important in neural networks.
L09348: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L09351: <!-- page 191 -->
L09352: 10.5
L09353: Applications
L09354: 177
L09355: Figure 10.17 VGG network (Simonyan & Zisserman, 2014) depicted at the same
L09356: scale as AlexNet (see figure 10.16). This network consists of a series of convolu-
L09357: tional layers and max pooling operations, in which the spatial scale of the rep-
L09358: resentation gradually decreases, but the number of channels gradually increases.
L09359: The hidden layer after the last convolutional operation is resized to a 1D vector
L09360: and three fully connected layers follow. The network outputs 1000 activations
L09361: corresponding to the class labels that are passed through a softmax function to
L09362: create class probabilities.
L09363: 10.5.2
L09364: Object detection
L09365: In object detection, the goal is to identify and localize multiple objects within the image.
L09366: An early method based on convolutional networks was You Only Look Once, or YOLO
L09367: for short. The input to the YOLO network is a 448×448 RGB image. This is passed
L09368: through 24 convolutional layers that gradually decrease the representation size using
L09369: max pooling operations while concurrently increasing the number of channels, similarly
L09370: to the VGG network. The final convolutional layer is of size 7×7 and has 1024 channels.
L09371: This is reshaped to a vector, and a fully connected layer maps it to 4096 values. One
L09372: further fully connected layer maps this representation to the output.
L09373: The output values encode which class is present at each of a 7×7 grid of locations
L09374: (figure 10.18a–b). For each location, the output values also encode a fixed number of
L09375: bounding boxes. Five parameters define each box: the x- and y-positions of the center,
L09376: the height and width of the box, and the confidence of the prediction (figure 10.18c).
L09377: The confidence estimates the overlap between the predicted and ground truth bound-
L09378: ing boxes. The system is trained using momentum, weight decay, dropout, and data
L09379: augmentation.
L09380: Transfer learning is employed; the network is initially trained on the
L09381: ImageNet classification task and is then fine-tuned for object detection.
L09382: After the network is run, a heuristic process is used to remove rectangles with low
L09383: confidence and to suppress predicted bounding boxes that correspond to the same object
L09384: so only the most confident one is retained.
L09385: Draft: please send errata to udlbookmail@gmail.com.
L09388: <!-- page 192 -->
L09389: 178
L09390: 10
L09391: Convolutional networks
L09392: Figure 10.18 YOLO object detection. a) The input image is reshaped to 448×448
L09393: and divided into a regular 7×7 grid. b) The system predicts the most likely class
L09394: at each grid cell. c) It also predicts two bounding boxes per cell, and a confidence
L09395: value (represented by thickness of line).
L09396: d) During inference, the most likely
L09397: bounding boxes are retained, and boxes with lower confidence values that belong
L09398: to the same object are suppressed. Adapted from Redmon et al. (2016).
L09399: 10.5.3
L09400: Semantic segmentation
L09401: The goal of semantic segmentation is to assign a label to each pixel according to the object
L09402: that it belongs to or no label if that pixel does not correspond to anything in the training
L09403: database. An early network for semantic segmentation is depicted in figure 10.19. The
L09404: input is a 224×224 RGB image, and the output is a 224×224×21 array that contains
L09405: the probability of each of 21 possible classes at each position.
L09406: The first part of the network is a smaller version of VGG (figure 10.17) that contains
L09407: thirteen rather than sixteen convolutional layers and downsizes the representation to size
L09408: 14×14. There is then one more max pooling operation, followed by two fully connected
L09409: layers that map to two 1D representations of size 4096. These layers do not represent
L09410: spatial position but instead, combine information from across the whole image.
L09411: Here, the architecture diverges from VGG. Another fully connected layer reconsti-
L09412: tutes the representation into 7×7 spatial positions and 512 channels. This is followed
L09413: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L09416: <!-- page 193 -->
L09417: 10.6
L09418: Summary
L09419: 179
L09420: Figure 10.19 Semantic segmentation network of Noh et al. (2015). The input is a
L09421: 224×224 image, which is passed through a version of the VGG network and even-
L09422: tually transformed into a representation of size 4096 using a fully connected layer.
L09423: This contains information about the entire image. This is then reformed into a
L09424: representation of size 7×7 using another fully connected layer, and the image is
L09425: upsampled and deconvolved (transposed convolutions without upsampling) in a
L09426: mirror image of the VGG network. The output is a 224×224×21 representation
L09427: that gives the output probabilities for the 21 classes at each position.
L09428: by a series of max unpooling layers (see figure 10.12b) and deconvolution layers. These
L09429: are transposed convolutions (see figure 10.13) but in 2D and without the upsampling.
L09430: Finally, there is a 1×1 convolution to create 21 channels representing the possible classes
L09431: and a softmax operation at each spatial position to map the activations to class proba-
L09432: bilities. The downsampling side of the network is sometimes referred to as an encoder,
L09433: and the upsampling side as a decoder, so networks of this type are sometimes called
L09434: encoder-decoder networks or hourglass networks due to their shape.
L09435: The final segmentation is generated using a heuristic method that greedily searches
L09436: for the class that is most represented and infers its region, taking into account the
L09437: probabilities but also encouraging connectedness. Then the next most-represented class
L09438: is added where it dominates at the remaining unlabeled pixels. This continues until there
L09439: is insuﬀicient evidence to add more (figure 10.20).
L09440: 10.6
L09441: Summary
L09442: In convolutional layers, each hidden unit is computed by taking a weighted sum of the
L09443: nearby inputs, adding a bias, and applying an activation function. The weights and
L09444: the bias are the same at every spatial position, so there are far fewer parameters than
L09445: in a fully connected network, and the number of parameters doesn’t increase with the
L09446: input image size. To ensure that information is not lost, this operation is repeated with
L09447: Draft: please send errata to udlbookmail@gmail.com.
L09450: <!-- page 194 -->
L09451: 180
L09452: 10
L09453: Convolutional networks
L09454: Figure 10.20 Semantic segmentation results. The final result is created from the
L09455: 21 probability maps by greedily selecting the best class and using a heuristic
L09456: method to find a sensible binary map based on the probabilities and their spatial
L09457: proximity. If there is enough evidence, subsequent classes are added, and their
L09458: segmentation maps are combined. Adapted from Noh et al. (2015).
L09459: different weights and biases to create multiple channels at each spatial position.
L09460: Typical convolutional networks consist of convolutional layers interspersed with layers
L09461: that downsample by a factor of two. As a data example passes through the network, the
L09462: spatial dimensions usually decrease by factors of two, and the channels increase by factors
L09463: of two. At the end of the network, there are typically one or more fully connected layers
L09464: that integrate information from across the entire input and create the desired output. If
L09465: the output is an image, a mirrored “decoder” upsamples back to the original size.
L09466: The translational equivariance of convolutional layers imposes a useful inductive bias
L09467: that increases performance for image-based tasks relative to fully connected networks.
L09468: We described image classification, object detection, and semantic segmentation networks.
L09469: Image classification performance was shown to improve as the network became deeper.
L09470: However, subsequent experiments showed that increasing the network depth indefinitely
L09471: doesn’t continue to help; after a certain depth, the system becomes diﬀicult to train.
L09472: This is the motivation for residual connections, which are the topic of the next chapter.
L09473: Notes
L09474: Dumoulin & Visin (2016) present an overview of the mathematics of convolutions that expands
L09475: on the brief treatment in this chapter.
L09476: Convolutional networks:
L09477: Early convolutional networks were developed by Fukushima &
L09478: Miyake (1982), LeCun et al. (1989a), and LeCun et al. (1989b). Initial applications included
L09479: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
