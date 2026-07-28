L09946: <!-- page 204 -->
L09947: 190
L09948: 11
L09949: Residual networks
L09950: Figure 11.4 Residual connections. a) The output of each function fk[x, ϕk] is
L09951: added back to its input, which is passed via a parallel computational path called
L09952: a residual or skip connection. Hence, the function computes an additive change
L09953: to the representation. b) Upon expanding (unraveling) the network equations, we
L09954: find that the output is the sum of the input plus four smaller networks (depicted
L09955: in white, orange, gray, and cyan, respectively, and corresponding to terms in
L09956: equation 11.5); we can think of this as an ensemble of networks.
L09957: Moreover,
L09958: the output from the cyan network is itself a transformation f4[•, ϕ4] of another
L09959: ensemble, and so on. Alternatively, we can consider the network as a combination
L09960: of 16 different paths through the computational graph. One example is the dashed
L09961: path from input x to output y, which is the same in panels (a) and (b).
L09962: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L09965: <!-- page 205 -->
L09966: 11.2
L09967: Residual connections and residual blocks
L09968: 191
L09969: Figure 11.5 Order of operations in resid-
L09970: ual blocks. a) The usual order of linear
L09971: transformation or convolution followed
L09972: by a ReLU nonlinearity means that each
L09973: residual block can only add non-negative
L09974: quantities.
L09975: b) With the reverse order,
L09976: both positive and negative quantities can
L09977: be added. However, we must add a linear
L09978: transformation at the start of the net-
L09979: work in case the input is all negative. c)
L09980: In practice, it’s common for a residual
L09981: block to contain several network layers.
L09982: interpretation is that residual connections turn the original network into an ensemble of
L09983: these smaller networks whose outputs are summed to compute the result.
L09984: A complementary way of thinking about this residual network is that it creates sixteen
L09985: paths with differing numbers of transformations between input and output. For example,
L09986: Problem 11.2
L09987: the first function f1[x] occurs in eight of these sixteen paths, including as a direct additive
L09988: term (i.e., a path length of one), and the analogous derivative to equation 11.3 is:
L09989: Problem 11.3
L09990: ∂y
L09991: ∂f1
L09992: = I + ∂f2
L09993: ∂f1
L09994: +
L09995: ∂f3
L09996: ∂f1
L09997: + ∂f2
L09998: ∂f1
L09999: ∂f3
L10000: ∂f2
L10001: 
L10002: +
L10003: ∂f4
L10004: ∂f1
L10005: + ∂f2
L10006: ∂f1
L10007: ∂f4
L10008: ∂f2
L10009: + ∂f3
L10010: ∂f1
L10011: ∂f4
L10012: ∂f3
L10013: + ∂f2
L10014: ∂f1
L10015: ∂f3
L10016: ∂f2
L10017: ∂f4
L10018: ∂f3
L10019: 
L10020: , (11.6)
L10021: where there is one term for each of the eight paths. The identity term on the right-
L10022: hand side shows that changes in the parameters ϕ1 in the first layer f1[x, ϕ1] contribute
L10023: directly to changes in the network output y. They also contribute indirectly through
L10024: the other chains of derivatives of varying lengths. In general, gradients through shorter
L10025: Notebook 11.2
L10026: Residual
L10027: networks
L10028: paths will be better behaved. Since both the identity term and various short chains of
L10029: derivatives will contribute to the derivative for each layer, networks with residual links
L10030: suffer less from shattered gradients.
L10031: 11.2.1
L10032: Order of operations in residual blocks
L10033: Until now, we have implied that the additive functions f[x] could be any valid network
L10034: layer (e.g., fully connected or convolutional). This is technically true, but the order of
L10035: operations in these functions is important. They must contain a nonlinear activation
L10036: function like a ReLU, or the entire network will be linear. However, in a typical network
L10037: layer (figure 11.5a), the ReLU function is at the end, so the output is non-negative. If
L10038: we adopt this convention, then each residual block can only increase the input values.
L10039: Hence, it is typical to change the order of operations so that the activation function is
L10040: applied first, followed by the linear transformation (figure 11.5b). Sometimes there may
L10041: be several layers of processing within the residual block (figure 11.5c), but these usually
L10042: terminate with a linear transformation. Finally, we note that when we start these blocks
L10043: with a ReLU operation, they will do nothing if the initial network input is negative since
L10044: the ReLU will clip the entire signal to zero. Hence, it’s typical to start the network with
L10045: a linear transformation rather than a residual block, as in figure 11.5b.
L10046: Draft: please send errata to udlbookmail@gmail.com.
L10049: <!-- page 206 -->
L10050: 192
L10051: 11
L10052: Residual networks
L10053: 11.2.2
L10054: Deeper networks with residual connections
L10055: Adding residual connections roughly doubles the depth of a network that can be practi-
L10056: cally trained before performance degrades. However, we would like to increase the depth
L10057: further. To understand why residual connections do not allow us to increase the depth
L10058: arbitrarily, we must consider how the variance of the activations changes during the
L10059: forward pass and how the gradient magnitudes change during the backward pass.
L10060: 11.3
L10061: Exploding gradients in residual networks
L10062: In section 7.5, we saw that initializing the network parameters is critical.
L10063: Without
L10064: careful initialization, the magnitudes of the intermediate values during the forward pass
L10065: of backpropagation can increase or decrease exponentially. Similarly, the gradients during
L10066: the backward pass can explode or vanish as we move backward through the network.
L10067: Hence, we initialize the network parameters so that the expected variance of the
L10068: activations (in the forward pass) and gradients (in the backward pass) remains the same
L10069: between layers.
L10070: He initialization (section 7.5) achieves this for ReLU activations by
L10071: initializing the biases β to zero and choosing normally distributed weights Ωwith mean
L10072: zero and variance 2/Dh where Dh is the number of hidden units in the previous layer.
L10073: Now consider a residual network. We do not have to worry about the intermediate
L10074: values or gradients vanishing with network depth since there exists a path whereby
L10075: each layer directly contributes to the network output (equation 11.5 and figure 11.4b).
L10076: However, even if we use He initialization within the residual block, the values in the
L10077: forward pass increase exponentially as we move through the network.
L10078: To see why, consider that we add the result of the processing in the residual block back
L10079: to the input. Each branch has some (uncorrelated) variability. Hence, the overall variance
L10080: Problem 11.4
L10081: increases when we recombine them. With ReLU activations and He initialization, the
L10082: expected variance is unchanged by the processing in each block. Consequently, when
L10083: we recombine with the input, the variance doubles (figure 11.6a), growing exponentially
L10084: with the number of residual blocks. This limits the possible network depth before floating
L10085: point precision is exceeded in the forward pass.
L10086: A similar argument applies to the
L10087: gradients in the backward pass of the backpropagation algorithm.
L10088: Hence, residual networks still suffer from unstable forward propagation and exploding
L10089: gradients even with He initialization. One approach that would stabilize the forward and
L10090: backward passes would be to use He initialization and then multiply the combined output
L10091: of each residual block by 1/
L10092: √
L10093: 2 to compensate for the doubling (figure 11.6b). However,
L10094: it is more usual to use batch normalization.
L10095: 11.4
L10096: Batch normalization
L10097: Batch normalization or BatchNorm shifts and rescales each activation h so that its mean
L10098: and variance across the batch B become values that are learned during training. First,
L10099: the empirical mean mh and standard deviation sh are computed:
L10100: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L10103: <!-- page 207 -->
L10104: 11.4
L10105: Batch normalization
L10106: 193
L10107: Figure 11.6 Variance in residual networks. a) He initialization ensures that the
L10108: expected variance remains unchanged after a linear plus ReLU layer fk. Unfortu-
L10109: nately, in residual networks, the input of each block is added back to the output,
L10110: so the variance doubles at each layer (gray numbers indicate variance) and grows
L10111: exponentially. b) One approach would be to rescale the signal by 1/
L10112: √
L10113: 2 between
L10114: each residual block. c) A second method uses batch normalization (BN) as the
L10115: first step in the residual block and initializes the associated offset δ to zero and
L10116: scale γ to one. This transforms the input to each layer to have unit variance, and
L10117: with He initialization, the output variance will also be one. Now the variance
L10118: increases linearly with the number of residual blocks. A side-effect is that, at
L10119: initialization, later network layers are dominated by the residual connection and
L10120: are hence close to computing the identity.
L10121: mh
L10122: =
L10123: 1
L10124: |B|
L10125: X
L10126: i∈B
L10127: hi
L10128: sh
L10129: =
L10130: s
L10131: 1
L10132: |B|
L10133: X
L10134: i∈B
L10135: (hi −mh)2,
L10136: (11.7)
L10137: where all quantities are scalars. Then we use these statistics to standardize the batch
L10138: Appendix C.2.4
L10139: Standardization
L10140: activations to have mean zero and unit variance:
L10141: hi ←hi −mh
L10142: sh + ϵ
L10143: ∀i ∈B,
L10144: (11.8)
L10145: where ϵ is a small number that prevents division by zero if hi is the same for every
L10146: member of the batch and sh = 0.
L10147: Finally, the normalized variable is scaled by γ and shifted by δ:
L10148: hi ←γhi + δ
L10149: ∀i ∈B.
L10150: (11.9)
L10151: Draft: please send errata to udlbookmail@gmail.com.
L10154: <!-- page 208 -->
L10155: 194
L10156: 11
L10157: Residual networks
L10158: After this operation, the activations have mean δ and standard deviation γ across all
L10159: Problem 11.5
L10160: members of the batch. Both of these quantities are learned during training.
L10161: Batch normalization is applied independently to each hidden unit. In a standard
L10162: neural network with K layers, each containing D hidden units, there would be KD
L10163: Problem 11.6
L10164: learned offsets δ and KD learned scales γ. In a convolutional network, the normalizing
L10165: statistics are computed over both the batch and the spatial position. If there were K
L10166: Notebook 11.3
L10167: BatchNorm
L10168: layers, each containing C channels, there would be KC offsets and KC scales. At test
L10169: time, we do not have a batch from which we can gather statistics. To resolve this, the
L10170: statistics mh and sh are calculated across the whole training dataset (rather than just a
L10171: batch) and frozen in the final network.
L10172: 11.4.1
L10173: Costs and benefits of batch normalization
L10174: Batch normalization makes the network invariant to rescaling the weights and biases
L10175: that contribute to each activation; if these are doubled, then the activations also double,
L10176: the estimated standard deviation sh doubles, and the normalization in equation 11.8
L10177: compensates for these changes.2 This happens separately for each hidden unit. Con-
L10178: sequently, there will be a large family of weights and biases that all produce the same
L10179: effect. Batch normalization also adds two parameters, γ and δ, at every hidden unit,
L10180: which makes the model somewhat larger.
L10181: Hence, it both creates redundancy in the
L10182: weights and biases and adds extra parameters to compensate for that redundancy. This
L10183: is obviously ineﬀicient, but batch normalization also provides several benefits.
L10184: Stable forward propagation:
L10185: If we initialize the offsets δ to zero and the scales γ to one,
L10186: then each output activation will have unit variance. In a regular network, this ensures
L10187: the variance is stable during forward propagation at initialization. In a residual network,
L10188: the variance must still increase as we add a new source of variation to the input at each
L10189: layer. However, it will increase linearly with each residual block; the kth layer adds one
L10190: unit of variance to the existing variance of k (figure 11.6c).
L10191: At initialization, this has the side-effect that later layers make a smaller change to
L10192: the overall variation than earlier ones. The network is effectively less deep at the start of
L10193: training since later layers are close to computing the identity. As training proceeds, the
L10194: network can increase the scales γ in later layers and can control its own effective depth.
L10195: Higher learning rates:
L10196: Empirical studies and theory both show that batch normaliza-
L10197: tion makes the loss surface and its gradient change more smoothly (i.e., reduces shat-
L10198: tered gradients). This means we can use higher learning rates as the surface is more
L10199: predictable. We saw in section 9.2 that higher learning rates improve test performance.
L10200: Regularization:
L10201: We saw in chapter 9 that noise in the training process can improve
L10202: generalization. BatchNorm injects noise because the normalization depends on the batch
L10203: statistics. The activations for a given training example are normalized by an amount that
L10204: depends on the other members of the batch and is different at each training iteration.
L10205: 2Technically, this is only true if the BatchNorm operation is applied directly after the network layer.
L10206: The situation is somewhat more complex if residual paths converge and re-divide between the network
L10207: layer and the normalization as in figure 11.6c. However, the spirit of the argument remains unchanged.
L10208: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L10211: <!-- page 209 -->
L10212: 11.5
L10213: Common residual architectures
L10214: 195
L10215: 11.5
L10216: Common residual architectures
L10217: Residual connections are now a standard part of deep learning pipelines. This section
L10218: reviews some well-known architectures that incorporate them.
L10219: 11.5.1
L10220: ResNet
L10221: Residual blocks were first used in convolutional networks for image classification. The
L10222: resulting networks are known as residual networks, or ResNets for short. In ResNets, each
L10223: residual block contains a batch normalization operation, a ReLU activation function, and
L10224: a convolutional layer. This is followed by the same sequence again before being added
L10225: Problem 11.7
L10226: back to the input (figure 11.7a). Trial and error have shown that this order of operations
L10227: works well for image classification.
L10228: For very deep networks, the number of parameters may become undesirably large.
L10229: Bottleneck residual blocks make more eﬀicient use of parameters using three convolutions.
L10230: The first has a 1×1 kernel and reduces the number of channels. The second is a regular
L10231: 3×3 kernel, and the third is another 1×1 kernel to increase the number of channels back
L10232: to the original amount (figure 11.7b). In this way, we can integrate information over a
L10233: 3×3 pixel area using fewer parameters.
L10234: Problem 11.8
L10235: The ResNet-200 model (figure 11.8) contains 200 layers and was used for image clas-
L10236: sification on the ImageNet database (figure 10.15). The architecture resembles AlexNet
L10237: and VGG but uses bottleneck residual blocks instead of vanilla convolutional layers. As
L10238: with AlexNet and VGG, these are periodically interspersed with decreases in spatial
L10239: resolution and simultaneous increases in the number of channels. The resolution is de-
L10240: creased between adjacent ResNet blocks using convolutions with stride two. Channels
L10241: are similarly added by either appending zeros to the representation or applying an extra
L10242: 1×1 convolution. At the start of the network is a 7×7 convolutional layer, followed by a
L10243: downsampling operation. At the end, a fully connected layer maps the block to a vector
L10244: of length 1000. This is passed through a softmax layer to generate class probabilities.
L10245: The ResNet-200 model achieved a remarkable 4.8% error rate for the correct class
L10246: being in the top five and 20.1% for identifying the correct class correctly. This compared
L10247: favorably with AlexNet (16.4%, 38.1%) and VGG (6.8%, 23.7%) and was one of the
L10248: first networks to exceed human performance (5.1% for being in the top five guesses).
L10249: However, this model was conceived in 2016 and is far from state-of-the-art. At the time
L10250: of writing, the best-performing model on this task has a 9.0% error for identifying the
L10251: class correctly (see figure 10.21). This and all the other current top-performing models
L10252: for image classification are now based on transformers (see chapter 12).
L10253: 11.5.2
L10254: DenseNet
L10255: Residual blocks receive the output from the previous layer, modify it by passing it
L10256: through some network layers, and add it back to the original input. An alternative is
L10257: to concatenate the modified and original signals. This increases the representation size
L10258: Draft: please send errata to udlbookmail@gmail.com.
L10261: <!-- page 210 -->
L10262: 196
L10263: 11
L10264: Residual networks
L10265: Figure 11.7 ResNet blocks. a) A standard block in the ResNet architecture con-
L10266: tains a batch normalization operation, followed by an activation function, and
L10267: a 3×3 convolutional layer. Then, this sequence is repeated. b). A bottleneck
L10268: ResNet block still integrates information over a 3×3 region but uses fewer pa-
L10269: rameters. It contains three convolutions. The first 1×1 convolution reduces the
L10270: number of channels. The second 3×3 convolution is applied to the smaller rep-
L10271: resentation. A final 1×1 convolution increases the number of channels again so
L10272: that it can be added back to the input.
L10273: Figure 11.8 ResNet-200 model. A standard 7×7 convolutional layer with stride
L10274: two is applied, followed by a MaxPool operation. A series of bottleneck residual
L10275: blocks follow (number in brackets is channels after first 1×1 convolution), with
L10276: periodic downsampling and accompanying increases in the number of channels.
L10277: The network concludes with average pooling across all spatial positions and a
L10278: fully connected layer that maps to pre-softmax activations.
L10279: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L10282: <!-- page 211 -->
L10283: 11.5
L10284: Common residual architectures
L10285: 197
L10286: Figure 11.9 DenseNet. This architecture uses residual connections to concatenate
L10287: the outputs of earlier layers to later ones. Here, the three-channel input image is
L10288: processed to form a 32-channel representation. The input image is concatenated
L10289: to this to give a total of 35 channels. This combined representation is processed
L10290: to create another 32-channel representation, and both earlier representations are
L10291: concatenated to this to create a total of 67 channels and so on.
L10292: (in terms of channels for a convolutional network), but an optional subsequent linear
L10293: transformation can map back to the original size (a 1×1 convolution for a convolutional
L10294: network). This allows the model to add the representations together, take a weighted
L10295: sum, or combine them in a more complex way.
L10296: The DenseNet architecture uses concatenation so that the input to a layer comprises
L10297: the concatenated outputs from all previous layers (figure 11.9). These are processed to
L10298: create a new representation that is itself concatenated with the previous representation
L10299: and passed to the next layer. This concatenation means there is a direct contribution
L10300: from earlier layers to the output, so the loss surface behaves reasonably.
L10301: In practice, this can only be sustained for a few layers because the number of channels
L10302: (and hence the number of parameters required to process them) becomes increasingly
L10303: large.
L10304: This problem can be alleviated by applying a 1×1 convolution to reduce the
L10305: number of channels before the next 3×3 convolution is applied.
L10306: In a convolutional
L10307: network, the input is periodically downsampled. Concatenation across the downsampling
L10308: makes no sense since the representations have different spatial sizes. Consequently, the
L10309: chain of concatenation is broken at this point, and a smaller representation starts a
L10310: new chain. In addition, another bottleneck 1×1 convolution can be applied when the
L10311: downsampling occurs to control the representation size further.
L10312: This network performs competitively with ResNet models on image classification (see
L10313: figure 10.21); indeed, it can perform better for a comparable parameter count. This is
L10314: presumably because it can reuse processing from earlier layers more flexibly.
L10315: 11.5.3
L10316: U-Nets and hourglass networks
L10317: Section 10.5.3 described a semantic segmentation network that had an encoder-decoder or
L10318: hourglass structure. The encoder repeatedly downsamples the image until the receptive
L10319: fields are large and information is integrated from across the image. Then the decoder
L10320: Draft: please send errata to udlbookmail@gmail.com.
L10323: <!-- page 212 -->
L10324: 198
L10325: 11
L10326: Residual networks
L10327: Figure 11.10 U-Net for segmenting HeLa cells. The U-Net has an encoder-decoder
L10328: structure, in which the representation is downsampled (orange blocks) and then
L10329: re-upsampled (blue blocks). The encoder uses regular convolutions, and the de-
L10330: coder uses transposed convolutions. Residual connections append the last repre-
L10331: sentation at each scale in the encoder to the first representation at the same scale
L10332: in the decoder (orange arrows). The original U-Net used “valid” convolutions, so
L10333: the size decreased slightly with each layer, even without downsampling. Hence,
L10334: the representations from the encoder were cropped (dashed squares) before ap-
L10335: pending to the decoder. Adapted from Ronneberger et al. (2015).
L10336: upsamples it back to the size of the original image. The final output is a probability
L10337: over possible object classes at each pixel.
L10338: One drawback of this architecture is that
L10339: the low-resolution representation in the middle of the network must “remember” the
L10340: high-resolution details to make the final result accurate. This is unnecessary if residual
L10341: connections transfer the representations from the encoder to their partner in the decoder.
L10342: The U-Net (figure 11.10) is an encoder-decoder architecture where the earlier repre-
L10343: sentations are concatenated to the later ones. The original implementation used “valid”
L10344: convolutions, so the spatial size decreases by two pixels each time a 3×3 convolutional
L10345: layer is applied. This means that the upsampled version is smaller than its counterpart
L10346: in the encoder, which must be cropped before concatenation. Subsequent implementa-
L10347: tions have used zero-padding, where this cropping is unnecessary. Note that the U-Net
L10348: is completely convolutional, so after training, it can be run on an image of any size.
L10349: Problem 11.9
L10350: The U-Net was intended for segmenting medical images (figure 11.11) but has found
L10351: many other uses in computer graphics and vision. Hourglass networks are similar but
L10352: apply further convolutional layers in the skip connections and add the result back to the
L10353: decoder rather than concatenating it. A series of these models form a stacked hourglass
L10354: network that alternates between considering the image at local and global levels. Such
L10355: networks are used for pose estimation (figure 11.12). The system is trained to predict one
L10356: “heatmap” for each joint, and the estimated position is the maximum of each heatmap.
L10357: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L10360: <!-- page 213 -->
L10361: 11.6
L10362: Why do nets with residual connections perform so well?
L10363: 199
L10364: Figure 11.11 Segmentation using U-Net in 3D. a) Three slices through a 3D
L10365: volume of mouse cortex taken by scanning electron microscope. b) A single U-
L10366: Net is used to classify voxels as being inside or outside neurites.
L10367: Connected
L10368: regions are identified with different colors. c) For a better result, an ensemble of
L10369: five U-Nets is trained, and a voxel is only classified as belonging to the cell if all
L10370: five networks agree. Adapted from Falk et al. (2019).
L10371: 11.6
L10372: Why do nets with residual connections perform so well?
L10373: Residual networks allow much deeper networks to be trained; it’s possible to extend the
L10374: ResNet architecture to 1000 layers and still train effectively. The improvement in image
L10375: classification performance was initially attributed to the additional network depth, but
L10376: two pieces of evidence contradict this viewpoint.
L10377: First, shallower, wider residual networks sometimes outperform deeper, narrower ones
L10378: with a comparable parameter count. In other words, better performance can sometimes
L10379: be achieved with a network with fewer layers but more channels per layer. Second, there
L10380: is evidence that the gradients during training do not propagate effectively through very
L10381: long paths in the unraveled network (figure 11.4b). In effect, a very deep network may
L10382: act more like a combination of shallower networks.
L10383: The current view is that residual connections add some value of their own, as well
L10384: as allowing deeper networks to be trained. This perspective is supported by the fact
L10385: that the loss surfaces of residual networks around a minimum tend to be smoother and
L10386: more predictable than those for the same network when the skip connections are removed
L10387: (figure 11.13). This may make it easier to learn a good solution that generalizes well.
L10388: 11.7
L10389: Summary
L10390: Increasing network depth indefinitely causes both training and test performance for image
L10391: classification to decrease. This may be because the gradient of the loss with respect to
L10392: Draft: please send errata to udlbookmail@gmail.com.
L10395: <!-- page 214 -->
L10396: 200
L10397: 11
L10398: Residual networks
L10399: Figure 11.12 Stacked hourglass networks for pose estimation. a) The network
L10400: input is an image containing a person, and the output is a set of heatmaps, with
L10401: one heatmap for each joint. This is formulated as a regression problem where the
L10402: targets are heatmap images with small, highlighted regions at the ground-truth
L10403: joint positions. The peak of the estimated heatmap is used to establish each final
L10404: joint position. b) The architecture consists of initial convolutional and residual
L10405: layers followed by a series of hourglass blocks. c) Each hourglass block consists
L10406: of an encoder-decoder network similar to the U-Net except that the convolutions
L10407: use zero-padding, some further processing is done in the residual links, and these
L10408: links add this processed representation rather than concatenate it.
L10409: Each blue
L10410: cuboid is itself a bottleneck residual block (figure 11.7b). Adapted from Newell
L10411: et al. (2016).
L10412: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L10415: <!-- page 215 -->
L10416: Notes
L10417: 201
L10418: Figure 11.13 Visualizing neural network loss surfaces. Each plot shows the loss
L10419: surface in two random directions in parameter space around the minimum found
L10420: by SGD for an image classification task on the CIFAR-10 dataset. These direc-
L10421: tions are normalized to facilitate side-by-side comparison. a) Residual net with 56
L10422: layers. b) Results from the same network without skip connections. The surface
L10423: is smoother with the skip connections. This facilitates learning and makes the
L10424: final network performance more robust to minor errors in the parameters, so it
L10425: will likely generalize better. Adapted from Li et al. (2018b).
L10426: parameters early in the network changes quickly and unpredictably relative to the update
L10427: step size. Residual connections add the processed representation back to their own input.
L10428: Now each layer contributes directly to the output as well as indirectly, so propagating
L10429: gradients through many layers is not mandatory, and the loss surface is smoother.
L10430: Residual networks don’t suffer from vanishing gradients but introduce an exponential
L10431: increase in the variance of the activations during forward propagation and corresponding
L10432: problems with exploding gradients. This is usually handled by adding batch normaliza-
L10433: tion, which compensates for the empirical mean and variance of the batch and then
L10434: shifts and rescales using learned parameters. If these parameters are initialized judi-
L10435: ciously, very deep networks can be trained. There is evidence that both residual links
L10436: and batch normalization make the loss surface smoother, which permits larger learning
L10437: rates. Moreover, the variability in the batch statistics adds a source of regularization.
L10438: Residual blocks have been incorporated into convolutional networks.
L10439: They allow
L10440: deeper networks to be trained with commensurate increases in image classification per-
L10441: formance.
L10442: Variations of residual networks include the DenseNet architecture, which
L10443: concatenates outputs of all prior layers to feed into the current layer, and U-Nets, which
L10444: incorporate residual connections into encoder-decoder models.
L10445: Notes
L10446: Residual connections:
L10447: Residual connections were introduced by He et al. (2016a), who built
L10448: a network with 152 layers, which was eight times larger than VGG (figure 10.17), and achieved
L10449: state-of-the-art performance on the ImageNet classification task. Each residual block consisted
L10450: Draft: please send errata to udlbookmail@gmail.com.
L10453: <!-- page 216 -->
L10454: 202
L10455: 11
L10456: Residual networks
L10457: of a convolutional layer followed by batch normalization, a ReLU activation, a second convolu-
L10458: tional layer, and second batch normalization. A second ReLU function was applied after this
L10459: block was added back to the main representation. This architecture was termed ResNet v1.
L10460: He et al. (2016b) investigated different variations of residual architectures, in which either (i)
L10461: processing could also be applied along the skip connection or (ii) after the two branches had
L10462: recombined. They concluded neither was necessary, leading to the architecture in figure 11.7,
L10463: which is sometimes termed a pre-activation residual block and is the backbone of ResNet v2.
L10464: They trained a network with 200 layers that improved further on the ImageNet classification
L10465: task (see figure 11.8). Since this time, new methods for regularization, optimization, and data
L10466: augmentation have been developed, and Wightman et al. (2021) exploit these to present a more
L10467: modern training pipeline for the ResNet architecture.
L10468: Why residual connections help:
L10469: Residual networks certainly allow deeper networks to be
L10470: trained. Presumably, this is related to reducing shattered gradients (Balduzzi et al., 2017) at
L10471: the start of training and the smoother loss surface near the minima as depicted in figure 11.13
L10472: (Li et al., 2018b). Residual connections alone (i.e., without batch normalization) increase the
L10473: trainable depth of a network by roughly a factor of two (Sankararaman et al., 2020). With batch
L10474: normalization, very deep networks can be trained, but it is unclear that depth is critical for
L10475: performance. Zagoruyko & Komodakis (2016) showed that wide residual networks with only 16
L10476: layers outperformed all residual networks of the time for image classification. Orhan & Pitkow
L10477: (2017) propose a different explanation for why residual connections improve learning in terms
L10478: of eliminating singularities (places on the loss surface where the Hessian is degenerate).
L10479: Related architectures:
L10480: Residual connections are a special case of highway networks (Srivas-
L10481: tava et al., 2015) which also split the computation into two branches and additively recombine.
L10482: Highway networks use a gating function that weights the inputs to the two branches in a way
L10483: that depends on the data itself, whereas residual networks send the data down both branches in
L10484: a straightforward manner. Xie et al. (2017) introduced the ResNeXt architecture, which places
L10485: a residual connection around multiple parallel convolutional branches.
L10486: Residual networks as ensembles:
L10487: Veit et al. (2016) characterized residual networks as en-
L10488: sembles of shorter networks and depicted the “unraveled network” interpretation (figure 11.4b).
L10489: They provide evidence that this interpretation is valid by showing that deleting layers in a
L10490: trained network (and hence a subset of paths) only has a modest effect on performance. Con-
L10491: versely, removing a layer in a purely sequential network like VGG is catastrophic. They also
L10492: looked at the gradient magnitudes along paths of different lengths and showed that the gradient
L10493: vanishes in longer paths. In a residual network consisting of 54 blocks, almost all of the gradient
L10494: updates during training were from paths of length 5 to 17 blocks long, even though these only
L10495: constitute 0.45% of the total paths. It seems that adding more blocks effectively adds more
L10496: parallel shorter paths rather than creating a network that is truly deeper.
L10497: Regularization for residual networks:
L10498: L2 regularization of the weights has a fundamentally
L10499: different effect in vanilla networks and residual networks without BatchNorm. In the former, it
L10500: encourages the output of the layer to be a constant function determined by the biases. In the
L10501: latter, it encourages the residual block to compute the identity plus a constant determined by
L10502: the biases.
L10503: Several regularization methods have been developed that are targeted specifically at residual
L10504: architectures.
L10505: ResDrop (Yamada et al., 2016), stochastic depth (Huang et al., 2016), and
L10506: RandomDrop (Yamada et al., 2019) all regularize residual networks by randomly dropping
L10507: residual blocks during the training process. In the latter case, the propensity for dropping a block
L10508: is determined by a Bernoulli variable, whose parameter is linearly decreased during training. At
L10509: test time, the residual blocks are added back in with their expected probability. These methods
L10510: are effectively versions of dropout, in which all the hidden units in a block are simultaneously
L10511: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
