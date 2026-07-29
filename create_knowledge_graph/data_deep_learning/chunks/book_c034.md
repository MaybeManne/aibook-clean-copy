L22379: <!-- page 434 -->
L22380: 420
L22381: 20
L22382: Why does deep learning work?
L22383: global minima and that local minima are not apparent.
L22384: Generalization of neural networks also improves with overparameterization, although
L22385: other factors, such as the flatness of the minimum and the inductive bias of the architec-
L22386: ture, are also important. It appears that both a large number of parameters and multiple
L22387: network layers are required for good generalization, although we do not yet know why.
L22388: Many questions remain unanswered. We do not currently have any prescriptive theory
L22389: that will allow us to predict the circumstances in which training and generalization will
L22390: succeed or fail. We do not know the limits of learning in deep networks or whether
L22391: much more eﬀicient models are possible. We do not know if there are parameters that
L22392: would generalize better within the same model. The study of deep learning is still driven
L22393: by empirical demonstrations. These are undeniably impressive, but they are not yet
L22394: matched by our understanding of deep learning mechanisms.
L22395: Problems
L22396: Problem 20.1 Consider the ImageNet image classification task in which the input images contain
L22397: 224×224×3 RGB values. Consider coarsely quantizing these inputs into ten bins per RGB value
L22398: and training with ∼107 training examples. How many possible inputs are there per training
L22399: data point?
L22400: Problem 20.2 Consider figure 20.1. Why do you think that the algorithm fits the data faster
L22401: when the pixels are randomized relative to when the labels are randomized?
L22402: Problem 20.3 Figure 20.2 shows a non-stochastic fitting process with a fixed learning rate
L22403: successfully fitting random data. Does this imply that the loss function has no local minima?
L22404: Does this imply that the function is convex? Justify your answer and give a counter-example if
L22405: you think either statement is false.
L22406: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L22409: <!-- page 435 -->
L22410: Chapter 21
L22411: Deep learning and ethics
L22412: This chapter was written by Travis LaCroix and Simon J.D. Prince.
L22413: AI is poised to change society for better or worse. These technologies have enormous
L22414: potential for social good (Taddeo & Floridi, 2018; Tomašev et al., 2020), including im-
L22415: portant roles in healthcare (Rajpurkar et al., 2022) and the fight against climate change
L22416: (Rolnick et al., 2023). However, they also have the potential for misuse and unintended
L22417: harm. This has led to the emergence of the field of AI ethics.
L22418: The modern era of deep learning started in 2012 with AlexNet, but sustained interest
L22419: in AI ethics did not follow immediately.
L22420: Indeed, a workshop on fairness in machine
L22421: learning was rejected from NeurIPS 2013 for want of material. It wasn’t until 2016 that
L22422: AI Ethics had its “AlexNet” moment, with ProPublica’s exposé on bias in the COMPAS
L22423: recidivism-prediction model (Angwin et al., 2016) and Cathy O’Neil’s book Weapons
L22424: of Math Destruction (O’Neil, 2016). Interest has swelled ever since; submissions to the
L22425: Conference on Fairness, Accountability, and Transparency (FAccT) have increased nearly
L22426: ten-fold in the five years since its inception in 2018.
L22427: In parallel, many organizations have proposed policy recommendations for responsible
L22428: AI. Jobin et al. (2019) found 84 documents containing AI ethics principles, with 88%
L22429: released since 2016. This proliferation of non-legislative policy agreements, which depend
L22430: on voluntary, non-binding cooperation, calls into question their eﬀicacy (McNamara
L22431: et al., 2018; Hagendorff, 2020; LaCroix & Mohseni, 2022). In short, AI Ethics is in its
L22432: infancy, and ethical considerations are often reactive rather than proactive.
L22433: This chapter considers potential harms arising from the design and use of AI systems.
L22434: These include algorithmic bias, lack of explainability, data privacy violations, militariza-
L22435: tion, fraud, and environmental concerns. The aim is not to provide advice on being more
L22436: ethical. Instead, the goal is to express ideas and start conversations in key areas that
L22437: have received attention in philosophy, political science, and the broader social sciences.
L22438: 21.1
L22439: Value alignment
L22440: When we design AI systems, we wish to ensure that their “values” (objectives) are aligned
L22441: with those of humanity. This is sometimes called the value alignment problem (Russell,
L22442: Problem 21.1
L22443: Draft: please send errata to udlbookmail@gmail.com.
L22446: <!-- page 436 -->
L22447: 422
L22448: 21
L22449: Deep learning and ethics
L22450: 2019; Christian, 2020; Gabriel, 2020). This is challenging for three reasons. First, it’s
L22451: diﬀicult to define our values completely and correctly. Second, it is hard to encode these
L22452: values as objectives of an AI model, and third, it is hard to ensure that the model learns
L22453: to carry out these objectives.
L22454: In a machine learning model, the loss function is a proxy for our true objectives,
L22455: Problem 21.2
L22456: and a misalignment between the two is termed the outer alignment problem (Hubinger
L22457: et al., 2019). To the extent that this proxy is inadequate, there will be “loopholes” that
L22458: the system can exploit to minimize its loss function while failing to satisfy the intended
L22459: objective. For example, consider training an RL agent to play chess. If the agent is
L22460: rewarded for capturing pieces, this may result in many drawn games rather than the
L22461: desired behavior (to win the game).
L22462: In contrast, the inner alignment problem is to
L22463: ensure that the behavior of an AI system does not diverge from the intended objectives
L22464: even when the loss function is well specified.
L22465: If the learning algorithm fails to find
L22466: the global minimum or the training data are unrepresentative, training can converge to
L22467: a solution that is misaligned with the true objective resulting in undesirable behavior
L22468: (Goldberg, 1987; Mitchell et al., 1992; Lehman & Stanley, 2008).
L22469: Gabriel (2020) divides the value alignment problem into technical and normative
L22470: components. The technical component concerns how we encode values into the models
L22471: so that they reliably do what they should. Some concrete problems, such as avoiding
L22472: reward hacking and safe exploration, may have purely technical solutions (Amodei et al.,
L22473: 2016). In contrast, the normative component concerns what the correct values are in the
L22474: first place. There may be no single answer to this question, given the range of things
L22475: that different cultures and societies value. It’s important that the encoded values are
L22476: representative of everyone and not just culturally dominant subsets of society.
L22477: Another way to think about value alignment is as a structural problem that arises
L22478: when a human principal delegates tasks to an artificial agent (LaCroix, 2022). This is
L22479: similar to the principal-agent problem in economics (Laffont & Martimort, 2002), which
L22480: allows that there are competing incentives inherent in any relationship where one party
L22481: is expected to act in another’s best interests. In the AI context, such conflicts of interest
L22482: can arise when either (i) the objectives are misspecified or (ii) there is an informational
L22483: asymmetry between the principal and the agent (figure 21.1).
L22484: Many topics in AI ethics can be understood in terms of this structural view of value
L22485: alignment. The following sections discuss problems of bias and fairness and artificial
L22486: moral agency (both pertaining to specifying objectives) and transparency and explain-
L22487: ability (both related to informational asymmetry).
L22488: 21.1.1
L22489: Bias and fairness
L22490: From a purely scientific perspective, bias refers to statistical deviation from some norm.
L22491: In AI, it can be pernicious when this deviation depends on illegitimate factors that impact
L22492: an output. For example, gender is irrelevant to job performance, so it is illegitimate to
L22493: use gender as a basis for hiring a candidate. Similarly, race is irrelevant to criminality,
L22494: so it is illegitimate to use race as a feature for recidivism prediction.
L22495: Bias in AI models can be introduced in various ways (Fazelpour & Danks, 2021):
L22496: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L22499: <!-- page 437 -->
L22500: 21.1
L22501: Value alignment
L22502: 423
L22503: Figure 21.1 Structural description of the value alignment problem.
L22504: Problems
L22505: arise from a) misaligned objectives (e.g., bias) or b) informational asymmetries
L22506: between a (human) principal and an (artificial) agent (e.g., lack of explainability).
L22507: Adapted from LaCroix (2025).
L22508: • Problem specification: Choosing a model’s goals requires a value judgment
L22509: about what is important to us, which allows for the creation of biases (Fazelpour
L22510: & Danks, 2021).
L22511: Further biases may emerge if we fail to operationalize these
L22512: choices successfully and the problem specification fails to capture our intended
L22513: goals (Mitchell et al., 2021).
L22514: • Data: Algorithmic bias can result when the dataset is unrepresentative or incom-
L22515: plete (Danks & London, 2017). For example, the PULSE face super-resolution
L22516: algorithm (Menon et al., 2020) was trained on a database of photos of predom-
L22517: inantly white celebrities.
L22518: When applied to a low-resolution portrait of Barack
L22519: Obama, it generated a photo of a white man (Vincent, 2020).
L22520: If the society in which training data are generated is structurally biased against
L22521: marginalized communities, even complete and representative datasets will elicit
L22522: biases (Mayson, 2018). For example, Black individuals in the US have been policed
L22523: and jailed more frequently than white individuals. Hence, historical data used to
L22524: train recidivism prediction models are already biased against Black communities.
L22525: • Modeling and validation: Choosing a mathematical definition to measure model
L22526: fairness requires a value judgment. There exist distinct but equally-intuitive defi-
L22527: nitions that are logically inconsistent (Kleinberg et al., 2017; Chouldechova, 2017;
L22528: Berk et al., 2021).
L22529: This suggests the need to move from a purely mathemati-
L22530: cal conceptualization of fairness toward a more substantive evaluation of whether
L22531: algorithms promote justice in practice (Green, 2022).
L22532: • Deployment: Deployed algorithms may interact with other algorithms, struc-
L22533: tures, or institutions in society to create complex feedback loops that entrench ex-
L22534: tant biases (O’Neil, 2016). For example, large language models like GPT3 (Brown
L22535: et al., 2020) are trained on web data. However, when GPT3 outputs are published
L22536: Problem 21.3
L22537: Draft: please send errata to udlbookmail@gmail.com.
L22540: <!-- page 438 -->
L22541: 424
L22542: 21
L22543: Deep learning and ethics
L22544: Data collection
L22545: Pre-processing
L22546: Training
L22547: Post-processing
L22548: • Identify lack of
L22549: • examples or
L22550: • variates and collect
L22551: • Modify labels
L22552: • Modify input data
L22553: • Modify input/
L22554: • output pairs
L22555: • Adversarial training
L22556: • Regularize for fairness
L22557: • Constrain to be fair
L22558: • Change thresholds
L22559: • Trade-off accuracy
L22560: • for fairness
L22561: Figure 21.2 Bias mitigation. Methods have been proposed to compensate for bias
L22562: at all stages of the training pipeline, from data collection to post-processing of
L22563: already trained models. See Barocas et al. (2023) and Mehrabi et al. (2022).
L22564: online, the training data for future models is degraded. This may exacerbate biases
L22565: and generate novel societal harm (Falbo & LaCroix, 2022).
L22566: Unfairness can be exacerbated by considerations of intersectionality; social categories
L22567: can combine to create overlapping and interdependent systems of oppression. For ex-
L22568: ample, the discrimination experienced by a queer woman of color is not merely the
L22569: sum of the discrimination she might experience as queer, as gendered, or as racialized
L22570: (Crenshaw, 1991). Within AI, Buolamwini & Gebru (2018) showed that face analysis
L22571: algorithms trained primarily on lighter-skinned faces underperform for darker-skinned
L22572: faces. However, they perform even worse on combinations of features such as skin color
L22573: and gender than might be expected by considering those features independently.
L22574: Of course, steps can be taken to ensure that data are diverse, representative, and
L22575: complete. But if the society in which the training data are generated is structurally biased
L22576: against marginalized communities, even completely accurate datasets will elicit biases.
L22577: In light of the potential for algorithmic bias and the lack of representation in training
L22578: datasets described above, it is also necessary to consider how failure rates for the outputs
L22579: of these systems are likely to exacerbate discrimination against already-marginalized
L22580: communities (Buolamwini & Gebru, 2018; Raji & Buolamwini, 2019; Raji et al., 2022).
L22581: The resulting models may codify and entrench systems of power and oppression, including
L22582: capitalism and classism; sexism, misogyny, and patriarchy; colonialism and imperialism;
L22583: racism and white supremacy; ableism; and cis- and heteronormativity. A perspective
L22584: on bias that maintains sensitivity to power dynamics requires accounting for historical
L22585: inequities and labor conditions encoded in data (Micelli et al., 2022).
L22586: To prevent this, we must actively ensure that our algorithms are fair. A naïve ap-
L22587: proach is fairness through unawareness which simply removes the protected attributes
L22588: (e.g., race, gender) from the input features. Unfortunately, this is ineffective; the remain-
L22589: ing features can still carry information about the protected attributes. More practical
L22590: approaches first define a mathematical criterion for fairness. For example, the separation
L22591: measure in binary classification requires that the prediction ˆy is conditionally indepen-
L22592: dent of the protected variable a (e.g., race) given the true label y. Then they intervene
L22593: in various ways to minimize the deviation from this measure (figure 21.2).
L22594: Notebook 21.1
L22595: Bias mitigation
L22596: A further complicating factor is that we cannot tell if an algorithm is unfair to a com-
L22597: munity or take steps to avoid this unless we can establish community membership. Most
L22598: research on algorithmic bias and fairness has focused on ostensibly observable features
L22599: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L22602: <!-- page 439 -->
L22603: 21.1
L22604: Value alignment
L22605: 425
L22606: that might be present in training data (e.g., gender). However, features of marginalized
L22607: communities may be unobservable, making bias mitigation even more diﬀicult. Examples
L22608: include queerness (Tomasev et al., 2021), disability status, neurotype, class, and religion.
L22609: A similar problem occurs when observable features have been excised from the training
L22610: data to prevent models from exploiting them.
L22611: 21.1.2
L22612: Artificial moral agency
L22613: Many decision spaces do not include actions that carry moral weight.
L22614: For example,
L22615: choosing the next chess move has no obvious moral consequence. However, elsewhere
L22616: actions can carry moral weight. Examples include decision-making in autonomous vehi-
L22617: cles (Awad et al., 2018; Evans et al., 2020), lethal autonomous weapons systems (Arkin,
L22618: 2008a,b), and professional service robots for childcare, elderly care, and health care (An-
L22619: derson & Anderson, 2008; Sharkey & Sharkey, 2012). As these systems become more
L22620: autonomous, they may need to make moral decisions independent of human input.
L22621: This leads to the notion of artificial moral agency.
L22622: An artificial moral agent is
L22623: an autonomous AI system capable of making moral judgments. Moral agency can be
L22624: categorized in terms of increasing complexity (Moor, 2006):
L22625: 1. Ethical impact agents are agents that affect a situation for the better or worse,
L22626: but are not designed with ethics in mind. Hence, almost any technology deployed
L22627: in society might count as an ethical impact agent.
L22628: 2. Implicit ethical agents are ethical impact agents that include some in-built
L22629: safety features.
L22630: 3. Explicit ethical agents can contextually follow general moral principles or rules
L22631: of ethical conduct.
L22632: 4. Full ethical agents are agents with beliefs, desires, intentions, free will, and
L22633: consciousness of their actions.
L22634: The field of machine ethics seeks approaches to creating artificial moral agents. These
L22635: approaches can be categorized as top-down, bottom-up, or hybrid (Allen et al., 2005). Top-
L22636: down (theory-driven) methods directly implement and hierarchically arrange concrete
L22637: rules based on some moral theory to guide ethical behavior. Asimov’s “Three Laws of
L22638: Robotics” are a trivial example of this approach.
L22639: In bottom-up (learning-driven) approaches, a model learns moral regularities from
L22640: data without explicit programming (Wallach et al., 2008). For example, Noothigattu
L22641: et al. (2018) designed a voting-based system for ethical decision-making that uses data
L22642: collected from human preferences in moral dilemmas to learn social preferences; the sys-
L22643: tem then summarizes and aggregates the results to render an “ethical” decision. Hybrid
L22644: approaches combine top-down and bottom-up approaches.
L22645: Some researchers have questioned the very idea of artificial moral agency and argued
L22646: that moral agency is unnecessary for ensuring safety (van Wynsberghe & Robbins, 2019).
L22647: See Cervantes et al. (2019) for a recent survey of artificial moral agency and Tolmeijer
L22648: et al. (2020) for a recent survey on technical approaches to artificial moral agency.
L22649: Draft: please send errata to udlbookmail@gmail.com.
L22652: <!-- page 440 -->
L22653: 426
L22654: 21
L22655: Deep learning and ethics
L22656: 21.1.3
L22657: Transparency and opacity
L22658: A complex computational system is transparent if all of the details of its operation are
L22659: known. A system is explainable if humans can understand how it makes decisions. In the
L22660: absence of transparency or explainability, there is an asymmetry of information between
L22661: the user and the AI system, which makes it hard to ensure value alignment.
L22662: Creel (2020) characterizes transparency at several levels of granularity. Functional
L22663: transparency refers to knowledge of the algorithmic functioning of the system (i.e., the
L22664: logical rules that map inputs to outputs). The methods in this book are described at
L22665: this level of detail. Structural transparency entails knowing how a program executes the
L22666: algorithm. This can be obscured when commands written in high-level programming lan-
L22667: guages are executed by machine code. Finally, run transparency requires understanding
L22668: how a program was executed in a particular instance. For deep networks, this includes
L22669: Problem 21.4
L22670: knowledge about the hardware, input data, training data, and interactions thereof. None
L22671: of these can be ascertained by scrutinizing code.
L22672: For example, GPT3 is functionally transparent; its architecture is described in Brown
L22673: et al. (2020). However, it does not exhibit structural transparency as we do not have
L22674: access to the code, and it does not exhibit run transparency as we have no access to the
L22675: learned parameters, hardware, or training data. The subsequent version GPT4 is not
L22676: transparent at all. The details of how this commercial product works are unknown.
L22677: 21.1.4
L22678: Explainability and interpretability
L22679: Even if a system is transparent, this does not imply that we can understand how a
L22680: decision is made or what information this decision is based on.
L22681: Deep networks may
L22682: contain billions of parameters, so there is no way we can understand how they work
L22683: based on examination alone. However, in some jurisdictions, the public may have a right
L22684: to an explanation. Article 22 of the EU General Data Protection Regulation suggests all
L22685: data subjects should have the right to “obtain an explanation of the decision reached”
L22686: in cases where a decision is based solely on automated processes.1
L22687: These diﬀiculties have led to the sub-field of explainable AI. One moderately success-
L22688: ful area is producing local explanations. Although we can’t explain the entire system,
L22689: Notebook 21.2
L22690: Explainability
L22691: we can sometimes describe how a particular input was classified. For example, Local
L22692: interpretable model-agnostic explanations or LIME (Ribeiro et al., 2016) samples the
L22693: model output at nearby inputs and uses these samples to construct a simpler model
L22694: (figure 21.3). This provides insight into the classification decision, even if the original
L22695: model is neither transparent nor explainable.
L22696: It remains to be seen whether it is possible to build complex decision-making systems
L22697: that are fully understandable to their users or even their creators.
L22698: There is also an
L22699: ongoing debate about what it means for a system to be explainable, understandable, or
L22700: interpretable (Erasmus et al., 2021); there is currently no concrete definition of these
L22701: concepts. See Molnar (2022) for more information.
L22702: 1Whether Article 22 actually mandates such a right is debatable (see Wachter et al., 2017).
L22703: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L22706: <!-- page 441 -->
L22707: 21.2
L22708: Intentional misuse
L22709: 427
L22710: Figure 21.3 LIME. Output functions of deep networks are complex; in high di-
L22711: mensions, it’s hard to know why a decision was made or how to modify the
L22712: inputs to change it without access to the model. a) Consider trying to under-
L22713: stand why Pr(y = 1|x) is low at the white cross. LIME probes the network at
L22714: nearby points to see if it identifies these as Pr(y = 1|x) < 0.5 (cyan points) or
L22715: Pr(y = 1|x) ≥0.5 (gray points). It weights these points by proximity to the
L22716: point of interest (weight indicated by circle size). b) The weighted points are
L22717: used to train a simpler model (here, logistic regression — a linear function passed
L22718: through a sigmoid). c) Near the white cross, this approximation is close to d) the
L22719: original function. Even though we did not have access to the original model, we
L22720: can deduce from the parameters of this approximate model, that if we increase
L22721: x1 or decrease x2, Pr(y = 1|x) will increase, and the output class will change.
L22722: Adapted from Prince (2022).
L22723: 21.2
L22724: Intentional misuse
L22725: The problems in the previous section arise from poorly specified objectives and infor-
L22726: mational asymmetries. However, even when a system functions correctly, it can entail
L22727: unethical behavior or be intentionally misused.
L22728: This section highlights some specific
L22729: Problem 21.5
L22730: ethical concerns arising from the misuse of AI systems.
L22731: 21.2.1
L22732: Face recognition and analysis
L22733: Face recognition technologies have an especially high risk for misuse.
L22734: Authoritarian
L22735: states can use them to identify and silence protesters, thus risking democratic ideals
L22736: of free speech and the right to protest. Smith & Miller (2022) argue that there is a
L22737: mismatch between the values of liberal democracy (e.g., security, privacy, autonomy,
L22738: and accountability) and the potential use cases for these technologies (e.g., border se-
L22739: curity, criminal investigation and policing, national security, and the commercialization
L22740: Draft: please send errata to udlbookmail@gmail.com.
L22743: <!-- page 442 -->
L22744: 428
L22745: 21
L22746: Deep learning and ethics
L22747: of personal data). Thus, some researchers, activists, and policymakers have questioned
L22748: whether this technology should exist (Barrett, 2020).
L22749: Moreover, these technologies often do not do what they purport to (Raji et al., 2022).
L22750: For example, the New York Metropolitan Transportation Authority moved forward with
L22751: and expanded its use of facial recognition despite a proof-of-concept trial reporting a
L22752: 100% failure rate to detect faces within acceptable parameters (Berger, 2019). Similarly,
L22753: facial analysis tools often oversell their abilities (Raji & Fried, 2020), dubiously claiming
L22754: to be able to infer individuals’ sexual orientation (Leuner, 2019), emotions (Stark & Hoey,
L22755: 2021), hireability (Fetscherin et al., 2020), or criminality (Wu & Zhang, 2016). Stark
L22756: & Hutson (2022) highlight that computer vision systems have created a resurgence in
L22757: the “scientifically baseless, racist, and discredited pseudoscientific fields” of physiognomy
L22758: and phrenology.
L22759: 21.2.2
L22760: Militarization and political interference
L22761: Governments have a vested interest in funding AI research in the name of national
L22762: security and state building. This risks an arms race between nation-states, which carries
L22763: with it “high rates of investment, a lack of transparency, mutual suspicion and fear, and
L22764: a perceived intent to deploy first” (Sisson et al., 2020).
L22765: Lethal autonomous weapons systems receive significant attention because they are
L22766: Problem 21.6
L22767: easy to imagine, and indeed many such systems are under development (Heikkilä, 2022).
L22768: However, AI also facilitates cyber-attacks and disinformation campaigns (i.e., inaccurate
L22769: or misleading information that is shared with the intent to deceive). AI systems allow the
L22770: creation of highly realistic fake content and facilitate the dissemination of information,
L22771: often to targeted audiences (Akers et al., 2018) and at scale (Bontridder & Poullet, 2021).
L22772: Kosinski et al. (2013) suggest that sensitive variables, including sexual orientation,
L22773: ethnicity, religious and political views, personality traits, intelligence, happiness, use of
L22774: addictive substances, parental separation, age, and gender, can be predicted by “likes”
L22775: on social media alone. From this information, personality traits like “openness” can be
L22776: used for manipulative purposes (e.g., to change voting behavior).
L22777: 21.2.3
L22778: Fraud
L22779: Unfortunately, AI is a useful tool for automating fraudulent activities (e.g., sending mass
L22780: emails or text messages that trick people into revealing sensitive information or sending
L22781: money). Generative AI can be used to deceive people into thinking they are interacting
L22782: with a legitimate entity or generate fake documents that mislead or deceive people.
L22783: Additionally, AI could increase the sophistication of cyber-attacks, such as by generating
L22784: more convincing phishing emails or adapting to the defenses of targeted organizations.
L22785: This highlights the downside of calls for transparency in machine learning systems:
L22786: the more open and transparent these systems are, the more vulnerable they may be to
L22787: security risks or use by bad-faith actors. For example, generative language models, like
L22788: Problem 21.7
L22789: ChatGPT, have been used to write software and emails that could be used for espionage,
L22790: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L22793: <!-- page 443 -->
L22794: 21.3
L22795: Other social, ethical, and professional issues
L22796: 429
L22797: ransomware, and other malware (Goodin, 2023).
L22798: The tendency to anthropomorphize computer behaviors and particularly the projec-
L22799: tion of meaning onto strings of symbols is termed the ELIZA effect (Hofstadter, 1995).
L22800: This leads to a false sense of security when interacting with sophisticated chatbots, mak-
L22801: ing people more susceptible to text-based fraud such as romance scams or business email
L22802: compromise schemes (Abrahams, 2023). Véliz (2023) highlights how emoji use in some
L22803: chatbots is inherently manipulative, exploiting instinctual responses to emotive images.
L22804: 21.2.4
L22805: Data privacy
L22806: Modern deep learning methods rely on huge crowd-sourced datasets, which may contain
L22807: sensitive or private information. Even when sensitive information is removed, auxiliary
L22808: Problem 21.8
L22809: knowledge and redundant encodings can be used to de-anonymize datasets (Narayanan
L22810: & Shmatikov, 2008). Indeed, this famously happened to the Governor of Massachusetts,
L22811: William Weld, in 1997. After an insurance group released health records that had been
L22812: stripped of obvious personal information like patient name and address, an aspiring
L22813: graduate student was able to “de-anonymize” which records belonged to Governor Weld
L22814: by cross-referencing with public voter rolls.
L22815: Hence, privacy-first design is important for ensuring the security of individuals’ in-
L22816: formation, especially when applying deep learning techniques to high-risk areas such
L22817: as healthcare and finance. Differential privacy and semantic security (homomorphic en-
L22818: cryption or secure multi-party computation) methods can be used to ensure data security
L22819: during model training (see Mireshghallah et al., 2020; Boulemtafes et al., 2020).
L22820: 21.3
L22821: Other social, ethical, and professional issues
L22822: The previous section identified areas where AI can be deliberately misused. This section
L22823: describes other potential side effects of the widespread adoption of AI.
L22824: 21.3.1
L22825: Intellectual property
L22826: Intellectual property (IP) can be characterized as non-physical property that is the prod-
L22827: uct of original thought (Moore & Himma, 2022). In practice, many AI models are trained
L22828: on copyrighted material. Consequently, these models’ deployment can pose legal and
L22829: ethical risks and run afoul of intellectual property rights (Henderson et al., 2023).
L22830: Sometimes, these issues are explicit.
L22831: When language models are prompted with
L22832: excerpts of copyrighted material, their outputs may include copyrighted text verbatim,
L22833: and similar issues apply in the context of image generation in diffusion models (Henderson
L22834: et al., 2023; Carlini et al., 2022, 2023). Even if the training falls under “fair use,” this
L22835: may violate the moral rights of content creators in some cases (Weidinger et al., 2022).
L22836: More subtly, generative models (chapters 12,14–18) raise novel questions regarding AI
L22837: Draft: please send errata to udlbookmail@gmail.com.
L22840: <!-- page 444 -->
L22841: 430
L22842: 21
L22843: Deep learning and ethics
L22844: and intellectual property. Can the output of a machine learning model (e.g., art, music,
L22845: code, text) be copyrighted or patented? Is it morally acceptable or legal to fine-tune a
L22846: model on a particular artist’s work to reproduce that artist’s style? IP law is one area
L22847: Problem 21.9
L22848: that highlights how existing legislation was not created with machine learning models
L22849: in mind. Although governments and courts may set precedents in the near future, these
L22850: questions are still open at the time of writing.
L22851: 21.3.2
L22852: Automation bias and moral deskilling
L22853: As society relies more on AI systems, there is an increased risk of automation bias (i.e.,
L22854: expectations that the model outputs are correct because they are “objective”). This
L22855: leads to the view that quantitative methods are better than qualitative ones. However,
L22856: as we shall see in section 21.5, purportedly objective endeavors are rarely value-free.
L22857: The sociological concept of deskilling refers to the redundancy and devaluation of
L22858: skills in light of automation (Braverman, 1974). For example, off-loading cognitive skills
L22859: like memory onto technology may cause a decrease in our capacity to remember things.
L22860: Analogously, the automation of AI in morally-loaded decision-making may lead to a
L22861: decrease in our moral abilities (Vallor, 2015). For example, in the context of war, the
L22862: automation of weapons systems may lead to the dehumanization of victims of war (Asaro,
L22863: 2012; Heyns, 2017). Similarly, care robots in elderly-, child-, or healthcare settings may
L22864: reduce our ability to care for one another (Vallor, 2011).
L22865: 21.3.3
L22866: Environmental impact
L22867: Training deep networks requires significant computational power and hence consumes a
L22868: large amount of energy. Strubell et al. (2019, 2020) estimate that training a transformer
L22869: model with 213 million parameters emitted around 284 tonnes of CO2.2 Luccioni et al.
L22870: (2022) have provided similar estimates for the emissions produced from training the
L22871: BLOOM language model. Unfortunately, the increasing prevalence of closed, proprietary
L22872: models means that we know nothing about their environmental impacts (Luccioni, 2023).
L22873: 21.3.4
L22874: Employment and society
L22875: The history of technological innovation is a history of job displacement. In 2018, the
L22876: McKinsey Global Institute estimated that AI may increase economic output by approx-
L22877: imately US $13 trillion by 2030, primarily from the substitution of labor by automation
L22878: (Bughin et al., 2018). Another study from the McKinsey Global Institute suggests that
L22879: up to 30% of the global workforce (10-800 million people) could have their jobs displaced
L22880: due to AI between 2016 and 2030 (Manyika et al., 2017; Manyika & Sneader, 2018).
L22881: 2As a baseline, it is estimated that the average human is responsible for around 5 tonnes of CO2
L22882: per year, with individuals from major oil-producing countries responsible for three times this amount.
L22883: See https://ourworldindata.org/co2-emissions.
L22884: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L22887: <!-- page 445 -->
L22888: 21.4
L22889: Case study
L22890: 431
L22891: However, forecasting is inherently diﬀicult, and although automation by AI may lead
L22892: Problem 21.10
L22893: to short-term job losses, the concept of technological unemployment has been described as
L22894: a “temporary phase of maladjustment” (Keynes, 1931). This is because gains in wealth
L22895: can offset gains in productivity by creating increased demand for products and services.
L22896: In addition, new technologies can create new types of jobs.
L22897: Even if automation doesn’t lead to a net loss of overall employment in the long term,
L22898: new social programs may be required in the short term. Therefore, regardless of whether
L22899: one is optimistic (Brynjolfsson & McAfee, 2016; Danaher, 2019), neutral (Metcalf et al.,
L22900: 2016; Calo, 2018; Frey, 2019), or pessimistic (Frey & Osborne, 2017) about the possibility
L22901: of unemployment in light of AI, it is clear that society will be changed significantly.
L22902: 21.3.5
L22903: Concentration of power
L22904: As deep networks increase in size, there is a corresponding increase in the amount of data
L22905: and computing power required to train these models. In this regard, smaller companies
L22906: and start-ups may not be able to compete with large, established tech companies. This
L22907: may give rise to a feedback loop whereby the power and wealth become increasingly
L22908: concentrated in the hands of a small number of corporations.
L22909: A recent study finds
L22910: an increasing discrepancy between publications at major AI venues by large tech firms
L22911: and “elite” universities versus mid- or lower-tier universities (Ahmed & Wahed, 2016).
L22912: In many views, such a concentration of wealth and power is incompatible with just
L22913: distributions in society (Rawls, 1971).
L22914: This has led to calls to democratize AI by making it possible for everyone to create
L22915: Problem 21.11
L22916: such systems (Li, 2018; Knight, 2018; Kratsios, 2019; Riedl, 2020).
L22917: Such a process
L22918: requires making deep learning technologies more widely available and easier to use via
L22919: open source and open science so that more people can benefit from them. This reduces
L22920: barriers to entry and increases access to AI while cutting down costs, ensuring model
L22921: accuracy, and increasing participation and inclusion (Ahmed et al., 2020).
L22922: 21.4
L22923: Case study
L22924: We now describe a case study that speaks to many of the issues that we have discussed
L22925: in this chapter. In 2018, the popular media reported on a controversial facial analysis
L22926: model—dubbed “gaydar AI” (Wang & Kosinski, 2018)—with sensationalist headlines like
L22927: AI Can Tell If You’re Gay: Artificial Intelligence Predicts Sexuality From One Photo
L22928: with Startling Accuracy (Ahmed, 2017); A Frightening AI Can Determine Whether a
L22929: Person Is Gay With 91 Percent Accuracy (Matsakis, 2017); and Artificial Intelligence
L22930: System Can Tell If You’re Gay (Fernandez, 2017).
L22931: There are a number of problems with this work. First, the training dataset was highly
L22932: biased and unrepresentative, being comprised mostly of Caucasian images.
L22933: Second,
L22934: modeling and validation are also questionable, given the fluidity of gender and sexuality.
L22935: Third, the most obvious use case for such a model is the targeted discrimination and
L22936: Draft: please send errata to udlbookmail@gmail.com.
