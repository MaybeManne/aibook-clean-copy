L21162: <!-- page 411 -->
L21163: Notes
L21164: 397
L21165: Notes
L21166: Sutton & Barto (2018) cover tabular reinforcement learning methods in depth.
L21167: Li (2017),
L21168: Arulkumaran et al. (2017), François-Lavet et al. (2018), and Wang et al. (2022c) all provide
L21169: overviews of deep reinforcement learning. Graesser & Keng (2019) is an excellent introductory
L21170: resource that includes Python code.
L21171: Landmarks in deep reinforcement learning:
L21172: Most landmark achievements of reinforcement
L21173: learning have been in either video games or real-world games since these provide constrained en-
L21174: vironments with limited actions and fixed rules. Deep Q-Learning (Mnih et al., 2015) achieved
L21175: human-level performance across a benchmark of ATARI games. AlphaGo (Silver et al., 2016)
L21176: beat the world champion at Go. This game was previously considered very diﬀicult for comput-
L21177: ers to play. Berner et al. (2019) built a system that beat the world champion team in the five vs.
L21178: five-player game Defense of the Ancients 2, which requires cooperation across players. Ye et al.
L21179: (2021) built a system that could beat humans on Atari games with limited data (in contrast to
L21180: previous systems, which need much more experience than humans). More recently, the Cicero
L21181: system demonstrated human-level performance in the game Diplomacy which requires natural
L21182: language negotiations and coordination between players (FAIR, 2022).
L21183: RL has also been applied successfully to combinatorial optimization problems (see Mazyavkina
L21184: et al., 2021). For example, Kool et al. (2019) learned a model that performed similarly to the
L21185: best heuristics for the traveling salesman problem. Recently, AlphaTensor (Fawzi et al., 2022)
L21186: treated matrix multiplication as a game and learned faster ways to multiply matrices using fewer
L21187: multiplication operations. Since deep learning relies heavily on matrix multiplication, this is
L21188: one of the first examples of self-improvement in AI.
L21189: Classical reinforcement learning methods:
L21190: Very early contributions to the theory of MDPs
L21191: were made by Thompson (1933) and Thompson (1935). The Bellman recursions were introduced
L21192: by Bellman (1966). Howard (1960) introduced policy iteration. Sutton & Barto (2018) identify
L21193: the work of Andreae (1969) as being the first to describe RL using the MDP formalism.
L21194: The modern era of reinforcement learning arguably originated in the Ph.D. theses of Sutton
L21195: (1984) and Watkins (1989). Sutton (1988) introduced the term temporal difference learning.
L21196: Watkins (1989) and Watkins & Dayan (1992) introduced Q-Learning and showed that it con-
L21197: verges to a fixed point by Banach’s theorem because the Bellman operator is a contraction
L21198: mapping. Watkins (1989) made the first explicit connection between dynamic programming
L21199: and reinforcement learning. SARSA was developed by Rummery & Niranjan (1994). Gordon
L21200: (1995) introduced fitted Q-learning in which a machine learning model is used to predict the
L21201: action value for each state-action pair. Riedmiller (2005) introduced neural-fitted Q-learning,
L21202: which used a neural network to predict all the action values at once from a state. Early work
L21203: on Monte Carlo methods was carried out by Singh & Sutton (1996), and the exploring starts
L21204: algorithm was introduced by Sutton & Barto (1999). Note that this is an extremely cursory
L21205: summary of more than fifty years of work. A much more thorough treatment can be found in
L21206: Sutton & Barto (2018).
L21207: Deep Q-Networks:
L21208: Deep Q-Learning was devised by Mnih et al. (2015) and is an intellectual
L21209: descendent of neural-fitted Q-learning. It exploited the then-recent successes of convolutional
L21210: networks to develop a fitted Q-Learning method that could achieve human-level performance
L21211: on a benchmark of ATARI games. Deep Q-Learning suffers from the deadly triad issue (Sutton
L21212: & Barto, 2018): training can be unstable in any scheme that incorporates (i) bootstrapping, (ii)
L21213: off-policy learning, and (iii) function approximation. Much subsequent work has aimed to make
L21214: training more stable. Mnih et al. (2015) introduced the experience replay buffer (Lin, 1992),
L21215: which was subsequently improved by Schaul et al. (2016) to favor more important tuples and
L21216: hence increase learning speed. This is termed prioritized experience replay.
L21217: Draft: please send errata to udlbookmail@gmail.com.
L21220: <!-- page 412 -->
L21221: 398
L21222: 19
L21223: Reinforcement learning
L21224: The original Q-Learning paper concatenated four frames so the network could observe the
L21225: velocities of objects and make the underlying process closer to fully observable. Hausknecht &
L21226: Stone (2015) introduced deep recurrent Q-learning, which used a recurrent network architecture
L21227: that only ingested a single frame at a time because it could “remember” the previous states.
L21228: Van Hasselt (2010) identified the systematic overestimation of the state values due to the max
L21229: operation and proposed double Q-Learning in which two models are trained simultaneously to
L21230: remedy this. This was subsequently applied in the context of deep Q-learning (Van Hasselt
L21231: et al., 2016), although its eﬀicacy has since been questioned (Hessel et al., 2018). Wang et al.
L21232: (2016) introduced deep dueling networks in which two heads of the same network predict (i)
L21233: the state value and (ii) the advantage (relative value) of each action. The intuition here is that
L21234: sometimes it is the state value that is important, and it doesn’t matter much which action is
L21235: taken, and decoupling these estimates improves stability.
L21236: Fortunato et al. (2018) introduced noisy deep Q-Networks, in which some weights in the Q-
L21237: Network are multiplied by noise to add stochasticity to the predictions and encourage explo-
L21238: ration. The network can learn to decrease the magnitudes of the noise over time as it converges
L21239: to a sensible policy. Distributional DQN (Bellemare et al., 2017a; Dabney et al., 2018 follow-
L21240: ing Morimura et al., 2010) aims to estimate more complete information about the distribution
L21241: of returns than just the expectation. This potentially allows the network to mitigate against
L21242: worst-case outcomes and can also improve performance, as predicting higher moments provides
L21243: a richer training signal. Rainbow (Hessel et al., 2018) combined six improvements to the original
L21244: deep Q-learning algorithm, including dueling networks, distributional DQN, and noisy DQN,
L21245: to improve both the training speed and the final performance on the ATARI benchmark.
L21246: Policy gradients:
L21247: Williams (1992) introduced the REINFORCE algorithm. The term “policy
L21248: gradient method” dates to Sutton et al. (1999). Konda & Tsitsiklis (1999) introduced the actor-
L21249: critic algorithm. Decreasing the variance by using different baselines is discussed in Greensmith
L21250: et al. (2004) and Peters & Schaal (2008).
L21251: It has since been argued that the value baseline
L21252: primarily reduces the aggressiveness of the updates rather than their variance (Mei et al., 2022).
L21253: Policy gradients have been adapted to produce deterministic policies (Silver et al., 2014; Lillicrap
L21254: et al., 2016; Fujimoto et al., 2018). The most direct approach is to maximize over the possible
L21255: actions, but if the action space is continuous, this requires an optimization procedure at each
L21256: step. The deep deterministic policy gradient algorithm (Lillicrap et al., 2016) moves the policy
L21257: in the direction of the gradient of the action value (implying the use of an actor-critic method).
L21258: Modern policy gradients:
L21259: We introduced policy gradients in terms of the parameter update.
L21260: However, they can also be viewed as optimizing a surrogate loss based on importance sampling
L21261: of the expected rewards, using trajectories from the current policy parameters. This view allows
L21262: us to take multiple optimization steps validly. However, this can cause very large policy updates.
L21263: Overstepping is a minor problem in supervised learning, as the trajectory can be corrected later.
L21264: However, in RL, it affects future data collection and can be extremely destructive.
L21265: Several methods have been proposed to moderate these updates.
L21266: Natural policy gradients
L21267: (Kakade, 2001) are based on natural gradients (Amari, 1998), which modify the descent di-
L21268: rection by the Fisher information matrix. This provides a better update which is less likely to
L21269: get stuck in local plateaus. However, the Fisher matrix is impractical to compute in models
L21270: with many parameters. In trust-region policy optimization or TRPO (Schulman et al., 2015),
L21271: the surrogate objective is maximized subject to a constraint on the KL divergence between the
L21272: old and new policies. Schulman et al. (2017) propose a simpler formulation in which this KL
L21273: divergence appears as a regularization term. The regularization weight is adapted based on
L21274: the distance between the KL divergence and a target indicating how much we want the policy
L21275: to change. Proximal policy optimization or PPO (Schulman et al., 2017) is an even simpler
L21276: approach in which the loss is clipped to ensure smaller updates.
L21277: Actor-critic:
L21278: In the actor-critic algorithm (Konda & Tsitsiklis, 1999) described in section 19.6,
L21279: the critic used a 1-step estimator.
L21280: It’s also possible to use k-step estimators (in which we
L21281: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L21284: <!-- page 413 -->
L21285: Notes
L21286: 399
L21287: observe k discounted rewards and approximate subsequent rewards with an estimate of the
L21288: state value).
L21289: As k increases, the variance of the estimate increases, but the bias decreases.
L21290: Generalized advantage estimation (Schulman et al., 2016) weights together estimates from many
L21291: steps and parameterizes the weighting by a single term that trades off the bias and the variance.
L21292: Mnih et al. (2016) introduced asynchronous actor-critic or A3C in which multiple agents are
L21293: run independently in parallel environments and update the same parameters. Both the policy
L21294: and value function are updated every T time steps using a mix of k-step returns. Wang et al.
L21295: (2017) introduced several methods designed to make asynchronous actor-critic more eﬀicient.
L21296: Soft actor-critic (Haarnoja et al., 2018b) adds an entropy term to the cost function, which
L21297: encourages exploration and reduces overfitting as the policy is encouraged to be less confident.
L21298: Offline RL:
L21299: In offline reinforcement learning, the policy is learned by observing the behavior
L21300: of other agents, including the rewards they receive, without the ability to change the policy. It
L21301: is related to imitation learning, where the goal is to copy the behavior of another agent without
L21302: access to rewards (see Hussein et al., 2017). One approach is to treat offline RL in the same
L21303: way as off-policy reinforcement learning. However, in practice, the distributional shift between
L21304: the observed and applied policy manifests in overly optimistic estimates of the action value
L21305: and poor performance (see Fujimoto et al., 2019; Kumar et al., 2019a; Agarwal et al., 2020).
L21306: Conservative Q-learning (Kumar et al., 2020b) learns conservative, lower-bound estimates of
L21307: the value function by regularizing the Q-values. The decision transformer (Chen et al., 2021c)
L21308: is a simple approach to offline learning that takes advantage of the well-studied self-attention
L21309: architecture. It can subsequently be fine-tuned with online training (Zheng et al., 2022).
L21310: Reinforcement learning and chatbots:
L21311: Chatbots can be trained using a technique known
L21312: as reinforcement learning with human feedback or RLHF (Christiano et al., 2018; Stiennon et al.,
L21313: 2020). For example, InstructGPT (the forerunner of ChatGPT, Ouyang et al., 2022) starts with
L21314: a standard transformer decoder model. This is then fine-tuned based on prompt-response pairs
L21315: where the response was written by human annotators. During this training step, the model is
L21316: optimized to predict the next word in the ground truth response.
L21317: Unfortunately, such training data are expensive to produce in suﬀicient quantities to support
L21318: high-quality performance. To resolve this problem, human annotators then indicate which of
L21319: several model responses they prefer. These (much cheaper) data are used to train a reward
L21320: model. This is a second transformer network that ingests the prompt and model response and
L21321: returns a scalar indicating how good the response is. Finally, the fine-tuned chatbot model is
L21322: further trained to produce high rewards using the reward model as supervision. Here, standard
L21323: gradient descent cannot be used as it’s not possible to compute derivatives through the sampling
L21324: procedure in the chatbot output. Hence, the model is trained with proximal policy optimization
L21325: (a policy gradient method where the derivatives are tractable) to generate higher rewards.
L21326: Other areas of RL:
L21327: Reinforcement learning is an enormous area, which easily justifies its
L21328: own book, and this literature review is extremely superficial. Other notable areas of RL that
L21329: we have not discussed include model-based RL, in which the state transition probabilities and
L21330: reward functions are modeled (see Moerland et al., 2023). This allows forward planning and
L21331: has the advantage that the same model can be reused for different reward structures. Hybrid
L21332: methods such as AlphaGo (Silver et al., 2016) and MuZero (Schrittwieser et al., 2020) have
L21333: separate models for the dynamics of the states, the policy, and the value of future positions.
L21334: This chapter has only discussed simple methods for exploration, like the epsilon-greedy ap-
L21335: proach, noisy Q-learning, and adding an entropy term to penalize overconfident policies. In-
L21336: trinsic motivation refers to methods that add rewards for exploration and thus imbue the agent
L21337: with “curiosity” (see Barto, 2013; Aubret et al., 2019). Hierarchical reinforcement learning (see
L21338: Pateria et al., 2021) refers to methods that break down the final objective into sub-tasks. Multi-
L21339: agent reinforcement learning (see Zhang et al., 2021a) considers the case where multiple agents
L21340: coexist in a shared environment. This may be in either a competitive or cooperative context.
L21341: Draft: please send errata to udlbookmail@gmail.com.
L21344: <!-- page 414 -->
L21345: 400
L21346: 19
L21347: Reinforcement learning
L21348: Problems
L21349: Problem 19.1 Figure 19.18 shows a single trajectory through an example Markov reward process.
L21350: Calculate the return for each step in the trajectory given that the discount factor γ is 0.9.
L21351: Problem 19.2∗Prove the policy improvement theorem. Consider changing from policy π to
L21352: policy π′, where for state st the new policy π′ chooses the action that maximizes the expected
L21353: return:
L21354: π′[at|st] ←argmax
L21355: at
L21356: 
L21357: r[st, at] + γ ·
L21358: X
L21359: st+1
L21360: Pr(st+1|st, at)v[st+1|π]
L21361: 
L21362: .
L21363: (19.43)
L21364: and for all other states, the policies are the same. Show that the value v[st|π] for the original
L21365: policy must be less than or equal to v[st|π′] for the new policy (notation indicates using π′ for
L21366: state st and π thereafter):
L21367: v[st|π]
L21368: ≤
L21369: q
L21370: h
L21371: st, π′[at|st]
L21375: π
L21376: i
L21377: =
L21378: Eπ′
L21379: h
L21380: rt+1 + γ · v[st+1|π]
L21381: i
L21382: .
L21383: (19.44)
L21384: Hint: Start by writing the term v[st+1|π] in terms of the new policy.
L21385: Problem 19.3 Show that when the state values and policy are initialized as in figure 19.10a,
L21386: they become those in figure 19.10b after two iterations of (i) policy evaluation (in which all
L21387: states are updated based on their current values and then replace the previous ones) and (ii)
L21388: policy improvement. The state transition allots half the probability to the direction the policy
L21389: indicates and divides the remaining probability equally between the other valid actions. The
L21390: reward function returns -2 irrespective of the action when the penguin leaves a hole. The reward
L21391: function returns +3 regardless of the action when the penguin leaves the fish tile and the episode
L21392: ends, so the fish tile has a value of +3. Assume a discount factor of γ = 0.9.
L21393: Problem 19.4 The Boltzmann policy strikes a balance between exploration and exploitation by
L21394: basing the action probabilities π[a|s] on the current state-action reward function q[s, a]:
L21395: π[a|s] =
L21396: exp
L21397: 
L21398: q[s, a]/τ
L21399: 
L21400: P
L21401: a′ exp
L21402: 
L21403: q[s, a′]/τ
L21404: .
L21405: (19.45)
L21406: Explain how the temperature parameter τ can be varied to prioritize exploration or exploitation.
L21407: Problem 19.5∗When the learning rate α is one, the Q-Learning update is given by:
L21408: f
L21409: 
L21410: q[s, a]
L21411: 
L21412: = r[s, a] + γ · max
L21413: a
L21414: 
L21415: q[s′, a]
L21416: 
L21417: .
L21418: (19.46)
L21419: where s is a state and s′ is the subsequent state. Show that this is a contraction mapping
L21420: (equation 16.20) so that:
L21430: f
L21431: 
L21432: q1[s, a]
L21433: 
L21434: −f
L21435: 
L21436: q2[s, a]
L21437: 
L21447: ∞
L21448: <
L21458: q1[s, a] −q2[s, a]
L21469: ∞
L21470: ∀q1, q2.
L21471: (19.47)
L21472: where ||•||∞represents the ℓ∞norm. It follows that a fixed point will exist by Banach’s theorem
L21473: Appendix B.3.2
L21474: Vector norms
L21475: and that the updates will eventually converge.
L21476: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L21479: <!-- page 415 -->
L21480: Notes
L21481: 401
L21482: Figure 19.18 One trajectory through an
L21483: MRP. The penguin receives a reward
L21484: of +1 when it reaches the first fish
L21485: tile, −2 when it falls in the hole, and +1
L21486: for reaching the second fish tile. The dis-
L21487: count factor γ is 0.9.
L21488: Problem 19.6 Show that:
L21489: Eτ
L21490:  ∂
L21491: ∂θ log
L21492: 
L21493: Pr(τ|θ)
L21494: 
L21495: b
L21496: 
L21497: = 0,
L21498: (19.48)
L21499: where b does not depend on τ, so adding a baseline update doesn’t change the expected policy
L21500: gradient update.
L21501: Problem 19.7∗Suppose that we want to estimate a quantity E[a] from samples a1, a2 . . . aI.
L21502: Consider that we also have paired samples b1, b2 . . . bI that are samples that co-vary with a
L21503: where E[b] = µb. We define a new variable:
L21504: a′ = a −c(b −µb).
L21505: (19.49)
L21506: Show that Var[a′] ≤Var[a] when the constant c is chosen judiciously. Find an expression for
L21507: the optimal value of c.
L21508: Problem 19.8 The estimate of the gradient in equation 19.34 can be written as:
L21509: Eτ
L21510: h
L21511: g[θ](r[τ t] −b)
L21512: i
L21513: ,
L21514: (19.50)
L21515: where
L21516: g[θ, τ] =
L21517: T
L21518: X
L21519: t=1
L21520: ∂log
L21521: 
L21522: Pr(at|st, θ)]
L21523: 
L21524: ∂θ
L21525: ,
L21526: (19.51)
L21527: and
L21528: r[τ] =
L21529: T
L21530: X
L21531: k=t
L21532: rk.
L21533: (19.52)
L21534: Show that the value of b that minimizes the variance of the gradient estimate is given by:
L21535: b = E
L21536: 
L21537: g[θ, τ]2r[τ]
L21538: 
L21539: E
L21540: 
L21541: g[θ, τ]2
L21542: .
L21543: (19.53)
L21544: You will need to use the result from equation 19.35.
L21545: Draft: please send errata to udlbookmail@gmail.com.
L21548: <!-- page 416 -->
L21549: Chapter 20
L21550: Why does deep learning work?
L21551: This chapter differs from those that precede it. Instead of presenting established results,
L21552: it poses questions about how and why deep learning works so well. These questions are
L21553: rarely discussed in textbooks. However, it’s important to realize that (despite the title
L21554: of this book) understanding of deep learning is still limited.
L21555: We argue that it is surprising that deep networks are easy to train and also surprising
L21556: that they generalize. Then we consider each of these topics in turn. We enumerate the
L21557: factors that influence training success and discuss what is known about loss functions for
L21558: deep networks. Then we consider the factors that influence generalization. We conclude
L21559: with a discussion of whether networks need to be overparameterized and deep.
L21560: 20.1
L21561: The case against deep learning
L21562: The MNIST-1D dataset (figure 8.1) has just forty input dimensions and ten output
L21563: dimensions. With enough hidden units per layer, a two-layer fully connected network
L21564: classifies 10000 MNIST-1D training data points perfectly and generalizes reasonably to
L21565: unseen examples (figure 8.10a). Indeed, we now take it for granted that with suﬀicient
L21566: hidden units, deep networks will classify almost any training set near-perfectly. We also
L21567: take for granted that the fitted model will generalize to new data. However, it’s not at
L21568: all obvious either that the training process should succeed or that the resulting model
L21569: should generalize. This section argues that both these phenomena are surprising.
L21570: 20.1.1
L21571: Training
L21572: Performance of a two-layer fully connected network on 10000 MNIST-1D training exam-
L21573: ples is perfect once there are 43 hidden units per layer or ∼4000 parameters (figure 8.10).
L21574: However, finding the global minimum of an arbitrary non-convex function is NP-hard
L21575: (Murty & Kabadi, 1987), and this is also true for certain neural network loss functions
L21576: (Blum & Rivest, 1992). It’s remarkable that the fitting algorithm doesn’t get trapped in
L21577: local minima or stuck near saddle points and that it can eﬀiciently recruit spare model
L21578: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L21581: <!-- page 417 -->
L21582: 20.2
L21583: Factors that influence fitting performance
L21584: 403
L21585: capacity to fit unexplained training data wherever they lie.
L21586: Perhaps this success is less surprising when there are far more parameters than train-
L21587: ing data. However, it’s debatable whether this is generally the case. AlexNet had ∼60
L21588: million parameters and was trained with ∼1 million data points. However, to complicate
L21589: matters, each training example was augmented with 2048 transformations. GPT-3 had
L21590: 175 billion parameters and was trained with 300 billion tokens. There is not a clear-cut
L21591: case that either model was overparameterized, and yet they were successfully trained.
L21592: In short, it’s surprising that we can fit deep networks reliably and eﬀiciently. Either
L21593: the data, the models, the training algorithms, or some combination of all three must
L21594: have some special properties that make this possible.
L21595: 20.1.2
L21596: Generalization
L21597: If the eﬀicient fitting of neural networks is startling, their generalization to new data
L21598: is dumbfounding. First, it’s not obvious a priori that typical datasets are suﬀicient to
L21599: characterize the input/output mapping. The curse of dimensionality implies that the
L21600: training dataset is tiny compared to the possible inputs; if each of the 40 inputs of the
L21601: MNIST-1D data were quantized into 10 possible values, there would be 1040 possible
L21602: inputs, which is a factor of 1036 more than the number of training examples.
L21603: Problem 20.1
L21604: Second, deep networks describe very complicated functions. For example, a fully con-
L21605: nected network for MNIST-1D with two hidden layers of width 400 can create mappings
L21606: with up to 1042 linear regions. That’s roughly 1038 regions per training example, so very
L21607: few of these regions contain data at any stage during training; regardless, those regions
L21608: that do encounter data points constrain the remaining regions to behave reasonably.
L21609: Third, generalization gets better with more parameters (figure 8.10). The model in the
L21610: previous paragraph has 177,201 parameters. Assuming it can fit one training example
L21611: per parameter, it has 167,201 spare degrees of freedom. This surfeit gives the model
L21612: latitude to do almost anything between the training data, and yet it behaves sensibly.
L21613: 20.1.3
L21614: The unreasonable effectiveness of deep learning
L21615: To summarize, it’s neither obvious that we should be able to fit deep networks nor that
L21616: they should generalize. A priori, deep learning shouldn’t work. And yet it does. This
L21617: chapter investigates why. Sections 20.2–20.3 describe what we know about fitting deep
L21618: networks and their loss functions. Sections 20.4–20.6 examine generalization.
L21619: 20.2
L21620: Factors that influence fitting performance
L21621: Figure 6.4 showed that loss functions for nonlinear models can have both local minima
L21622: and saddle points. However, we can reliably fit deep networks to complex training sets.
L21623: For example, figure 8.10 shows perfect training performance on MNIST-1D, MNIST, and
L21624: CIFAR-100. This section considers factors that might resolve this contradiction.
L21625: Draft: please send errata to udlbookmail@gmail.com.
L21628: <!-- page 418 -->
L21629: 404
L21630: 20
L21631: Why does deep learning work?
L21632: Figure 20.1 Fitting random data. Losses
L21633: for
L21634: AlexNet
L21635: architecture
L21636: trained
L21637: on
L21638: CIFAR-10 dataset with SGD. When
L21639: the pixels are drawn from a Gaus-
L21640: sian random distribution with the same
L21641: mean and variance as the original image
L21642: dataset, the model can still be fit (albeit
L21643: more slowly). When the labels are ran-
L21644: domized, the model can still be fit (albeit
L21645: even more slowly). Adapted from Zhang
L21646: et al. (2017a).
L21647: 20.2.1
L21648: Dataset
L21649: It’s important to realize that we can’t learn any function. Consider a completely random
L21650: mapping from every possible 28×28 binary image to one of ten categories. Since there
L21651: is no structure to this function, the only recourse is to memorize the 2784 assignments.
L21652: However, it’s easy to train a model on the MNIST dataset (figures 8.10 and 15.15),
L21653: which contains 60,000 examples of 28×28 images labeled with one of ten categories. One
L21654: explanation for this contradiction could be that it is easy to find global minima because
L21655: the real-world functions that we approximate are relatively simple.1
L21656: This hypothesis was investigated by Zhang et al. (2017a), who trained AlexNet on
L21657: Notebook 20.1
L21658: Random data
L21659: the CIFAR-10 image classification dataset (which has 50,000 examples of 32 × 32 × 3
L21660: images labeled with one of 10 classes) when (i) each image was replaced with Gaussian
L21661: noise and (ii) the labels of the ten classes were randomly permuted (figure 20.1). These
L21662: changes slowed down learning, but the network could still fit this finite dataset well.
L21663: Problem 20.2
L21664: This suggests that the properties of the dataset aren’t critical.
L21665: 20.2.2
L21666: Regularization
L21667: Another possible explanation for the ease with which models are trained is that some
L21668: regularization methods like L2 regularization (weight decay) make the loss surface flatter
L21669: and more convex. However, Zhang et al. (2017a) found that neither L2 regularization nor
L21670: Dropout was required to fit random data. This does not eliminate implicit regularization
L21671: due to the finite step size of the fitting algorithms (section 9.2). However, this effect
L21672: increases with the learning rate (equation 9.9), and model-fitting does not get easier
L21673: with larger learning rates.
L21674: 20.2.3
L21675: Stochastic training algorithms
L21676: Chapter 6 argued that the SGD algorithm potentially allows the optimization trajectory
L21677: to move between “valleys” during training. However, Keskar et al. (2017) show that
L21678: 1In this chapter, we use the term “global minimum” loosely to mean any solution where all data are
L21679: classified correctly. We have no way of knowing if there are solutions with a lower loss elsewhere.
L21680: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L21683: <!-- page 419 -->
L21684: 20.2
L21685: Factors that influence fitting performance
L21686: 405
L21687: Figure 20.2 MNIST-1D training.
L21688: Four
L21689: fully connected networks were fit to 4000
L21690: MNIST-1D examples with random labels
L21691: using full batch gradient descent, He ini-
L21692: tialization, no momentum or regulariza-
L21693: tion, and learning rate 0.0025.
L21694: Mod-
L21695: els with 1,2,3,4 layers had 298, 100, 75,
L21696: and 63 hidden units per layer and 15208,
L21697: 15210, 15235, and 15139 parameters, re-
L21698: spectively. All models train successfully,
L21699: but deeper models require fewer epochs.
L21700: several models (including fully connected and convolutional networks) can be fit to many
L21701: datasets (including CIFAR-100 and MNIST) almost perfectly with very large batches of
L21702: 5000-6000 images. This eliminates most of the randomness but training still succeeds.
L21703: Figure 20.2 shows training results for four fully connected models fitted to 4000
L21704: Notebook 20.2
L21705: Full batch
L21706: gradient descent
L21707: MNIST-1D examples with randomized labels using full-batch (i.e., non-stochastic) gra-
L21708: dient descent. There was no explicit regularization, and the learning rate was set to a
L21709: small constant value of 0.0025 to minimize implicit regularization. Here, the true map-
L21710: Problem 20.3
L21711: ping from data to labels has no structure, the training is deterministic, and there is no
L21712: regularization, and yet the training error still decreases to zero. This suggests that these
L21713: loss functions may genuinely have no local minima.
L21714: 20.2.4
L21715: Overparameterization
L21716: Overparameterization almost certainly is an important factor that contributes to ease
L21717: of training. It implies that there is a large family of degenerate solutions, so there may
L21718: always be a direction in which the parameters can be modified to decrease the loss.
L21719: Sejnowski (2020) suggests that “. . . the degeneracy of solutions changes the nature of
L21720: the problem from finding a needle in a haystack to a haystack of needles.”
L21721: In practice, networks are frequently overparameterized by one or two orders of mag-
L21722: nitude (figure 20.3).
L21723: However, data augmentation makes it diﬀicult to make precise
L21724: statements. Augmentation may increase the data by several orders of magnitude, but
L21725: these are manipulations of existing examples rather than independent new data points.
L21726: Moreover, figure 8.10 shows that neural networks can sometimes fit the training data
L21727: well when there are the same number or fewer parameters than data points. This is
L21728: presumably due to redundancy in training examples from the same underlying function.
L21729: Several theoretical convergence results show that, under certain circumstances, SGD
L21730: converges to a global minimum when the network is suﬀiciently overparameterized. For
L21731: example, Du et al. (2019b) show that randomly initialized SGD converges to a global
L21732: minimum for shallow fully connected ReLU networks with a least squares loss with
L21733: enough hidden units. Similarly, Du et al. (2019a) consider deep, residual, and convolu-
L21734: tional networks when the activation function is smooth and Lipschitz. Zou et al. (2020)
L21735: analyzed the convergence of gradient descent on deep, fully connected networks using a
L21736: hinge loss. Allen-Zhu et al. (2019) considered deep networks with ReLU functions.
L21737: Draft: please send errata to udlbookmail@gmail.com.
L21740: <!-- page 420 -->
L21741: 406
L21742: 20
L21743: Why does deep learning work?
L21744: Figure 20.3 Overparameterization.
L21745: Im-
L21746: ageNet performance for convolutional
L21747: nets as a function of overparameteriza-
L21748: tion (in multiples of dataset size). Most
L21749: models have 10–100 times more param-
L21750: eters than there were training exam-
L21751: ples. Models compared are ResNet (He
L21752: et al., 2016a,b), DenseNet (Huang et al.,
L21753: 2017b), Xception (Chollet, 2017), Eﬀi-
L21754: cientNet (Tan & Le, 2019), Inception
L21755: (Szegedy et al., 2017), ResNeXt (Xie
L21756: et al., 2017), and AmoebaNet (Cubuk
L21757: et al., 2019).
L21758: If a neural network is suﬀiciently overparameterized so that it can memorize any
L21759: dataset of a fixed size, then all stationary points become global minima (Livni et al.,
L21760: 2014; Nguyen & Hein, 2017, 2018).
L21761: Other results show that if the network is wide
L21762: enough, local minima where the loss is higher than the global minimum are rare (see
L21763: Choromanska et al., 2015; Pascanu et al., 2014; Pennington & Bahri, 2017). Kawaguchi
L21764: et al. (2019) prove that as a network becomes deeper, wider, or both, the loss at local
L21765: minima becomes closer to that at the global minimum for squared loss functions.
L21766: These theoretical results are intriguing but usually make unrealistic assumptions
L21767: about the network structure. For example, Du et al. (2019a) show that residual networks
L21768: converge to zero training loss when the width of the network D (i.e., the number of hidden
L21769: units) is Ω[I4K2] where I is the amount of training data, and K is the depth of the
L21770: network. Similarly, Nguyen & Hein (2017) assume that the network’s width is larger than
L21771: the dataset size, which is unrealistic in most practical scenarios. Overparameterization
L21772: seems to be important, but theory cannot yet explain empirical fitting performance.
L21773: 20.2.5
L21774: Activation functions
L21775: The activation function is also known to affect training diﬀiculty. Networks where the
L21776: activation only changes over a small part of the input range are harder to fit than ReLUs
L21777: (which vary over half the input range) or Leaky ReLUs (which vary over the full range);
L21778: For example, sigmoid and tanh nonlinearities (figure 3.13a) have shallow gradients in
L21779: their tails; where the activation function is near-constant, the training gradient is near-
L21780: zero, so the mechanism to improve the model is extremely weak.
L21781: 20.2.6
L21782: Initialization
L21783: Another potential explanation is that Xavier/He initialization sets the parameters to
L21784: values that are easy to optimize. Of course, for deeper networks, such initialization is
L21785: necessary to avoid exploding and vanishing gradients, so in a trivial sense, initialization
L21786: is critical to training success. However, for shallower networks, the initial variance of the
L21787: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L21790: <!-- page 421 -->
L21791: 20.3
L21792: Properties of loss functions
L21793: 407
L21794: Figure 20.4 Initialization and fitting. A
L21795: three-layer fully connected network with
L21796: 200 hidden units per layer was trained
L21797: on 1000 MNIST examples with AdamW
L21798: using one-hot targets and mean-squared
L21799: error loss. It takes longer to fit networks
L21800: when larger multiples of He initialization
L21801: are used, but this doesn’t change the out-
L21802: come.
L21803: This may simply reflect the ex-
L21804: tra distance that the weights must move.
L21805: Adapted from Liu et al. (2023c).
L21806: weights is less important. Liu et al. (2023c) trained a 3-layer fully connected network with
L21807: 200 hidden units per layer on 1000 MNIST data points. They found that more iterations
L21808: were required to fit the training data as the variance increased from that proposed by He
L21809: (figure 20.4), but this did not ultimately impede fitting. Hence, initialization doesn’t shed
L21810: much light on why fitting neural networks is easy, although exploding/vanishing gradients
L21811: do reveal initializations that make training diﬀicult with finite precision arithmetic.
L21812: 20.2.7
L21813: Network depth
L21814: Neural networks are harder to fit when the depth becomes very large due to exploding
L21815: and vanishing gradients (figure 7.7) and shattered gradients (figure 11.3).
L21816: However,
L21817: these are (arguably) practical numerical issues.
L21818: There is no definitive evidence that
L21819: the underlying loss function is fundamentally more or less convex as the network depth
L21820: increases. Figure 20.2 does show that for MNIST data with randomized labels and He
L21821: initialization, deeper networks train in fewer iterations. However, this might be because
L21822: either (i) the gradients in deeper networks are steeper or (ii) He initialization just starts
L21823: wider, shallower networks further away from the optimal parameters.
L21824: Frankle & Carbin (2019) show that for small networks like VGG, you can get the
L21825: same or better performance if you (i) train the network, (ii) prune the weights with
L21826: the smallest magnitudes and (iii) retrain from the same initial weights. This does not
L21827: work if the weights are randomly re-initialized. They concluded that the original over-
L21828: parameterized network contains small trainable sub-networks, which are suﬀicient to
L21829: Notebook 20.3
L21830: Lottery tickets
L21831: provide the performance. They term this the lottery ticket hypothesis and denote the
L21832: sub-networks as winning tickets. This suggests that the effective number of sub-networks
L21833: may have a key role to play in fitting. This (perhaps) varies with the network depth for
L21834: a fixed parameter count, but a precise characterization of this idea is lacking.
L21835: 20.3
L21836: Properties of loss functions
L21837: The previous section discussed factors that contribute to the ease with which neural net-
L21838: works can be trained. The number of parameters (degree of overparameterization) and
L21839: Draft: please send errata to udlbookmail@gmail.com.
L21842: <!-- page 422 -->
L21843: 408
L21844: 20
L21845: Why does deep learning work?
L21846: the choice of activation function are both important. Surprisingly, the choice of dataset,
L21847: the randomness of the fitting algorithm, and the use of regularization don’t seem impor-
L21848: tant. There is no definitive evidence that (for a fixed parameter count) the depth of the
L21849: network matters (other than numerical problems due to exploding/vanishing/shattered
L21850: gradients). This section tackles the same topic from a different angle by considering the
L21851: empirical properties of loss functions. Most of this evidence comes from fully connected
L21852: networks and CNNs; loss functions of transformer networks are less well understood.
L21853: 20.3.1
L21854: Multiple global minima
L21855: We expect loss functions for deep networks to have a large family of equivalent global
L21856: minima. In fully connected networks, the hidden units at each layer and their associated
L21857: weights can be permuted without changing the output. In convolutional networks, per-
L21858: muting the channels and convolution kernels appropriately doesn’t change the output.
L21859: We can multiply the weight before any ReLU function and divide the weight after by a
L21860: positive number without changing the output. Using BatchNorm induces another set of
L21861: redundancies because the mean and variance of each hidden unit or channel are reset.
L21862: The above modifications all produce the same output for every input. However, the
L21863: global minimum only depends on the output at the training data points. In overparam-
L21864: eterized networks, there will also be families of solutions that behave identically at the
L21865: data points but differently between them. All of these are also global minima.
L21866: 20.3.2
L21867: Route to the minimum
L21868: Goodfellow et al. (2015b) considered a straight line between the initial parameters and
L21869: the final values.
L21870: They show that the loss function along this line usually decreases
L21871: monotonically (except for a small bump near the start sometimes). This phenomenon is
L21872: observed for several different types of networks and activation functions (figure 20.5a).
L21873: Of course, real optimization trajectories do not proceed in a straight line. However,
L21874: Li et al. (2018b) find that they do lie in low-dimensional subspaces. They attribute this
L21875: to the existence of large, nearly convex regions in the loss landscape that capture the
L21876: trajectory early on and funnel it in a few important directions. Surprisingly, Li et al.
L21877: (2018a) showed that networks still train well if optimization is constrained to lie in a
L21878: random low-dimensional subspace (figure 20.6).
L21879: Li & Liang (2018) show that the relative change in the parameters during training
L21880: decreases as network width increases; for larger widths, the parameters start at smaller
L21881: values, change by a smaller proportion of those values, and converge in fewer steps.
L21882: 20.3.3
L21883: Connections between minima
L21884: Goodfellow et al. (2015b) examined the loss function along a straight line between two
L21885: minima that were found independently. They saw a pronounced increase in the loss be-
L21886: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L21889: <!-- page 423 -->
L21890: 20.3
L21891: Properties of loss functions
L21892: 409
L21893: Figure 20.5 Linear slices through loss function. a) A two-layer fully connected
L21894: ReLU network is trained on MNIST. The loss along a straight line starting at the
L21895: initial parameters (δ=0) and finishing at the trained parameters (δ=1) descends
L21896: monotonically. b) However, in this two-layer fully connected MaxOut network on
L21897: MNIST, there is an increase in the loss along a straight line between one solution
L21898: (δ=0) and another (δ=1). Adapted from Goodfellow et al. (2015b).
L21899: Figure 20.6 Subspace training.
L21900: A fully
L21901: connected network with two hidden lay-
L21902: ers, each with 200 units was trained on
L21903: MNIST. Parameters were initialized us-
L21904: ing a standard method but then con-
L21905: strained to lie within a random sub-
L21906: space. Performance reaches 90% of the
L21907: unconstrained level when this subspace is
L21908: 750D (termed the intrinsic dimension),
L21909: which is 0.4% of the original parameters.
L21910: Adapted from Li et al. (2018a).
L21911: tween them (figure 20.5b); good minima are not generally linearly connected. However,
L21912: Frankle et al. (2020) showed that this increase vanishes if the networks are identically
L21913: trained initially and later allowed to diverge by using different SGD noise and augmen-
L21914: tation. This suggests that the solution is constrained early in training and that some
L21915: families of minima are linearly connected.
L21916: Draxler et al. (2018) found minima with good (but different) performance on the
L21917: CIFAR-10 dataset. They then showed that it is possible to construct paths from one to
L21918: the other, where the loss function remains low along this path. They conclude that there
L21919: is a single connected manifold of low loss (figure 20.7). This seems to be increasingly
L21920: true as the width and depth of the network increase. Garipov et al. (2018) and Fort &
L21921: Jastrzębski (2019) present other schemes for connecting minima.
L21922: Draft: please send errata to udlbookmail@gmail.com.
