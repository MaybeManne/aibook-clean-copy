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
L00715: <!-- page 18 -->
L00716: 4
L00717: 1
L00718: Introduction
L00719: Figure 1.3 Machine learning model. The model represents a family of relationships
L00720: that relate the input (age of child) to the output (height of child). The particular
L00721: relationship is chosen using training data, which consists of input/output pairs
L00722: (orange points). When we train the model, we search through the possible re-
L00723: lationships for one that describes the data well. Here, the trained model is the
L00724: cyan curve and can be used to compute the height for any age.
L00725: order is important; my wife ate the chicken is not the same as the chicken ate my wife.
L00726: The text must be encoded into numerical form before passing it to the model. Here, we
L00727: use a fixed vocabulary of size 10,000 and simply concatenate the word indices.
L00728: For the music classification example, the input vector might be of fixed size (perhaps
L00729: a 10-second clip) but is very high-dimensional (i.e., contains many entries). Digital audio
L00730: is usually sampled at 44.1 kHz and represented by 16-bit integers, so a ten-second clip
L00731: consists of 441,000 integers. Clearly, supervised learning models will have to be able to
L00732: process sizeable inputs. The input in the image classification example (which consists
L00733: of the concatenated RGB values at every pixel) is also enormous. Moreover, it contains
L00734: spatial structure; two pixels above and below one another are closely related, even if
L00735: they are not adjacent in the input vector.
L00736: Finally, consider the input for the model that predicts the freezing and boiling points
L00737: of the molecule. A molecule may contain varying numbers of atoms that can be connected
L00738: in different ways. In this case, the model must ingest both the geometric structure of
L00739: the molecule and the constituent atoms to the model.
L00740: 1.1.3
L00741: Machine learning models
L00742: Until now, we have treated the machine learning model as a black box that takes an input
L00743: vector and returns an output vector. But what exactly is in this black box? Consider a
L00744: model to predict the height of a child from their age (figure 1.3). The machine learning
L00745: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L00748: <!-- page 19 -->
L00749: 1.1
L00750: Supervised learning
L00751: 5
L00752: model is a mathematical equation that describes how the average height varies as a
L00753: function of age (cyan curve in figure 1.3). When we run the age through this equation,
L00754: it returns the height. For example, if the age is 10 years, then we predict that the height
L00755: will be 139 cm.
L00756: More precisely, the model represents a family of equations mapping the input to
L00757: the output (i.e., a family of different cyan curves). The particular equation (curve) is
L00758: chosen using training data (examples of input/output pairs). In figure 1.3, these pairs
L00759: are represented by the orange points, and we can see that the model (cyan line) describes
L00760: these data reasonably. When we talk about training or fitting a model, we mean that we
L00761: search through the family of possible equations (possible cyan curves) relating input to
L00762: output to find the one that describes the training data most accurately.
L00763: It follows that the models in figure 1.2 require labeled input/output pairs for training.
L00764: For example, the music classification model would require a large number of audio clips
L00765: where a human expert had identified the genre of each. These input/output pairs take
L00766: the role of a teacher or supervisor for the training process, and this gives rise to the term
L00767: supervised learning.
L00768: 1.1.4
L00769: Deep neural networks
L00770: This book concerns deep neural networks, which are a particularly useful type of machine
L00771: learning model. They are equations that can represent an extremely broad family of
L00772: relationships between input and output, and where it is particularly easy to search
L00773: through this family to find the relationship that describes the training data.
L00774: Deep neural networks can process inputs that are very large, of variable length,
L00775: and contain various kinds of internal structures. They can output single real numbers
L00776: (regression), multiple numbers (multivariate regression), or probabilities over two or more
L00777: classes (binary and multiclass classification, respectively). As we shall see in the next
L00778: section, their outputs may also be very large, of variable length, and contain internal
L00779: structure. It is probably hard to imagine equations with these properties, and the reader
L00780: should endeavor to suspend disbelief for now.
L00781: 1.1.5
L00782: Structured outputs
L00783: Figure 1.4a depicts a multivariate binary classification model for semantic segmentation.
L00784: Here, every pixel of an input image is assigned a binary label that indicates whether it
L00785: belongs to a cow or the background. Figure 1.4b shows a multivariate regression model
L00786: where the input is an image of a street scene and the output is the depth at each pixel.
L00787: In both cases, the output is high-dimensional and structured. However, this structure is
L00788: closely tied to the input, and this can be exploited; if a pixel is labeled as “cow,” then a
L00789: neighbor with a similar RGB value probably has the same label.
L00790: Figures 1.4c–e depict three models where the output has a complex structure that is
L00791: not so closely tied to the input. Figure 1.4c shows a model where the input is an audio
L00792: file and the output is the transcribed words from that file. Figure 1.4d is a translation
L00793: Draft: please send errata to udlbookmail@gmail.com.
L00796: <!-- page 20 -->
L00797: 6
L00798: 1
L00799: Introduction
L00800: Figure 1.4 Supervised learning tasks with structured outputs. a) This semantic
L00801: segmentation model maps an RGB image to a binary image indicating whether
L00802: each pixel belongs to the background or a cow (adapted from Noh et al., 2015).
L00803: b) This monocular depth estimation model maps an RGB image to an output
L00804: image where each pixel represents the depth (adapted from Cordts et al., 2016).
L00805: c) This audio transcription model maps an audio sample to a transcription of
L00806: the spoken words in the audio. d) This translation model maps an English text
L00807: string to its French translation. e) This image synthesis model maps a caption to
L00808: an image (example from https://openai.com/dall-e-2/). In each case, the output
L00809: has a complex internal structure or grammar. In some cases, many outputs are
L00810: compatible with the input.
L00811: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L00814: <!-- page 21 -->
L00815: 1.2
L00816: Unsupervised learning
L00817: 7
L00818: model in which the input is a body of text in English, and the output contains the French
L00819: translation. Figure 1.4e depicts a very challenging task in which the input is descriptive
L00820: text, and the model must produce an image that matches this description.
L00821: In principle, the latter three tasks can be tackled in the standard supervised learning
L00822: framework, but they are more diﬀicult for two reasons. First, the output may genuinely
L00823: be ambiguous; there are multiple valid translations from an English sentence to a French
L00824: one and multiple images that are compatible with any caption.
L00825: Second, the output
L00826: contains considerable structure; not all strings of words make valid English and French
L00827: sentences, and not all collections of RGB values make plausible images. In addition to
L00828: learning the mapping, we also have to respect the “grammar” of the output.
L00829: Fortunately, this “grammar” can be learned without the need for output labels. For
L00830: example, we can learn how to form valid English sentences by learning the statistics of a
L00831: large corpus of text data. This provides a connection with the next section of the book,
L00832: which considers unsupervised learning models.
L00833: 1.2
L00834: Unsupervised learning
L00835: Constructing a model from input data without corresponding output labels is termed
L00836: unsupervised learning; the absence of output labels means there can be no “supervision.”
L00837: Rather than learning a mapping from input to output, the goal is to describe or under-
L00838: stand the structure of the data. As was the case for supervised learning, the data may
L00839: have very different characteristics; it may be discrete or continuous, low-dimensional or
L00840: high-dimensional, and of constant or variable length.
L00841: 1.2.1
L00842: Generative models
L00843: This book focuses on generative unsupervised models, which learn to synthesize new
L00844: data examples that are statistically indistinguishable from the training data.
L00845: Some
L00846: generative models explicitly describe the probability distribution over the input data and
L00847: here new examples are generated by sampling from this distribution. Others merely learn
L00848: a mechanism to generate new examples without explicitly describing their distribution.
L00849: State-of-the-art generative models can synthesize examples that are extremely plau-
L00850: sible but distinct from the training examples. They have been particularly successful
L00851: at generating images (figure 1.5) and text (figure 1.6). They can also synthesize data
L00852: under the constraint that some outputs are predetermined (termed conditional genera-
L00853: tion). Examples include image inpainting (figure 1.7) and text completion (figure 1.8).
L00854: Indeed, modern generative models for text are so powerful that they can appear intel-
L00855: ligent. Given a body of text followed by a question, the model can often “fill in” the
L00856: missing answer by generating the most likely completion of the document. However, in
L00857: reality, the model only knows about the statistics of language and does not understand
L00858: the significance of its answers.
L00859: Draft: please send errata to udlbookmail@gmail.com.
L00862: <!-- page 22 -->
L00863: 8
L00864: 1
L00865: Introduction
L00866: Figure 1.5 Generative models for images. Left: two images were generated from
L00867: a model trained on pictures of cats. These are not real cats, but samples from a
L00868: probability model. Right: two images generated from a model trained on images
L00869: of buildings. Adapted from Karras et al. (2020b).
L00870: The moon had risen by the time I reached the edge of the forest, and the light that filtered through the
L00871: trees was silver and cold. I shivered, though I was not cold, and quickened my pace. I had never been
L00872: so far from the village before, and I was not sure what to expect. I had been walking for hours, and I
L00873: was tired and hungry. I had left in such a hurry that I had not thought to pack any food, and I had
L00874: not thought to bring a weapon. I was unarmed and alone in a strange place, and I did not know what
L00875: I was doing.
L00876: I had been walking for so long that I had lost all sense of time, and I had no idea how far I had come.
L00877: I only knew that I had to keep going. I had to find her. I was getting close. I could feel it. She was
L00878: nearby, and she was in trouble. I had to find her and help her, before it was too late.
L00879: Figure 1.6 Short story synthesized from a generative model of text data. The
L00880: model describes a probability distribution that assigns a probability to every
L00881: output string. Sampling from the model creates strings that follow the statistics
L00882: of the training data (here, short stories) but have never been seen before.
L00883: Figure 1.7 Inpainting. In the original image (left), the boy is obscured by metal
L00884: cables. These undesirable regions (center) are removed and the generative model
L00885: synthesizes a new image (right) under the constraint that the remaining pixels
L00886: must stay the same. Adapted from Saharia et al. (2022a).
L00887: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L00890: <!-- page 23 -->
L00891: 1.2
L00892: Unsupervised learning
L00893: 9
L00894: I was a little nervous before my first lecture at the University of Bath.
L00895: It seemed like there were
L00896: hundreds of students and they looked intimidating. I stepped up to the lectern and was about to speak
L00897: when something bizarre happened.
L00898: Suddenly, the room was filled with a deafening noise, like a giant roar.
L00899: It was so loud that I
L00900: couldn’t hear anything else and I had to cover my ears. I could see the students looking around, con-
L00901: fused and frightened. Then, as quickly as it had started, the noise stopped and the room was silent again.
L00902: I stood there for a few moments, trying to make sense of what had just happened. Then I realized that
L00903: the students were all staring at me, waiting for me to say something. I tried to think of something witty
L00904: or clever to say, but my mind was blank. So I just said, “Well, that was strange,’ and then I started my
L00905: lecture.
L00906: Figure 1.8 Conditional text synthesis. Given an initial body of text (in black),
L00907: generative models of text can continue the string plausibly by synthesizing the
L00908: “missing” remaining part of the string. Generated by GPT3 (Brown et al., 2020).
L00909: Figure 1.9 Variation of the human face. The human face contains roughly 42
L00910: muscles, so it’s possible to describe most of the variation in images of the same
L00911: person in the same lighting with just 42 numbers. In general, datasets of images,
L00912: music, and text can be described by a relatively small number of underlying
L00913: variables although it is typically more diﬀicult to tie these to particular physical
L00914: mechanisms. Images from Dynamic FACES database (Holland et al., 2019).
L00915: 1.2.2
L00916: Latent variables
L00917: Some (but not all) generative models exploit the fact that data can be lower dimensional
L00918: than the raw number of observed variables suggests. For example, the number of valid
L00919: and meaningful English sentences is much smaller than the number of strings created by
L00920: drawing words at random. Similarly, real-world images are a tiny subset of the images
L00921: that can be created by drawing random red, green, and blue (RGB) values for every
L00922: pixel. This is because images are generated by physical processes (see figure 1.9).
L00923: This leads to the idea that we can describe each data example using a smaller number
L00924: of underlying latent variables. Here, the role of deep learning is to describe the mapping
L00925: between these latent variables and the data. The latent variables typically have a simple
L00926: Draft: please send errata to udlbookmail@gmail.com.
L00929: <!-- page 24 -->
L00930: 10
L00931: 1
L00932: Introduction
L00933: Figure 1.10 Latent variables. Many generative models use a deep learning model
L00934: to describe the relationship between a low-dimensional “latent” variable and the
L00935: observed high-dimensional data. The latent variables have a simple probability
L00936: distribution by design. Hence, new examples can be generated by sampling from
L00937: the simple distribution over the latent variables and then using the deep learning
L00938: model to map the sample to the observed data space.
L00939: Figure 1.11 Image interpolation. In each row the left and right images are real
L00940: and the three images in between represent a sequence of interpolations created
L00941: by a generative model. The generative models that underpin these interpolations
L00942: have learned that all images can be created by a set of underlying latent variables.
L00943: By finding these variables for the two real images, interpolating their values, and
L00944: then using these intermediate variables to create new images, we can generate
L00945: intermediate results that are both visually plausible and mix the characteristics
L00946: of the two original images. Top row adapted from Sauer et al. (2022). Bottom
L00947: row adapted from Ramesh et al. (2022).
L00948: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L00951: <!-- page 25 -->
L00952: 1.3
L00953: Reinforcement learning
L00954: 11
L00955: Figure 1.12 Multiple images generated from the caption “A teddy bear on a
L00956: skateboard in Times Square.” Generated by DALL·E-2 (Ramesh et al., 2022).
L00957: probability distribution by design. By sampling from this distribution and passing the
L00958: result through the deep learning model, we can create new samples (figure 1.10).
L00959: These models lead to new methods for manipulating real data. For example, consider
L00960: finding the latent variables that underpin two real examples. We can interpolate between
L00961: these examples by interpolating between their latent representations and mapping the
L00962: intermediate positions back into the data space (figure 1.11).
L00963: 1.2.3
L00964: Connecting supervised and unsupervised learning
L00965: Generative models with latent variables can also benefit supervised learning models
L00966: where the outputs have structure (figure 1.4). For example, consider learning to predict
L00967: the images corresponding to a caption. Rather than directly map the text input to an
L00968: image, we can learn a relation between latent variables that explain the text and the
L00969: latent variables that explain the image.
L00970: This has three advantages. First, we may need fewer text/image pairs to learn this
L00971: mapping now that the inputs and outputs are lower dimensional. Second, we are more
L00972: likely to generate a plausible-looking image; any sensible values of the latent variables
L00973: should produce something that looks like a plausible example. Third, if we introduce
L00974: randomness to either the mapping between the two sets of latent variables or the mapping
L00975: from the latent variables to the image, then we can generate multiple images that are all
L00976: described well by the caption (figure 1.12).
L00977: 1.3
L00978: Reinforcement learning
L00979: The final area of machine learning is reinforcement learning. This paradigm introduces
L00980: the idea of an agent which lives in a world and can perform certain actions at each time
L00981: step. The actions change the state of the system but not necessarily in a deterministic
L00982: way. Taking an action can also produce rewards, and the goal of reinforcement learning
L00983: Draft: please send errata to udlbookmail@gmail.com.
L00986: <!-- page 26 -->
L00987: 12
L00988: 1
L00989: Introduction
L00990: is for the agent to learn to choose actions that lead to high rewards on average.
L00991: One complication is that the reward may occur some time after the action is taken,
L00992: so associating a reward with an action is not straightforward. This is known as the
L00993: temporal credit assignment problem. As the agent learns, it must trade off exploration
L00994: and exploitation of what it already knows; perhaps the agent has already learned how to
L00995: receive modest rewards; should it follow this strategy (exploit what it knows), or should
L00996: it try different actions to see if it can improve (explore other opportunities)?
L00997: 1.3.1
L00998: Two examples
L00999: Consider teaching a humanoid robot to locomote.
L01000: The robot can perform a limited
L01001: number of actions at a given time (moving various joints), and these change the state of
L01002: the world (its pose). We might reward the robot for reaching checkpoints in an obstacle
L01003: course. To reach each checkpoint, it must perform many actions, and it’s unclear which
L01004: ones contributed to the reward when it is received and which were irrelevant. This is an
L01005: example of the temporal credit assignment problem.
L01006: A second example is learning to play chess. Again, the agent has a set of valid actions
L01007: (chess moves) at any given time. However, these actions change the state of the system
L01008: in a non-deterministic way; for any choice of action, the opposing player might respond
L01009: with many different moves. Here, we might set up a reward structure based on capturing
L01010: pieces or just have a single reward at the end of the game for winning. In the latter case,
L01011: the temporal credit assignment problem is extreme; the system must learn which of the
L01012: many moves it made were instrumental to success or failure.
L01013: The exploration-exploitation trade-off is also apparent in these two examples. The
L01014: robot may have discovered that it can make progress by lying on its side and pushing
L01015: with one leg. This strategy will move the robot and yields rewards, but much more slowly
L01016: than the optimal solution: to balance on its legs and walk. So, it faces a choice between
L01017: exploiting what it already knows (how to slide along the floor awkwardly) and exploring
L01018: the space of actions (which might result in much faster locomotion). Similarly, in the
L01019: chess example, the agent may learn a reasonable sequence of opening moves. Should it
L01020: exploit this knowledge or explore different opening sequences?
L01021: It is perhaps not obvious how deep learning fits into the reinforcement learning frame-
L01022: work. There are several possible approaches, but one technique is to use deep networks
L01023: to build a mapping from the observed world state to an action. This is known as a
L01024: policy network. In the robot example, the policy network would learn a mapping from
L01025: its sensor measurements to joint movements. In the chess example, the network would
L01026: learn a mapping from the current state of the board to the choice of move (figure 1.13).
L01027: 1.4
L01028: Ethics
L01029: It would be irresponsible to write this book without discussing the ethical implications
L01030: of artificial intelligence. This potent technology will change the world to at least the
L01031: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L01034: <!-- page 27 -->
L01035: 1.4
L01036: Ethics
L01037: 13
L01038: Figure 1.13 Policy networks for reinforcement learning. One way to incorporate
L01039: deep neural networks into reinforcement learning is to use them to define a map-
L01040: ping from the state (here position on chessboard) to the actions (possible moves).
L01041: This mapping is known as a policy.
L01042: same extent as electricity, the internal combustion engine, the transistor, or the internet.
L01043: The potential benefits in healthcare, design, entertainment, transport, education, and
L01044: almost every area of commerce are enormous. However, scientists and engineers are often
L01045: unrealistically optimistic about the outcomes of their work, and the potential for harm
L01046: is just as great. The following paragraphs highlight five concerns.
L01047: Bias and fairness:
L01048: If we train a system to predict salary levels for individuals based
L01049: on historical data, then this system will reproduce historical biases; for example, it will
L01050: probably predict that women should be paid less than men. Several such cases have
L01051: already become international news stories: an AI system for super-resolving face images
L01052: made non-white people look more white; a system for generating images produced only
L01053: pictures of men when asked to synthesize pictures of lawyers. Careless application of
L01054: algorithmic decision-making using AI has the potential to entrench or aggravate existing
L01055: biases. See Binns (2018) for further discussion.
L01056: Explainability:
L01057: Deep learning systems make decisions, but we do not usually know
L01058: exactly how or based on what information. They may be enormous, and there is no way
L01059: we can understand how they work based on examination. This has led to the sub-field
L01060: of explainable AI. One moderately successful area is producing local explanations; we
L01061: cannot explain the entire system, but we can produce an interpretable description of why
L01062: a particular decision was made. However, it remains unknown whether it is possible to
L01063: build complex decision-making systems that are fully transparent to their users or even
L01064: their creators. See Grennan et al. (2022) for further information.
L01065: Weaponizing AI:
L01066: All significant technologies have been applied directly or indirectly
L01067: toward war. Sadly, violent conflict seems to be an inevitable feature of human behavior.
L01068: AI is arguably the most powerful technology ever built and will doubtless be deployed
L01069: extensively in a military context. Indeed, this is already happening (Heikkilä, 2022).
L01070: Draft: please send errata to udlbookmail@gmail.com.
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
