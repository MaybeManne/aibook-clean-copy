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
L20484: <!-- page 402 -->
L20485: 388
L20486: 19
L20487: Reinforcement learning
L20488: Figure 19.14 Deep Q-network architec-
L20489: ture. The input st consists of four adja-
L20490: cent frames of the ATARI game. Each
L20491: is resized to 84×84 and converted to
L20492: grayscale. These frames are represented
L20493: as four channels and processed by an 8×8
L20494: convolution with stride four, followed by
L20495: a 4×4 convolution with stride 2, followed
L20496: by two fully connected layers. The final
L20497: output predicts the action value q[st, at]
L20498: for each of the 18 actions in this state.
L20499: ...
L20500: tuples were stored in a buffer. This buffer was sampled randomly to generate a batch
L20501: at each step. This approach reuses data samples many times and reduces correlations
L20502: between the samples in the batch that arise due to the similarity of adjacent frames.
L20503: Finally, the issue of convergence in fitted Q-Networks was tackled by fixing the target
L20504: parameters to values ϕ−and only updating them periodically. This gives the update:
L20505: ϕ ←ϕ + α
L20506: 
L20507: r[st, at] + γ · max
L20508: a
L20509: h
L20510: q[st+1, a, ϕ−]
L20511: i
L20512: −q[st, at, ϕ]
L20513: ∂q[st, at, ϕ]
L20514: ∂ϕ
L20515: .
L20516: (19.18)
L20517: Now the network no longer chases a moving target and is less prone to oscillation.
L20518: Using these and other heuristics and with an ϵ-greedy policy, Deep Q-Networks per-
L20519: formed at a level comparable to a professional game tester across a set of 49 games using
L20520: the same network architecture (trained separately for each game). It should be noted
L20521: that the training process was data-intensive. It took around 38 full days of experience to
L20522: learn each game. In some games, the algorithm exceeded human performance. On other
L20523: games like “Montezuma’s Revenge,” it barely made any progress. This game features
L20524: sparse rewards and multiple screens with quite different appearances.
L20525: 19.4.2
L20526: Double Q-learning and double deep Q-networks
L20527: One potential flaw of Q-Learning is that the maximization over the actions in the update:
L20528: q[st, at] ←q[st, at] + α
L20529: 
L20530: r[st, at] + γ · max
L20531: a
L20532: 
L20533: q[st+1, a]
L20534: 
L20535: −q[st, at]
L20536: 
L20537: (19.19)
L20538: leads to a systematic bias in the estimated action values q[st, at]. Consider two actions
L20539: that provide the same average reward, but one is stochastic and the other deterministic.
L20540: The stochastic reward will exceed the average roughly half of the time and be chosen
L20541: by the maximum operation, causing the corresponding action value q[st, at] to be over-
L20542: estimated. A similar argument can be made about random inaccuracies in the output of
L20543: the network q[st, at, ϕ] or random initializations of the q-function.
L20544: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L20547: <!-- page 403 -->
L20548: 19.5
L20549: Policy gradient methods
L20550: 389
L20551: The underlying problem is that the same network both selects the target (by the
L20552: maximization operation) and updates the value. Double Q-Learning tackles this problem
L20553: by training two models q1[st, at, π1] and q2[st, at, π2] simultaneously:
L20554: q1[st, at]
L20555: ←
L20556: q1[st, at] + α
L20557: 
L20558: r[st, at] + γ · q2
L20559: 
L20560: st+1, argmax
L20561: a
L20562: h
L20563: q1[st+1, a]
L20564: i
L20565: −q1[st, at]
L20566: 
L20567: q2[st, at]
L20568: ←
L20569: q2[st, at] + α
L20570: 
L20571: r[st, at] + γ · q1
L20572: 
L20573: st+1, argmax
L20574: a
L20575: h
L20576: q2[st+1, a]
L20577: i
L20578: −q2[st, at]
L20579: 
L20580: .
L20581: (19.20)
L20582: Now the choice of the target and the target itself are decoupled, which helps prevent
L20583: these biases. In practice, new tuples <s, a, r, s′ > are randomly assigned to update one
L20584: model or another. This is known as double Q-learning. Double deep Q-networks or double
L20585: DQNs use deep networks q[st, at, ϕ1] and q[st, at, ϕ2] to estimate the action values, and
L20586: the update becomes:
L20587: ϕ1 ←ϕ1+α
L20588: 
L20589: r[st, at]+γ·q
L20590: 
L20591: st+1, argmax
L20592: a
L20593: h
L20594: q[st+1, a, ϕ1]
L20595: i
L20596: , ϕ2
L20597: 
L20598: −q[st, at, ϕ1]
L20599: ∂q[st, at, ϕ1]
L20600: ∂ϕ1
L20601: ϕ2 ←ϕ2+α
L20602: 
L20603: r[st, at]+γ·q
L20604: 
L20605: st+1, argmax
L20606: a
L20607: h
L20608: q[st+1, a, ϕ2]
L20609: i
L20610: , ϕ1
L20611: 
L20612: −q[st, at, ϕ2]
L20613: ∂q[st, at, ϕ2]
L20614: ∂ϕ2
L20615: .
L20616: (19.21)
L20617: 19.5
L20618: Policy gradient methods
L20619: Q-learning estimates the action values first and then uses these to update the policy.
L20620: Conversely, policy-based methods directly learn a stochastic policy π[at|st, θ]. This is a
L20621: function with trainable parameters θ that maps a state st to a distribution Pr(at|st) over
L20622: actions at from which we can sample. In MDPs, there is always an optimal deterministic
L20623: policy. However, there are three reasons to use a stochastic policy:
L20624: 1. A stochastic policy naturally helps with exploration of the space; we are not obliged
L20625: to take the best action at each time step.
L20626: 2. The loss changes smoothly as we modify a stochastic policy. This means we can use
L20627: gradient descent methods even though the rewards are discrete. This is similar to
L20628: using maximum likelihood in (discrete) classification problems. The loss changes
L20629: smoothly as the model parameters change to make the true class more likely.
L20630: 3. The MDP assumption is often incorrect; we usually don’t have complete knowl-
L20631: edge of the state. For example, consider an agent navigating in an environment
L20632: where it can only observe nearby locations (e.g., figure 19.4). If two locations look
L20633: identical, but the nearby reward structure is different, a stochastic policy allows
L20634: the possibility of taking different actions until this ambiguity is resolved.
L20635: Draft: please send errata to udlbookmail@gmail.com.
L20638: <!-- page 404 -->
L20639: 390
L20640: 19
L20641: Reinforcement learning
L20642: 19.5.1
L20643: Derivation of gradient update
L20644: Consider a trajectory τ = [s1, a1, s2, a2, . . . , sT , aT , sT +1] through an MDP. The proba-
L20645: bility of this trajectory Pr(τ|θ) depends on both the state evolution function Pr(st+1|st, at)
L20646: and the current stochastic policy π[at|st, θ]:
L20647: Pr(τ|θ)
L20648: =
L20649: Pr(s1)
L20650: T
L20651: Y
L20652: t=1
L20653: π[at|st, θ]Pr(st+1|st, at).
L20654: (19.22)
L20655: Policy gradient algorithms aim to maximize the expected return over many such trajec-
L20656: tories:
L20657: θ = argmax
L20658: θ
L20659: 
L20660: Eτ
L20661: h
L20662: r[τ]
L20663: i
L20664: = argmax
L20665: θ
L20666: Z
L20667: Pr(τ|θ)r[τ]dτ
L20668: 
L20669: ,
L20670: (19.23)
L20671: where here the return r[τ] is the sum of all the rewards received along the trajectory.
L20672: To maximize this quantity, we use the gradient ascent update:
L20673: θ
L20674: ←
L20675: θ + α · ∂
L20676: ∂θ
L20677: Z
L20678: Pr(τ|θ)r[τ]dτ
L20679: =
L20680: θ + α ·
L20681: Z ∂Pr(τ|θ)
L20682: ∂θ
L20683: r[τ]dτ,
L20684: (19.24)
L20685: where α is the learning rate.
L20686: We want to approximate this integral with a sum over empirically observed trajecto-
L20687: ries. These are drawn from the distribution Pr(τ|θ), so to make progress, we multiply
L20688: and divide the integrand by this distribution:
L20689: θ
L20690: ←
L20691: θ + α ·
L20692: Z ∂Pr(τ|θ)
L20693: ∂θ
L20694: r[τ]dτ
L20695: =
L20696: θ + α ·
L20697: Z
L20698: Pr(τ|θ)
L20699: 1
L20700: Pr(τ|θ)
L20701: ∂Pr(τ|θ)
L20702: ∂θ
L20703: r[τ]dτ
L20704: ≈
L20705: θ + α · 1
L20706: I
L20707: I
L20708: X
L20709: i=1
L20710: 1
L20711: Pr(τ i|θ)
L20712: ∂Pr(τ i|θ)
L20713: ∂θ
L20714: r[τ i].
L20715: (19.25)
L20716: This equation has a simple interpretation (figure 19.15); the update changes the pa-
L20717: rameters θ to increase the likelihood Pr(τ i|θ) of an observed trajectory τ i in proportion
L20718: to the return r[τ i] from that trajectory. However, it also normalizes by the probabil-
L20719: ity of observing that trajectory in the first place to compensate for the fact that some
L20720: trajectories are observed more often than others. If a trajectory is already common and
L20721: yields a high return, then we don’t need to change much. The biggest updates will come
L20722: from trajectories that are uncommon but create large returns.
L20723: We can simplify this expression using the likelihood ratio identity:
L20724: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L20727: <!-- page 405 -->
L20728: 19.5
L20729: Policy gradient methods
L20730: 391
L20731: Figure 19.15 Policy gradients.
L20732: Five
L20733: episodes for the same policy (brighter in-
L20734: dicates higher reward).
L20735: Trajectories 1,
L20736: 2, and 3 generate consistently high re-
L20737: wards, but similar trajectories already
L20738: frequently occur with this policy,
L20739: so
L20740: there is no need to change. Conversely,
L20741: trajectory 4 receives low rewards, so the
L20742: policy should be modified to avoid pro-
L20743: ducing similar trajectories. Trajectory 5
L20744: receives high rewards and is unusual.
L20745: This will cause the largest change to the
L20746: policy under equation 19.25.
L20747: ∂log[f[z]]
L20748: ∂z
L20749: =
L20750: 1
L20751: f[z]
L20752: ∂f[z]
L20753: ∂z ,
L20754: (19.26)
L20755: which yields the update:
L20756: θ ←θ + α · 1
L20757: I
L20758: I
L20759: X
L20760: i=1
L20761: ∂log
L20762: 
L20763: Pr(τ i|θ)
L20764: 
L20765: ∂θ
L20766: r[τ i].
L20767: (19.27)
L20768: The log probability log[Pr(τ|θ)] of a trajectory is given by:
L20769: log[Pr(τ|θ)]
L20770: =
L20771: log
L20772: h
L20773: Pr(s1)
L20774: T
L20775: Y
L20776: t=1
L20777: π[at|st, θ]Pr(st+1|st, at)
L20778: i
L20779: (19.28)
L20780: =
L20781: log
L20782: 
L20783: Pr(s1)
L20784: 
L20785: +
L20786: T
L20787: X
L20788: t=1
L20789: log
L20790: 
L20791: π[at|st, θ]
L20792: 
L20793: +
L20794: T
L20795: X
L20796: t=1
L20797: log
L20798: 
L20799: Pr(st+1|st, at)
L20800: 
L20801: ,
L20802: and noting that only the center term depends on θ, we can rewrite the update from
L20803: equation 19.27 as:
L20804: θ ←θ + α · 1
L20805: I
L20806: I
L20807: X
L20808: i=1
L20809: T
L20810: X
L20811: t=1
L20812: ∂log
L20813: 
L20814: π[ait|sit, θ]
L20815: 
L20816: ∂θ
L20817: r[τ i],
L20818: (19.29)
L20819: where sit is the state at time t in episode i, and ait is the action taken at time t in
L20820: episode i. Note that the terms relating to the state evolution Pr(st+1|st, at) disappear
L20821: from this formulation. It follows that this parameter update does not assume a Markov
L20822: time evolution process.
L20823: We can further simplify this by noting that:
L20824: r[τ i] =
L20825: T
L20826: X
L20827: t=1
L20828: ri,t+1 =
L20829: t
L20830: X
L20831: k=1
L20832: ri,k+1 +
L20833: T
L20834: X
L20835: k=t
L20836: ri,k+1,
L20837: (19.30)
L20838: Draft: please send errata to udlbookmail@gmail.com.
L20841: <!-- page 406 -->
L20842: 392
L20843: 19
L20844: Reinforcement learning
L20845: where rit is the reward at time t in the ith episode. It can (non-obviously) be proved
L20846: that the first term (the rewards before time t) does not affect the update from time t, so
L20847: we can write:
L20848: θ ←θ + α · 1
L20849: I
L20850: I
L20851: X
L20852: i=1
L20853: T
L20854: X
L20855: t=1
L20856: ∂log
L20857: 
L20858: π[ait|sit, θ]
L20859: 
L20860: ∂θ
L20861: T
L20862: X
L20863: k=t
L20864: ri,k+1.
L20865: (19.31)
L20866: 19.5.2
L20867: REINFORCE algorithm
L20868: REINFORCE is an early policy gradient algorithm that exploits this result and in-
L20869: corporates discounting.
L20870: It is a Monte Carlo method that generates episodes τ i =
L20871: [si1, ai1, ri2, si2, ai2, ri3, . . . , riT ] based on the current policy π[a|s, θ]. For discrete ac-
L20872: tions, this policy could be determined by a neural network π[s, θ], which takes the cur-
L20873: rent state s and returns one output for each possible action. These outputs are passed
L20874: through a softmax function to create a distribution over actions, which is sampled at
L20875: each time step.
L20876: For each episode i, we loop through each step t and calculate the empirical discounted
L20877: return for the partial trajectory τ it that starts at time t:
L20878: r[τ it] =
L20879: T
L20880: X
L20881: k=t+1
L20882: γk−t−1ri,k,
L20883: (19.32)
L20884: and then we update the parameters for each time step t in each trajectory:
L20885: θ ←θ + α · ∂log
L20886: 
L20887: πait[sit, θ]
L20888: 
L20889: ∂θ
L20890: r[τ it]
L20891: ∀i, t,
L20892: (19.33)
L20893: where πat[st, θ] is the probability of at produced by the neural network given the current
L20894: state st and parameters θ, and α is the learning rate.
L20895: 19.5.3
L20896: Baselines
L20897: Policy gradient methods exhibit high variance; many episodes may be needed to get
L20898: stable estimates of the derivatives. One way to reduce this variance is to subtract a
L20899: baseline b from the trajectory returns r[τ]:
L20900: θ ←θ + α · 1
L20901: I
L20902: I
L20903: X
L20904: i=1
L20905: T
L20906: X
L20907: t=1
L20908: ∂log
L20909: 
L20910: πait[sit, θ]
L20911: 
L20912: ∂θ
L20913: (r[τ it] −b) .
L20914: (19.34)
L20915: As long as the baseline b doesn’t depend on the actions:
L20916: Problem 19.6
L20917: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L20920: <!-- page 407 -->
L20921: 19.5
L20922: Policy gradient methods
L20923: 393
L20924: Figure 19.16 Decreasing variance of estimates using control variates. a) Consider
L20925: trying to estimate E[a] from a small number of samples. The estimate (the mean
L20926: of the samples) will vary based on the number of samples and the variance of those
L20927: samples. b) Now consider observing another variable b that co-varies with a and
L20928: has E[b] = 0 and the same variance as a. c) The variance of the samples of a −b
L20929: is much less than that of a, but the expected value E[a −b] = E[a], so we get an
L20930: estimator with lower variance.
L20931: Eτ
L20932: "T −1
L20933: X
L20934: t=1
L20935: ∂log
L20936: 
L20937: πait[sit, θ]
L20938: 
L20939: ∂θ
L20940: · b
L20941: #
L20942: = 0,
L20943: (19.35)
L20944: and the expected value will not change. However, if the baseline co-varies with irrelevant
L20945: Notebook 19.5
L20946: Control variates
L20947: factors that add uncertainty, then subtracting it reduces the variance (figure 19.16). This
L20948: is a special case of the method of control variates (see problem 19.7).
L20949: Problem 19.7
L20950: This raises the question of how we should choose b. We can find the value of b that
L20951: minimizes the variance by writing an expression for the variance, taking the derivative
L20952: with respect to b, setting the result to zero, and solving to yield:
L20953: Problem 19.8
L20954: b =
L20955: X
L20956: i
L20957: PT
L20958: t=1
L20959:  ∂log
L20960: 
L20961: πait[sit, θ]
L20962: 
L20963: /∂θ
L20964: 2 r[τ it]
L20965: PT
L20966: t=1
L20967:  ∂log
L20968: 
L20969: πait[sit, θ]
L20970: 
L20971: /∂θ
L20972: 2
L20973: .
L20974: (19.36)
L20975: In practice, this is often approximated as:
L20976: b = 1
L20977: I
L20978: X
L20979: i
L20980: r[τ i].
L20981: (19.37)
L20982: Subtracting this baseline factors out variance that might occur when the returns r[τ i]
L20983: from all trajectories are greater than is typical but only because they happen to pass
L20984: through states with higher than average returns whatever actions are taken.
L20985: Draft: please send errata to udlbookmail@gmail.com.
L20988: <!-- page 408 -->
L20989: 394
L20990: 19
L20991: Reinforcement learning
L20992: 19.5.4
L20993: State-dependent baselines
L20994: A better option is to use a baseline b[sit] that depends on the current state sit.
L20995: θ ←θ + α · 1
L20996: I
L20997: I
L20998: X
L20999: i=1
L21000: T
L21001: X
L21002: t=1
L21003: ∂log
L21004: 
L21005: πait[sit, θ]
L21006: 
L21007: ∂θ
L21008: (r[τ it] −b[sit]) .
L21009: (19.38)
L21010: Here, we are compensating for variance introduced by some states having greater overall
L21011: returns than others, whichever actions we take.
L21012: A sensible choice is the expected future reward based on the current state, which is
L21013: just the state value v[s]. In this case, the difference between the empirically observed re-
L21014: wards and the baseline is known as the advantage estimate. Since we are in a Monte Carlo
L21015: context, this can be parameterized by a neural network b[s] = v[s, ϕ] with parameters ϕ,
L21016: which we can fit to the observed returns using least squares loss:
L21017: L[ϕ] =
L21018: I
L21019: X
L21020: i=1
L21021: T
L21022: X
L21023: t=1
L21024: 
L21025: v[sit, ϕ] −
L21026: T
L21027: X
L21028: j=t
L21029: ri,j+1
L21030: 
L21031: 
L21032: 2
L21033: .
L21034: (19.39)
L21035: 19.6
L21036: Actor-critic methods
L21037: Actor-critic algorithms are temporal difference (TD) policy gradient algorithms. They
L21038: can update the parameters of the policy network at each step.
L21039: This contrasts with
L21040: the Monte Carlo REINFORCE algorithm, which must wait for one or more episodes to
L21041: complete before updating the parameters.
L21042: In the TD approach, we do not have access to the future rewards r[τ t] = PT
L21043: k=t rk
L21044: along this trajectory. Actor-critic algorithms approximate the sum over all the future
L21045: rewards with the observed current reward plus the discounted value of the next state:
L21046: r[τ it] ≈ri,t+1 + γ · v[si,t+1, ϕ].
L21047: (19.40)
L21048: Here the value v[si,t+1, ϕ] is estimated by a second neural network with parameters ϕ.
L21049: Substituting this into equation 19.38 gives the update:
L21050: θ ←θ + α · 1
L21051: I
L21052: I
L21053: X
L21054: i=1
L21055: T
L21056: X
L21057: t=1
L21058: ∂log
L21059: 
L21060: Pr(ait|sit, θ)]
L21061: 
L21062: ∂θ
L21063: 
L21064: ri,t+1 + γ · v[si,t+1, ϕ] −v[si,t, ϕ]
L21065: 
L21066: . (19.41)
L21067: Concurrently, we update the parameters ϕ by bootstrapping using the loss function:
L21068: L[ϕ] =
L21069: I
L21070: X
L21071: i=1
L21072: T
L21073: X
L21074: t=1
L21075: (ri,t+1 + γ · v[si,t+1, ϕ] −v[si,t, ϕ])2 .
L21076: (19.42)
L21077: The policy network π[st, θ] that predicts Pr(a|st) is termed the actor. The value
L21078: network v[st, ϕ] is termed the critic. Often the same network represents both actor and
L21079: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L21082: <!-- page 409 -->
L21083: 19.7
L21084: Offline reinforcement learning
L21085: 395
L21086: Figure 19.17 Decision transformer. The decision transformer treats offline rein-
L21087: forcement learning as a sequence prediction task. The input is a sequence of states,
L21088: actions, and returns-to-go (remaining rewards in the episode), each of which is
L21089: mapped to a fixed-size embedding. At each time step, the network predicts the
L21090: next action. During testing, the returns-to-go are unknown; in practice, an initial
L21091: estimate is made from which subsequent observed rewards are subtracted.
L21092: the critic, with two sets of outputs that predict the policy and the values, respectively.
L21093: Note that although actor-critic methods can update the policy parameters at each step,
L21094: this is rarely done in practice. The agent typically collects a batch of experience over
L21095: many time steps before the policy is updated.
L21096: 19.7
L21097: Offline reinforcement learning
L21098: Interaction with the environment is at the core of reinforcement learning. However, there
L21099: are some scenarios where it is not practical to send a naïve agent into an environment
L21100: to explore the effect of different actions. This may be because erratic behavior in the
L21101: environment is dangerous (e.g., driving autonomous vehicles) or because data collection
L21102: is time-consuming or expensive (e.g., making financial trades).
L21103: However, it is possible to gather historical data from human agents in both cases.
L21104: Offline RL or batch RL aims to learn how to take actions that maximize rewards on future
L21105: episodes by observing past sequences s1, a1, r2, s2, a2, r3, . . ., without ever interacting
L21106: with the environment. It is distinct from imitation learning, a related technique that (i)
L21107: does not have access to the rewards and (ii) attempts to replicate the performance of a
L21108: historical agent rather than improve it.
L21109: Although there are offline RL methods based on Q-Learning and policy gradients,
L21110: Draft: please send errata to udlbookmail@gmail.com.
L21113: <!-- page 410 -->
L21114: 396
L21115: 19
L21116: Reinforcement learning
L21117: this paradigm opens up new possibilities. In particular, we can treat this as a sequence
L21118: learning problem, in which the goal is to predict the next action, given the history of
L21119: states, rewards, and actions. The decision transformer exploits a transformer decoder
L21120: framework (section 12.7) to make these predictions (figure 19.17).
L21121: However, the goal is to predict actions based on future rewards, and these are not
L21122: captured in a standard s, a, r sequence. Hence, the decision transformer replaces the re-
L21123: ward rt with the returns-to-go Rt:T = PT
L21124: t′=t rt′ (i.e., the sum of the empirically observed
L21125: future rewards). The remaining framework is very similar to a standard transformer
L21126: decoder. The states, actions, and returns-to-go are converted to fixed-size embeddings
L21127: via learned mappings. For Atari games, the state embedding might be converted via a
L21128: convolutional network similar to that in figure 19.14. The embeddings for the actions
L21129: and returns-to-go can be learned in the same way as word embeddings (figure 12.9). The
L21130: transformer is trained with masked self-attention and position embeddings.
L21131: This formulation is natural during training but poses a quandary during inference
L21132: because we don’t know the returns-to-go. This can be resolved by using the desired total
L21133: return at the first step and decrementing this as rewards are received. For example, in
L21134: an Atari game, the desired total return would be the total score required to win.
L21135: Decision transformers can also be fine-tuned from online experience and hence learn
L21136: over time. They have the advantage of dispensing with most of the reinforcement learn-
L21137: ing machinery and its associated instability and replacing this with standard supervised
L21138: learning. Transformers can learn from enormous quantities of data and integrate infor-
L21139: mation across large time contexts (making the temporal credit assignment problem more
L21140: tractable). This represents an intriguing new direction for reinforcement learning.
L21141: 19.8
L21142: Summary
L21143: Reinforcement learning is a sequential decision-making framework for Markov decision
L21144: processes and similar systems. This chapter reviewed tabular approaches to RL, includ-
L21145: ing dynamic programming (in which the environment model is known), Monte Carlo
L21146: methods (in which multiple episodes are run and the action values and policy subse-
L21147: quently changed based on the rewards received), and temporal difference methods (in
L21148: which these values are updated while the episode is ongoing).
L21149: Deep Q-Learning is a temporal difference method where deep neural networks are
L21150: used to predict the action value for every state. It can train agents to perform Atari
L21151: 2600 games at a level similar to humans. Policy gradient methods directly optimize the
L21152: policy rather than assigning values to actions. They produce stochastic policies, which
L21153: are important when the environment is partially observable. The updates are noisy, and
L21154: many refinements have been introduced to reduce their variance.
L21155: Offline reinforcement learning is used when we cannot interact with the environment
L21156: but must learn from historical data. The decision transformer leverages recent progress
L21157: in deep learning to build a model of the state-action-reward sequence and predict the
L21158: actions that will maximize the rewards.
L21159: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
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
