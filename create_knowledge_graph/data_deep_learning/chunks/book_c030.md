L19766: <!-- page 387 -->
L19767: Notes
L19768: 373
L19769: Problem 18.5∗Prove the relation:
L19770: Normx[a, A]Normx[b, B] ∝Normx
L19771: h
L19772: (A−1 + B−1)−1(A−1a + B−1b), (A−1 + B−1)−1i
L19773: .
L19774: (18.47)
L19775: Problem 18.6∗Derive equation 18.15.
L19776: Problem 18.7∗Derive the third line of equation 18.25 from the second line.
L19777: Problem 18.8∗The KL-divergence between two normal distributions in D dimensions with
L19778: means a and b and covariance matrices A and B is given by:
L19779: DKL
L19780: h
L19781: Normw[a, A]
L19786: Normw[b, B]
L19787: i
L19788: = 1
L19789: 2
L19790: 
L19791: tr
L19792: 
L19793: B−1A
L19794: 
L19795: −d + (a −b)T B−1(a −b) + log
L19796:  |B|
L19797: |A|
L19798: 
L19799: .
L19800: (18.48)
L19801: Substitute the definitions from equation 18.27 into this expression and show that the only term
L19802: that depends on the parameters ϕ is the first term from equation 18.28.
L19803: Problem 18.9∗If αt = Qt
L19804: s=1 1 −βs, then show that:
L19805: r αt
L19806: αt−1 =
L19807: p
L19808: 1 −βt.
L19809: (18.49)
L19810: Problem 18.10∗If αt = Qt
L19811: s=1 1 −βs, then show that:
L19812: (1 −αt−1)(1 −βt) + βt
L19813: (1 −αt)√1 −βt
L19814: =
L19815: 1
L19816: √1 −βt
L19817: .
L19818: (18.50)
L19819: Problem 18.11∗Prove equation 18.38.
L19820: Problem 18.12 Classifier-free guidance allows us to create more stereotyped “canonical” images
L19821: of a given class. When we described transformer decoders, generative adversarial networks, and
L19822: the GLOW algorithm, we also discussed methods to reduce the amount of variation and produce
L19823: more stereotyped outputs. What were these? Do you think it’s inevitable that we should limit
L19824: the output of generative models in this way?
L19825: Draft: please send errata to udlbookmail@gmail.com.
L19828: <!-- page 388 -->
L19829: Chapter 19
L19830: Reinforcement learning
L19831: Reinforcement learning (RL) is a sequential decision-making framework in which agents
L19832: learn to perform actions in an environment with the goal of maximizing received rewards.
L19833: For example, an RL algorithm might control the moves (actions) of a character (the
L19834: agent) in a video game (the environment), aiming to maximize the score (the reward).
L19835: In robotics, an RL algorithm might control the movements (actions) of a robot (the
L19836: agent) in the world (the environment) to perform a task (earning a reward). In finance,
L19837: an RL algorithm might control a virtual trader (the agent) who buys or sells assets (the
L19838: actions) on a financial exchange (the environment) to maximize profit (the reward).
L19839: Consider learning to play chess. Here, there is a reward of +1, −1, or 0 at the end of
L19840: the game if the agent wins, loses, or draws and 0 at every other time step. This illustrates
L19841: the challenges of RL. First, the reward is sparse; here, we must play an entire game to
L19842: receive feedback. Second, the reward is temporally offset from the action that caused it;
L19843: a decisive advantage might be gained thirty moves before victory. We must associate the
L19844: reward with this critical action. This is termed the temporal credit assignment problem.
L19845: Third, the environment is stochastic; the opponent doesn’t always make the same move
L19846: in the same situation, so it’s hard to know if an action was truly good or just lucky.
L19847: Finally, the agent must balance exploring the environment (e.g., trying new opening
L19848: moves) with exploiting what it already knows (e.g., sticking to a previously successful
L19849: opening). This is termed the exploration-exploitation trade-off.
L19850: Reinforcement learning is an overarching framework that does not necessarily require
L19851: deep learning. However, in practice, state-of-the-art systems often use deep networks.
L19852: They encode the environment (the video game display, robot sensors, financial time
L19853: series, or chessboard) and map this directly or indirectly to the next action (figure 1.13).
L19854: 19.1
L19855: Markov decision processes, returns, and policies
L19856: Reinforcement learning maps observations of an environment to actions, aiming to maxi-
L19857: mize a numerical quantity that is connected to the rewards received. In the most common
L19858: case, we learn a policy that maximizes the expected return in a Markov decision process.
L19859: This section explains these terms.
L19860: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L19863: <!-- page 389 -->
L19864: 19.1
L19865: Markov decision processes, returns, and policies
L19866: 375
L19867: Figure 19.1 Markov process. A Markov process consists of a set of states and tran-
L19868: sition probabilities Pr(st+1|st) that define the probability of moving to state st+1
L19869: given the current state is st.
L19870: a) The penguin can visit 16 different positions
L19871: (states) on the ice. b) The ice is slippery, so at each time, it has an equal proba-
L19872: bility of moving to any adjacent state. For example, in position 6, it has a 25%
L19873: chance of moving to states 2, 5, 7, and 10. A trajectory τ = [s1, s2, s3, . . .] from
L19874: this process consists of a sequence of states.
L19875: 19.1.1
L19876: Markov process
L19877: A Markov process assumes that the world is always in one of a set of possible states.
L19878: The word Markov implies that the probability of being in a state depends only on the
L19879: previous state and not on the states before. The changes between states are captured by
L19880: the transition probabilities Pr(st+1|st) of moving to the next state st+1 given the current
L19881: state st, where t indexes the time step. Hence, a Markov process is an evolving system
L19882: that produces a sequence s1, s2, s3 . . . of states (figure 19.1).
L19883: 19.1.2
L19884: Markov reward process
L19885: A Markov reward process extends the Markov process to include a distribution Pr(rt+1|st)
L19886: over the possible rewards rt+1 received at the next time step, given that we are in state st.
L19887: Problem 19.1
L19888: This produces a sequence s1, r2, s2, r3, s3, r4 . . . of states and the associated rewards (fig-
L19889: ure 19.2). The Markov reward process also includes a discount factor γ ∈(0, 1] that is
L19890: used to compute the return Gt at time t:
L19891: Gt =
L19892: ∞
L19893: X
L19894: k=0
L19895: γkrt+k+1.
L19896: (19.1)
L19897: The return is the sum of the cumulative discounted future rewards; it measures the future
L19898: benefit of being on this trajectory. A discount factor of less than one makes rewards that
L19899: are closer in time more valuable than rewards that are further away.
L19900: Draft: please send errata to udlbookmail@gmail.com.
L19903: <!-- page 390 -->
L19904: 376
L19905: 19
L19906: Reinforcement learning
L19907: Figure 19.2 Markov reward process. This associates a distribution Pr(rt+1|st)
L19908: of rewards rt+1 with each state st. a) Here, the rewards are deterministic; the
L19909: penguin will receive a reward of +1 if it lands on a fish and 0 otherwise. The
L19910: trajectory τ now consists of a sequence s1, r2, s2, r3, s3, r4 . . . of alternating states
L19911: and rewards, terminating after eight steps. The return Gt of the sequence is the
L19912: sum of discounted future rewards, here with discount factor γ = 0.9. b-c) As the
L19913: penguin proceeds along the trajectory and gets closer to reaching the rewards,
L19914: the return increases.
L19915: Figure 19.3 Markov decision process. a) The agent (penguin) can perform one
L19916: of a set of actions in each state. b) Here, the four actions correspond to moving
L19917: up, right, down, and left. c) For any state (here, state 6), the action changes
L19918: the probability of moving to the next state. The penguin moves in the intended
L19919: direction with 50% probability, but the ice is slippery, so it may slide to one
L19920: of the other adjacent positions with equal probability.
L19921: Accordingly, in panel
L19922: (a), the action taken (gray arrows) doesn’t always line up with the trajectory
L19923: (orange line). In general, the action can also influence the probability of receiving
L19924: rewards, but in this example the reward is the same regardless of the action,
L19925: so Pr(rt+1|st, at) = Pr(rt+1|st). The trajectory τ from an MDP consists of a
L19926: sequence s1, a1, r2, s2, a2, r3, s3, a3, r4 . . . of alternating states st, actions at, and
L19927: rewards, rt+1. Note that here the penguin receives the reward when it leaves a
L19928: state with a fish (i.e., the reward is received for passing through the fish square,
L19929: regardless of whether the penguin arrived there intentionally or not).
L19930: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L19933: <!-- page 391 -->
L19934: 19.1
L19935: Markov decision processes, returns, and policies
L19936: 377
L19937: Figure 19.4 Partially observable Markov
L19938: decision
L19939: process
L19940: (POMDP).
L19941: In
L19942: a
L19943: POMDP, the agent does not have access
L19944: to the entire state.
L19945: Here, the penguin
L19946: does not know the current state and
L19947: can only see tiles in the vicinity (dashed
L19948: box).
L19949: Unfortunately,
L19950: the true state
L19951: (three) is indistinguishable from what it
L19952: would see in state nine. In the first case,
L19953: moving right leads to the hole in the ice
L19954: (with -2 reward) and, in the latter, to
L19955: the fish (with +3 reward).
L19956: Figure 19.5 Policies. a) A deterministic policy always chooses the same action in
L19957: each state (indicated by arrow). Some policies are better than others. This policy
L19958: is not optimal but still generally steers the penguin from top-left to bottom-right
L19959: where the reward lies. b) This policy is more random. c) A stochastic policy has
L19960: a probability distribution over actions for each state (probability indicated by
L19961: size of arrows). This has the advantage that the agent explores the states more
L19962: thoroughly and can be necessary for optimal performance in partially observable
L19963: Markov decision processes.
L19964: Figure 19.6
L19965: Reinforcement
L19966: learning
L19967: loop.
L19968: The agent takes an action at at
L19969: time t based on the state st, according
L19970: to the policy π[at|st].
L19971: This triggers
L19972: the generation of a new state st+1 (via
L19973: the state transition function) and a
L19974: reward rt+1 (via the reward function).
L19975: Both are passed back to the agent,
L19976: which then chooses a new action.
L19977: Draft: please send errata to udlbookmail@gmail.com.
L19980: <!-- page 392 -->
L19981: 378
L19982: 19
L19983: Reinforcement learning
L19984: 19.1.3
L19985: Markov decision process
L19986: A Markov decision process or MDP adds a set of possible actions at each time step. The
L19987: action at changes the transition probabilities, which are now written as Pr(st+1|st, at).
L19988: The rewards can also depend on the action and are now written as Pr(rt+1|st, at). An
L19989: MDP produces a sequence (s1, a1, r2), (s2, a2, r3), (s3, a3, r4) . . . of states st, actions at,
L19990: and rewards rt+1 which are received at the subsequent time-step (figure 19.3). The entity
L19991: that performs the actions is known as the agent.
L19992: 19.1.4
L19993: Partially observable Markov decision process
L19994: In a partially observable Markov decision process or POMDP, the state is not directly
L19995: visible (figure 19.4). Instead, the agent receives an observation ot drawn from Pr(ot|st).
L19996: Hence, a POMDP generates a sequence s1, o1, a1, r2, s2, o2, a2, r3, o3, a3, s3, r4, . . . of states,
L19997: observations, actions, and rewards. In general, each observation will be more compatible
L19998: with some states than others but insuﬀicient to identify the state uniquely.
L19999: 19.1.5
L20000: Policy
L20001: The rules that determine the agent’s action for each state are known as the policy (fig-
L20002: ure 19.5). This may be stochastic (the policy defines a distribution over actions for each
L20003: state) or deterministic (the agent always takes the same action in a given state). A
L20004: stochastic policy π[a|s] returns a probability distribution over each possible action a for
L20005: state s, from which a new action is sampled. A deterministic policy π[a|s] returns one for
L20006: the action a that is chosen for state s and zero otherwise. A stationary policy depends
L20007: only on the current state. A non-stationary policy also depends on the time step.
L20008: The environment and the agent form a loop (figure 19.6). The agent receives the
L20009: Notebook 19.1
L20010: Markov decision
L20011: processes
L20012: state st and reward rt from the last time step. Based on this, it can modify the policy
L20013: π[at|st] if desired and choose the next action at. The environment then advances to the
L20014: next state according to Pr(st+1|st, at) and issues a reward according to Pr(rt+1|st, at).
L20015: 19.2
L20016: Expected return
L20017: The previous section introduced the Markov decision process and the idea of an agent
L20018: carrying out actions according to a policy. We want to choose a policy that maximizes
L20019: the expected return. In this section, we make this idea mathematically precise. To do
L20020: that, we assign a value to each state st and state-action pair {st, at}.
L20021: 19.2.1
L20022: State and action values
L20023: The return Gt depends on the state st and the policy π[a|s].
L20024: From this state, the
L20025: agent will pass through a sequence of states, taking actions and receiving rewards. This
L20026: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L20029: <!-- page 393 -->
L20030: 19.2
L20031: Expected return
L20032: 379
L20033: Figure 19.7 State and action values. a) The value v[st|π] of a state st (number at
L20034: each position) is the expected return for this state for a given policy π (gray ar-
L20035: rows). It is the average sum of discounted rewards received over many trajectories
L20036: started from this state. Here, states closer to the fish are more valuable. b) The
L20037: value q[st, at, π] of an action at in state st (four numbers at each position/state
L20038: corresponding to four actions) is the expected return given that this particular
L20039: action is taken in this state. In this case, it gets larger as we get closer to the fish
L20040: and is larger for actions that head in the direction of the fish. c) If we know the
L20041: action values at a state, then the policy can be modified so that it chooses the
L20042: maximum of these values (red numbers in panel b).
L20043: sequence differs every time the agent starts in the same place since, in general, the policy
L20044: π[at|st], the state transitions Pr(st+1|st, at), and the rewards issued Pr(rt+1|st, at) are
L20045: all stochastic.
L20046: We can characterize how “good” a state is under a given policy π by considering
L20047: Appendix C.2
L20048: Expectation
L20049: the expected return v[st|π]. This is the return that would be received on average from
L20050: sequences that start from this state and is termed the state value or state-value function
L20051: (figure 19.7a):
L20052: v[st|π] = E
L20053: h
L20054: Gt|st, π
L20055: i
L20056: .
L20057: (19.2)
L20058: Informally, the state value tells us the long-term reward we can expect on average if
L20059: we start in this state and follow the specified policy thereafter. It is highest for states
L20060: where it’s probable that subsequent transitions will bring large rewards soon (assuming
L20061: the discount factor γ is less than one).
L20062: Similarly, the action value or state-action value function q[st, at|π] is the expected
L20063: return from executing action at in state st (figure 19.7b):
L20064: q[st, at|π] = E
L20065: h
L20066: Gt|st, at, π
L20067: i
L20068: .
L20069: (19.3)
L20070: The action value tells us the long-term reward we can expect on average if we start in this
L20071: state, take this action, and follow the specified policy thereafter. Through this quantity,
L20072: reinforcement learning algorithms connect future rewards to current actions (i.e., resolve
L20073: the temporal credit assignment problem).
L20074: Draft: please send errata to udlbookmail@gmail.com.
L20077: <!-- page 394 -->
L20078: 380
L20079: 19
L20080: Reinforcement learning
L20081: 19.2.2
L20082: Optimal policy
L20083: We want a policy that maximizes the expected return. For MDPs (but not POMDPs),
L20084: there is always a deterministic, stationary policy that maximizes the value of every state.
L20085: If we know this optimal policy, then we get the optimal state-value function v∗[st]:
L20086: v∗[st] = max
L20087: π
L20088: 
L20089: E
L20090: h
L20091: Gt|st, π
L20092: i
L20093: .
L20094: (19.4)
L20095: Similarly, the optimal state-action value function is obtained under the optimal policy:
L20096: q∗[st, at] = max
L20097: π
L20098: h
L20099: E
L20100: h
L20101: Gt|st, at, π
L20102: ii
L20103: .
L20104: (19.5)
L20105: Turning this on its head, if we knew the optimal action-values q∗[st, at], then we could
L20106: derive the optimal policy by choosing the action at with the highest value (figure 19.7c):1
L20107: π[at|st] ←argmax
L20108: at
L20109: h
L20110: q∗[st, at]
L20111: i
L20112: .
L20113: (19.6)
L20114: Indeed, some reinforcement learning algorithms are based on alternately estimating the
L20115: action values and the policy (see section 19.3).
L20116: 19.2.3
L20117: Bellman equations
L20118: We may not know the state values v[st] or action values q[st, at] for any policy.2 However,
L20119: we know that they must be consistent with one another, and it’s easy to write relations
L20120: between these quantities. The state value v[st] can be found by taking a weighted sum
L20121: of the action values q[st, at], where the weights depend on the probability under the
L20122: policy π[at|st] of taking that action (figure 19.8):
L20123: v[st] =
L20124: X
L20125: at
L20126: π[at|st]q[st, at].
L20127: (19.7)
L20128: Similarly, the value of an action is the immediate reward rt+1 = r[st, at] generated by
L20129: taking the action, plus the value v[st+1] of being in the subsequent state st+1 discounted
L20130: by γ (figure 19.9).3 Since the assignment of st+1 is not deterministic, we weight the
L20131: values v[st+1] according to the transition probabilities Pr(st+1|st, at):
L20132: q[st, at] = r[st, at] + γ ·
L20133: X
L20134: st+1
L20135: Pr(st+1|st, at)v[st+1].
L20136: (19.8)
L20137: Substituting equation 19.8 into equation 19.7 provides a relation between the state
L20138: value at time t and t + 1:
L20139: 1The notation π[at|st] ←a in equations 19.6, 19.12, and 19.13 means set π[at|s] to one for action a
L20140: and π[at|s] to zero for other actions.
L20141: 2For simplicity, we will just write v[st] and q[st, at] instead of v[st|π] and q[st, at|π] from now on.
L20142: 3We also assume from now on that the rewards are deterministic and can be written as r[st, at].
L20143: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L20146: <!-- page 395 -->
L20147: 19.2
L20148: Expected return
L20149: 381
L20150: Figure 19.8 Relationship between state values and action values. The value of
L20151: state six v[st =6] is a weighted sum of the action values q[st =6, at] at state six,
L20152: where the weights are the policy probabilities π[at|st =6] of taking that action.
L20153: Figure 19.9 Relationship between action values and state values. The value q[st =
L20154: 6, at =2] of taking action two in state six is the reward r[st =6, at =2] from taking
L20155: that action plus a weighted sum of the discounted values v[st+1] of being in
L20156: successor states, where the weights are the transition probabilities Pr(st+1|st =
L20157: 6, at = 2). The Bellman equations chain this relation with that of figure 19.8 to
L20158: link the current and next (i) state values and (ii) action values.
L20159: Draft: please send errata to udlbookmail@gmail.com.
L20162: <!-- page 396 -->
L20163: 382
L20164: 19
L20165: Reinforcement learning
L20166: v[st] =
L20167: X
L20168: at
L20169: π[at|st]
L20170: 
L20171: r[st, at] + γ ·
L20172: X
L20173: st+1
L20174: Pr(st+1|st, at)v[st+1]
L20175: 
L20176: .
L20177: (19.9)
L20178: Similarly, substituting equation 19.7 into equation 19.8 provides a relation between the
L20179: action value at time t and t + 1:
L20180: q[st, at] = r[st, at] + γ ·
L20181: X
L20182: st+1
L20183: Pr(st+1|st, at)
L20184: 
L20185: X
L20186: at+1
L20187: π[at+1|st+1]q[st+1, at+1]
L20188: 
L20189: .
L20190: (19.10)
L20191: The latter two relations are the Bellman equations and are the backbone of many
L20192: RL methods. In short, they say that the state (action) values have to be self-consistent.
L20193: Consequently, when we update an estimate of one state (action) value, this will have a
L20194: ripple effect that causes modifications to all the others.
L20195: 19.3
L20196: Tabular reinforcement learning
L20197: Tabular RL algorithms (i.e., those that don’t rely on function approximation) are divided
L20198: into model-based and model-free methods. Model-based methods4 use the MDP structure
L20199: explicitly and find the best policy from the transition matrix Pr(st+1|st, at) and reward
L20200: structure r[s, a]. If these are known, this is a straightforward optimization problem that
L20201: can be tackled using dynamic programming. If they are unknown, they can (in principle)
L20202: be estimated from observed MDP trajectories.5
L20203: Conversely, model-free methods assume that the transition matrix and reward struc-
L20204: ture of the underlying MDP are unknown. These methods fall into two families:
L20205: 1. Value estimation approaches estimate the optimal state-action value function and
L20206: then assign the policy according to the action in each state with the greatest value.
L20207: 2. Policy estimation approaches directly estimate the optimal policy using a gradient
L20208: descent technique without the intermediate steps of estimating the model or values.
L20209: Within each family, Monte Carlo methods simulate many trajectories through the MDP
L20210: for a given policy to gather information about how to improve this policy. Sometimes
L20211: it is not feasible or practical to simulate many trajectories before updating the policy.
L20212: Temporal difference (TD) methods update the policy while the agent traverses the MDP.
L20213: We now briefly describe dynamic programming methods, Monte Carlo value esti-
L20214: mation methods, and TD value estimation methods. Section 19.4 describes how deep
L20215: networks have been used in TD value estimation methods. We return to policy estima-
L20216: tion in section 19.5.
L20217: 4The term model refers here to the MDP and not a machine learning model.
L20218: 5In RL, a trajectory is an observed sequence of states, rewards, and actions. A rollout is a simulated
L20219: trajectory. An episode is a trajectory that starts in an initial state and ends in a terminal state (e.g., a
L20220: full game of chess starting from the standard opening position and ending in a win, lose, or draw.)
L20221: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L20224: <!-- page 397 -->
L20225: 19.3
L20226: Tabular reinforcement learning
L20227: 383
L20228: Figure 19.10 Dynamic programming. a) The state values are initialized to zero,
L20229: and the policy (arrows) is chosen randomly. b) The state values are updated to
L20230: be consistent with their neighbors (equation 19.11, shown after two iterations).
L20231: The policy is updated to move the agent to states with the highest value (equa-
L20232: tion 19.12). c) After several iterations, the algorithm converges to the optimal
L20233: policy, in which the penguin tries to avoid the holes and reach the fish.
L20234: 19.3.1
L20235: Dynamic programming
L20236: Dynamic programming algorithms assume we have perfect knowledge of the transition
L20237: and reward structure. In this respect, they are distinguished from most RL algorithms
L20238: which observe the agent interacting with the environment to gather information about
L20239: these quantities indirectly.
L20240: The state values v[s] are initialized arbitrarily (usually to zero). The deterministic
L20241: policy π[a|s] is also initialized (e.g., by choosing a random action for each state). The
L20242: algorithm then alternates between iteratively computing the state values for the current
L20243: policy (policy evaluation) and improving that policy (policy improvement).
L20244: Policy evaluation:
L20245: We sweep through the states st, updating their values:
L20246: v[st] ←
L20247: X
L20248: at
L20249: π[at|st]
L20250: 
L20251: r[st, at] + γ ·
L20252: X
L20253: st+1
L20254: Pr(st+1|st, at)v[st+1]
L20255: 
L20256: ,
L20257: (19.11)
L20258: where st+1 is the successor state and Pr(st+1|st, at) is the state transition probability.
L20259: Each update makes v[st] consistent with the value at the successor state st+1 using the
L20260: Bellman equation for state values (equation 19.9). This is termed bootstrapping.
L20261: Policy improvement:
L20262: To update the policy, we greedily choose the action that maxi-
L20263: mizes the value for each state:
L20264: π[at|st] ←argmax
L20265: at
L20266: 
L20267: r[st, at] + γ ·
L20268: X
L20269: st+1
L20270: Pr(st+1|st, at)v[st+1]
L20271: 
L20272: .
L20273: (19.12)
L20274: This is guaranteed to improve the policy according to the policy improvement theorem.
L20275: Draft: please send errata to udlbookmail@gmail.com.
L20278: <!-- page 398 -->
L20279: 384
L20280: 19
L20281: Reinforcement learning
L20282: Figure 19.11 Monte Carlo methods. a) The policy (arrows) is initialized ran-
L20283: domly. The MDP is repeatedly simulated, and the trajectories of these episodes
L20284: are stored (orange and brown paths represent two trajectories). b) The action
L20285: values are empirically estimated based on the observed returns averaged over
L20286: these trajectories. In this case, the action values were all initially zero and have
L20287: been updated where an action was observed. c) The policy can then be updated
L20288: according to the action which received the best (or least bad) reward.
L20289: These two steps are iterated until the policy converges (figure 19.10).
L20290: Problems 19.2–19.3
L20291: There are many variations of this approach. In policy iteration, the policy evaluation
L20292: step is iterated until convergence before policy improvement. The values can be updated
L20293: either in place or synchronously in each sweep. In value iteration, the policy evaluation
L20294: Notebook 19.2
L20295: Dynamic
L20296: programming
L20297: procedure sweeps through the values just once before policy improvement. Asynchronous
L20298: dynamic programming algorithms don’t have to systematically sweep through all the
L20299: values at each step but can update a subset of the states in place in an arbitrary order.
L20300: 19.3.2
L20301: Monte Carlo methods
L20302: Unlike dynamic programming algorithms, Monte Carlo methods don’t assume knowledge
L20303: of the MDP’s transition probabilities and reward structure. Instead, they gain experience
L20304: by repeatedly sampling trajectories from the MDP and observing the rewards. They
L20305: alternate between computing the action values (based on this experience) and updating
L20306: the policy (based on the action values).
L20307: To estimate the action values q[s, a], a series of episodes are run. Each starts with
L20308: a given state and action and thereafter follows the current policy, producing a series of
L20309: actions, states, and rewards (figure 19.11a). The action value for a given state-action
L20310: pair under the current policy is estimated as the average of the empirical returns (i.e.,
L20311: cumulative sums of time-discounted rewards) that follow each time this pair occurs (fig-
L20312: ure 19.11b). Then the policy is updated by choosing the action with the maximum value
L20313: at every state (figure 19.11c):
L20314: π[a|s] ←argmax
L20315: a
L20316: h
L20317: q[s, a]
L20318: i
L20319: .
L20320: (19.13)
L20321: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L20324: <!-- page 399 -->
L20325: 19.3
L20326: Tabular reinforcement learning
L20327: 385
L20328: This is an on-policy method; the current best policy is used to guide the agent through
L20329: the environment. This policy is based on the observed action values in every state, but
L20330: of course, it’s not possible to estimate the value of actions that haven’t been used, and
L20331: there is nothing to encourage the algorithm to explore these. One solution is to use
L20332: exploring starts. Here, episodes with all possible state-action pairs are initiated, so every
L20333: combination is observed at least once. However, this is impractical if the number of
L20334: states is large or the starting point cannot be controlled. A different approach is to
L20335: Problem 19.4
L20336: use an epsilon greedy policy, in which a random action is taken with probability ϵ, and
L20337: the optimal action is allotted the remaining probability 1−ϵ. The choice of ϵ trades off
L20338: exploitation and exploration. Here, an on-policy method will seek the best policy from
L20339: this epsilon-greedy family, which will not generally be the best overall policy.
L20340: Conversely, in off-policy methods, the optimal policy π (the target policy) is learned
L20341: based on episodes generated by a different behavior policy π′.
L20342: Typically, the target
L20343: policy is deterministic, and the behavior policy is stochastic (e.g., an epsilon-greedy
L20344: policy). Hence, the behavior policy can explore the environment, but the learned target
L20345: Notebook 19.3
L20346: Monte Carlo
L20347: methods
L20348: policy remains eﬀicient. Some off-policy methods explicitly use importance sampling
L20349: (section 17.8.1) to estimate the action value under policy π using samples from π′.
L20350: Others, such as Q-learning (described in the next section), estimate the values based
L20351: on the greedy action, even though this is not necessarily what was chosen.
L20352: 19.3.3
L20353: Temporal difference methods
L20354: Dynamic programming methods use a bootstrapping process to update the values to
L20355: make them self-consistent under the current policy. Monte Carlo methods sample the
L20356: MDP to acquire information. Temporal difference (TD) methods combine both boot-
L20357: strapping and sampling. However, unlike Monte Carlo methods, they update the values
L20358: and policy while the agent traverses the states of the MDP instead of afterward.
L20359: SARSA (State-Action-Reward-State-Action) is an on-policy algorithm with update:
L20360: q[st, at] ←q[st, at] + α
L20361: 
L20362: r[st, at] + γ · q[st+1, at+1] −q[st, at]
L20363: 
L20364: ,
L20365: (19.14)
L20366: where α ∈R+ is the learning rate.
L20367: The bracketed term is called the TD error and
L20368: measures the consistency between the estimated action value q[st, at] and the esti-
L20369: mate r[st, at]+γ · q[st+1, at+1] after taking a single step.
L20370: By contrast, Q-Learning is an off-policy algorithm with update (figure 19.12):
L20371: q[st, at] ←q[st, at] + α
L20372: 
L20373: r[st, at] + γ · max
L20374: a
L20375: 
L20376: q[st+1, a]
L20377: 
L20378: −q[st, at]
L20379: 
L20380: ,
L20381: (19.15)
L20382: where now the choice of action at each step is derived from a different behavior policy π′.
L20383: Notebook 19.4
L20384: Temporal difference
L20385: methods
L20386: In both cases, the policy is updated by taking the maximum of the action values
L20387: at each state (equation 19.13).
L20388: It can be shown that these updates are contraction
L20389: Problem 19.5
L20390: mappings (see equation 16.20); the action values will eventually converge, assuming that
L20391: every state-action pair is visited an infinite number of times.
L20392: Draft: please send errata to udlbookmail@gmail.com.
L20395: <!-- page 400 -->
L20396: 386
L20397: 19
L20398: Reinforcement learning
L20399: Figure 19.12 Q-learning. a) The agent starts in state st and takes action at = 2
L20400: according to the policy. It does not slip on the ice, so it moves downward, receiving
L20401: reward r[st, at] = 0 for leaving the original state. b) The maximum action value
L20402: at the new state is found (here 0.43). c) The action value for action 2 in the
L20403: original state is updated to 1.12 based on the current estimate of the maximum
L20404: action value at the subsequent state, the reward, discount factor γ = 0.9, and
L20405: learning rate α = 0.1. This changes the highest action value at the original state,
L20406: so the policy changes.
L20407: 19.4
L20408: Fitted Q-learning
L20409: The tabular Monte Carlo and TD algorithms described above repeatedly traverse the
L20410: entire MDP and update the action values. However, this is only practical if the state-
L20411: action space is small. Unfortunately, this is rarely the case; even for the constrained
L20412: environment of a chessboard, there are more than 1040 possible legal states.
L20413: In fitted Q-learning, the discrete representation q[st, at] of the action values is replaced
L20414: by a machine learning model q[st, at, ϕ], where now the state is represented by a vector
L20415: st rather than just an index. We then define a least squares loss based on the consistency
L20416: of adjacent action values (similar to the loss in Q-learning, see equation 19.15):
L20417: L[ϕ] =
L20418: 
L20419: r[st, at] + γ · max
L20420: a
L20421: h
L20422: q[st+1, a, ϕ]
L20423: i
L20424: −q[st, at, ϕ]
L20425: 2
L20426: ,
L20427: (19.16)
L20428: which in turn leads to the update:
L20429: ϕ ←ϕ + α
L20430: 
L20431: r[st, at] + γ · max
L20432: a
L20433: h
L20434: q[st+1, a, ϕ]
L20435: i
L20436: −q[st, at, ϕ]
L20437: ∂q[st, at, ϕ]
L20438: ∂ϕ
L20439: .
L20440: (19.17)
L20441: Fitted Q-learning differs from Q-Learning in that convergence is no longer guar-
L20442: anteed. A change to the parameters potentially modifies both the target r[st, at] + γ ·
L20443: maxat+1 [q[st+1, at+1, ϕ]] (the maximum value may change) and the prediction q[st, at, ϕ].
L20444: This can be shown both theoretically and empirically to damage convergence.
L20445: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L20448: <!-- page 401 -->
L20449: 19.4
L20450: Fitted Q-learning
L20451: 387
L20452: Figure 19.13 Atari Benchmark. The Atari benchmark consists of 49 Atari 2600
L20453: games, including Breakout (pictured), Pong, and various shoot-em-up, platform,
L20454: and other types of games. a-d) Even for games with a single screen, the state
L20455: is not fully observable from a single frame because the velocity of the objects is
L20456: unknown. Consequently, it is usual to use several adjacent frames (here, four)
L20457: to represent the state. e) The action simulates the user input via a joystick. f)
L20458: There are eighteen actions corresponding to eight directions of movement or no
L20459: movement, and for each of these nine cases, the button being pressed or not.
L20460: 19.4.1
L20461: Deep Q-networks for playing ATARI games
L20462: Deep networks are ideally suited to making predictions from a high-dimensional state
L20463: space, so they are a natural choice for the model in fitted Q-learning. In principle, they
L20464: could take both state and action as input and predict the values, but in practice, the
L20465: network takes only the state and simultaneously predicts the values for each action.
L20466: The Deep Q-Network was a breakthrough reinforcement learning architecture that
L20467: exploited deep networks to learn to play ATARI 2600 games. The observed data com-
L20468: prises 220×160 images with 128 possible colors at each pixel (figure 19.13). This was
L20469: reshaped to size 84×84, and only the brightness value was retained. Unfortunately, the
L20470: full state is not observable from a single frame. For example, the velocity of game ob-
L20471: jects is unknown. To help resolve this problem, the network ingests the last four frames
L20472: at each time step to form st. It maps these frames through three convolutional layers
L20473: followed by a fully connected layer to predict the value of every action (figure 19.14).
L20474: Several modifications were made to the standard training procedure. First, the re-
L20475: wards (which were driven by the score in the game) were clipped to −1 for a negative
L20476: change and +1 for a positive change. This compensates for the wide variation in scores
L20477: between different games and allows the same learning rate to be used.
L20478: Second, the
L20479: system exploited experience replay. Rather than update the network based on the tu-
L20480: ple <st, at, rt+1, st+1 > at the current step or with a batch of the last I tuples, all recent
L20481: Draft: please send errata to udlbookmail@gmail.com.
