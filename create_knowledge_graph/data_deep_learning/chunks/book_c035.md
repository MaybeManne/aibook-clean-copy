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
L22939: <!-- page 446 -->
L22940: 432
L22941: 21
L22942: Deep learning and ethics
L22943: persecution of LGBTQ+ individuals in countries where queerness is criminalized. Fourth,
L22944: with regard to transparency, explainability, and value alignment more generally, the
L22945: “gaydar” model appears to pick up on spurious correlations due to patterns in grooming,
L22946: presentation, and lifestyle rather than facial structure, as the authors claimed (Agüera y
L22947: Arcas et al., 2018). Fifth, with regard to data privacy, questions arise regarding the ethics
L22948: of scraping “public” photos and sexual orientation labels from a dating website. Finally,
L22949: with regard to scientific communication, the researchers communicated their results in a
L22950: way that was sure to generate headlines: even the title of the paper is an overstatement of
L22951: the model’s abilities: Deep Neural Networks Can Detect Sexual Orientation from Faces.
L22952: (They cannot.)
L22953: It should also be apparent that a facial-analysis model for determining sexual orien-
L22954: tation does nothing whatsoever to benefit the LGBTQ+ community. If it is to benefit
L22955: society, the most important question is whether a particular study, experiment, model,
L22956: application, or technology serves the interests of the community to which it pertains.
L22957: 21.5
L22958: The value-free ideal of science
L22959: This chapter has enumerated a number of ways that the objectives of AI systems can
L22960: unintentionally, or through misuse, diverge from the values of humanity. We now argue
L22961: that scientists are not neutral actors; their values inevitably impinge on their work.
L22962: Perhaps this is surprising. There is a broad belief that science is—or ought to be—
L22963: objective. This is codified by the value-free ideal of science. Many would argue that
L22964: machine learning is objective because algorithms are just mathematics. However, analo-
L22965: gous to algorithmic bias (section 21.1.1), there are four stages at which the values of AI
L22966: practitioners can affect their work (Reiss & Sprenger, 2017):
L22967: 1. The choice of research problem.
L22968: 2. Gathering evidence related to a research problem.
L22969: 3. Accepting a scientific hypothesis as an answer to a problem.
L22970: 4. Applying the results of scientific research.
L22971: It is perhaps uncontroversial that values play a significant role in the first and last of
L22972: these stages. The initial selection of research problems and the choice of subsequent ap-
L22973: plications are influenced by the interests of scientists, institutions, and funding agencies.
L22974: However, the value-free ideal of science prescribes minimizing the influence of moral,
L22975: personal, social, political, and cultural values on the intervening scientific process. This
L22976: idea presupposes the value-neutrality thesis, which suggests that scientists can (at least
L22977: in principle) attend to stages (2) and (3) without making these value judgments.
L22978: However, whether intentional or not, values are embedded in machine learning re-
L22979: search. Most of these values would be classed as epistemic (e.g., performance, gener-
L22980: alization, building on past work, eﬀiciency, novelty). But deciding the set of values is
L22981: itself a value-laden decision; few papers explicitly discuss societal need, and fewer still
L22982: discuss potential negative impacts (Birhane et al., 2022b). Philosophers of science have
L22983: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L22986: <!-- page 447 -->
L22987: 21.6
L22988: Responsible AI research as a collective action problem
L22989: 433
L22990: questioned whether the value-free ideal of science is attainable or desirable. For exam-
L22991: ple, Longino (1990, 1996) argues that these epistemic values are not purely epistemic.
L22992: Kitcher (2011a,b) argues that scientists don’t typically care about truth itself; instead,
L22993: they pursue truths relevant to their goals and interests.
L22994: Machine learning depends on inductive inference and is hence prone to inductive risk.
L22995: Models are only constrained at the training data points, and the curse of dimensionality
L22996: means this is a tiny proportion of the input space; outputs can always be wrong, regard-
L22997: less of how much data we use to train the model. It follows that choosing to accept or
L22998: reject a model prediction requires a value judgment: that the risks if we are wrong in
L22999: acceptance are lower than the risks if we are wrong in rejection.
L23000: Hence, the use of inductive inference implies that machine learning models are deeply
L23001: value-laden (Johnson, 2022). In fact, if they were not, they would have no application:
L23002: it is precisely because they are value-laden that they are useful. Thus, accepting that
L23003: algorithms are used for ranking, sorting, filtering, recommending, categorizing, label-
L23004: ing, predicting, etc., in the real world implies that these processes will have real-world
L23005: effects. As machine learning systems become increasingly commercialized and applied,
L23006: they become more entrenched in the things we care about.
L23007: These insights have implications for researchers who believe that algorithms are some-
L23008: how more objective than human decision-makers (and, therefore, ought to replace human
L23009: decision-makers in areas where we think objectivity matters).
L23010: 21.6
L23011: Responsible AI research as a collective action problem
L23012: It is easy to defer responsibility. Students and professionals who read this chapter might
L23013: think their work is so far removed from the real world or a small part of a larger machine
L23014: that their actions could not make a difference. However, this is a mistake. Researchers
L23015: often have a choice about the projects to which they devote their time, the companies
L23016: or institutions for which they work, the knowledge they seek, the social and intellectual
L23017: circles in which they interact, and the way they communicate.
L23018: Doing the right thing, whatever that may comprise, often takes the form of a social
L23019: dilemma; the best outcomes depend upon cooperation, although it isn’t necessarily in any
L23020: Problem 21.12
L23021: individual’s interest to cooperate: responsible AI research is a collective action problem.
L23022: 21.6.1
L23023: Scientific communication
L23024: One positive step is to communicate responsibly.
L23025: Misinformation spreads faster and
L23026: persists more readily than the truth in many types of social networks (LaCroix et al.,
L23027: 2021; Ceylan et al., 2023). As such, it is important not to overstate machine learning
L23028: systems’ abilities (see case study above) and to avoid misleading anthropomorphism. It
L23029: is also important to be aware of the potential for the misapplication of machine learning
L23030: techniques. For example, pseudoscientific practices like phrenology and physiognomy
L23031: have found a surprising resurgence in AI (Stark & Hutson, 2022).
L23032: Draft: please send errata to udlbookmail@gmail.com.
L23035: <!-- page 448 -->
L23036: 434
L23037: 21
L23038: Deep learning and ethics
L23039: 21.6.2
L23040: Diversity and heterogeneity
L23041: A second positive step is to encourage diversity. When social groups are homogeneous
L23042: (composed mainly of similar members) or homophilous (comprising members that tend
L23043: to associate with similar others), the dominant group tends to have its conventions
L23044: recapitulated and stabilized (O’Connor & Bruner, 2019). One way to mitigate systems
L23045: of oppression is to ensure that diverse views are considered. This might be achieved
L23046: through equity, diversity, inclusion, and accessibility initiatives (at an institutional level),
L23047: participatory and community-based approaches to research (at the research level), and
L23048: increased awareness of social, political, and moral issues (at an individual level).
L23049: The theory of standpoint epistemology (Harding, 1986) suggests that knowledge is
L23050: socially situated (i.e., depends on one’s social position in society). Homogeneity in tech
L23051: circles can give rise to biased tech (Noble, 2018; Eubanks, 2018; Benjamin, 2019; Brous-
L23052: sard, 2023). Lack of diversity implies that the perspectives of the individuals who create
L23053: these technologies will seep into the datasets, algorithms, and code as the default perspec-
L23054: tive. Broussard (2023) argues that because much technology is developed by able-bodied,
L23055: white, cisgender, American men, that technology is optimized for able-bodied, white, cis-
L23056: gender, American men, the perspective of whom is taken as the status quo. Ensuring
L23057: technologies benefit historically marginalized communities requires researchers to under-
L23058: stand the needs, wants, and perspectives of those communities (Birhane et al., 2022a).
L23059: Design justice and participatory- and community-based approaches to AI research con-
L23060: tend that the communities affected by technologies should be actively involved in their
L23061: design (Constanza-Chock, 2020).
L23062: 21.7
L23063: Ways forward
L23064: It is undeniable that AI will radically change society for better or worse.
L23065: However,
L23066: optimistic visions of a future Utopian society driven by AI should be met with caution and
L23067: a healthy dose of critical reflection. Many of the touted benefits of AI are beneficial only
L23068: in certain contexts and only to a subset of society. For example, Green (2019) highlights
L23069: that one project developed using AI to enhance police accountability and alternatives to
L23070: incarceration and another developed to increase security through predictive policing are
L23071: both advertised as “AI for Social Good.” Assigning this label is a value judgment that
L23072: lacks any grounding principles; one community’s good is another’s harm.
L23073: When considering the potential for emerging technologies to benefit society, it is
L23074: necessary to reflect on whether those benefits will be equally or equitably distributed.
L23075: It is often assumed that the most technologically advanced solution is the best one—
L23076: so-called technochauvinism (Broussard, 2018). However, many social issues arise from
L23077: underlying social problems and do not warrant technological solutions.
L23078: Some common themes emerged throughout this chapter, and we would like to impress
L23079: four key points upon the reader:
L23080: 1. Research in machine learning cannot avoid ethics. Historically, researchers
L23081: could focus on fundamental aspects of their work in a controlled laboratory set-
L23082: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L23085: <!-- page 449 -->
L23086: 21.8
L23087: Summary
L23088: 435
L23089: ting. However, this luxury is dwindling due to the vast economic incentives to
L23090: commercialize AI and the degree to which academic work is funded by industry
L23091: (see Abdalla & Abdalla, 2021); even theoretical studies may have social impacts,
L23092: so researchers must engage with the social and ethical dimensions of their work.
L23093: 2. Even purely technical decisions can be value-laden. There is still a widely-
L23094: held view that AI is fundamentally just mathematics and, therefore, it is “objec-
L23095: tive,” and ethics are irrelevant. This assumption is not true when we consider the
L23096: creation of AI systems or their deployment.
L23097: 3. We should question the structures within which AI work takes place.
L23098: Much research on AI ethics focuses on specific situations rather than questioning
L23099: the larger social structures within which AI will be deployed. For example, there
L23100: is considerable interest in ensuring algorithmic fairness, but it may not always be
L23101: possible to instantiate conceptions of fairness, justice, or equity within extant social
L23102: and political structures. Therefore, technology is inherently political.
L23103: 4. Social and ethical problems don’t necessarily require technical solutions.
L23104: Many potential ethical problems surrounding AI technologies are primarily social
L23105: and structural, so technical innovation alone cannot solve these problems; if scien-
L23106: tists are to effect positive change with new technology, they must take a political
L23107: Problem 21.13
L23108: and moral position.
L23109: Where does this leave the average scientist? Perhaps with the following imperative:
L23110: it is necessary to reflect upon the moral and social dimensions of one’s work. This might
L23111: require actively engaging those communities that are likely to be most affected by new
L23112: technologies, thus cultivating relationships between researchers and communities and em-
L23113: powering those communities. Likewise, it might involve engagement with the literature
L23114: beyond one’s own discipline. For philosophical questions, the Stanford Encyclopedia of
L23115: Philosophy is an invaluable resource. Interdisciplinary conferences are also useful in this
L23116: regard. Leading work is published at both the Conference on Fairness, Accountability,
L23117: and Transparency (FAccT) and the Conference on AI, Ethics, and Society (AIES).
L23118: 21.8
L23119: Summary
L23120: This chapter considered the ethical implications of deep learning and AI. The value
L23121: alignment problem is the task of ensuring that the objectives of AI systems are aligned
L23122: with human objectives. Bias, explainability, artificial moral agency, and other topics can
L23123: be viewed through this lens. AI can be intentionally misused, and this chapter detailed
L23124: some ways this can happen. Progress in AI has further implications in areas as diverse
L23125: as IP law and climate change.
L23126: Ethical AI is a collective action problem, and the chapter concludes with an appeal
L23127: to scientists to consider the moral and ethical implications of their work. Every ethical
L23128: issue is not within the control of every individual computer scientist. However, this does
L23129: not imply that researchers have no responsibility whatsoever to consider—and mitigate
L23130: where they can—the potential for misuse of the systems they create.
L23131: Draft: please send errata to udlbookmail@gmail.com.
L23134: <!-- page 450 -->
L23135: 436
L23136: 21
L23137: Deep learning and ethics
L23138: Problems
L23139: Problem 21.1 It was suggested that the most common specification of the value alignment
L23140: problem for AI is “the problem of ensuring that the values of AI systems are aligned with the
L23141: values of humanity.” Discuss the ways in which this statement of the problem is underspecified.
L23142: Discussion Resource: LaCroix (2025).
L23143: Problem 21.2 Goodhart’s law states that “when a measure becomes a target, it ceases to be a
L23144: good measure.” Consider how this law might be reformulated to apply to value alignment for
L23145: artificial intelligence, given that the loss function is a mere proxy for our true objectives.
L23146: Problem 21.3 Suppose a university uses data from past students to build models for predicting
L23147: “student success,” where those models can support informed changes in policies and practices.
L23148: Consider how biases might affect each of the four stages of the development and deployment of
L23149: this model.
L23150: Discussion Resource: Fazelpour & Danks (2021).
L23151: Problem 21.4
L23152: We might think of functional transparency, structural transparency, and run
L23153: transparency as orthogonal. Provide an example of how an increase in one form of transparency
L23154: may not lead to a concomitant increase in another form of transparency.
L23155: Discussion Resource: Creel (2020).
L23156: Problem 21.5 If a computer scientist writes a research paper on AI or pushes code to a public
L23157: repository, do you consider them responsible for future misuse of their work?
L23158: Problem 21.6 To what extent do you think the militarization of AI is inevitable?
L23159: Problem 21.7 In light of the possible misuse of AI highlighted in section 21.2, make arguments
L23160: both for and against the open-source culture of research in deep learning.
L23161: Problem 21.8 Some have suggested that personal data is a source of power for those who own it.
L23162: Discuss the ways personal data is valuable to companies that utilize deep learning and consider
L23163: the claim that losses to privacy are experienced collectively rather than individually.
L23164: Discussion Resource: Véliz (2020).
L23165: Problem 21.9 What are the implications of generative AI for the creative industries? How do
L23166: you think IP laws should be modified to cope with this new development?
L23167: Problem 21.10 A good forecast must (i) be specific enough to know when it is wrong, (ii)
L23168: account for possible cognitive biases, and (iii) allow for rationally updating beliefs. Consider
L23169: any claim in the recent media about future AI and discuss whether it satisfies these criteria.
L23170: Discussion Resource: Tetlock & Gardner (2016).
L23171: Problem 21.11 Some critics have argued that calls to democratize AI have focused too heavily on
L23172: the participatory aspects of democracy, which can increase risks of errors in collective perception,
L23173: reasoning, and agency, leading to morally-bad outcomes. Reflect on each of the following: What
L23174: aspects of AI should be democratized? Why should AI be democratized? How should AI be
L23175: democratized?
L23176: Discussion Resource: Himmelreich (2022).
L23177: Problem 21.12 In March 2023, the Future of Life Institute published a letter, “Pause Giant AI
L23178: Experiments,” in which they called on all AI labs to immediately pause for at least six months
L23179: the training of AI systems more powerful than GPT-4. Discuss the motivations of the authors
L23180: in writing this letter, the public reaction, and the implications of such a pause. Relate this
L23181: episode to the view that AI ethics can be considered a collective action problem (section 21.6).
L23182: Discussion Resource: Gebru et al. (2023).
L23183: Problem 21.13 Discuss the merits of the four points in section 21.7. Do you agree with them?
L23184: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L23187: <!-- page 451 -->
L23188: Appendix A
L23189: Notation
L23190: This appendix details the notation used in this book. This mostly adheres to standard
L23191: conventions in computer science, but deep learning is applicable to many different areas,
L23192: so it is explained in full.
L23193: In addition, there are several notational conventions that
L23194: are unique to this book, including notation for functions and the systematic distinction
L23195: between parameters and variables.
L23196: Scalars, vectors, matrices, and tensors
L23197: Scalars are denoted by either small or capital letters a, A, α. Column vectors (i.e., 1D ar-
L23198: rays of numbers) are denoted by small bold letters a, ϕ, and row vectors as the transpose
L23199: of column vectors aT , ϕT . Matrices and tensors (i.e., 2D and ND arrays of numbers,
L23200: respectively) are both represented by bold capital letters B, Φ.
L23201: Variables and parameters
L23202: Variables (usually the inputs and outputs of functions or intermediate calculations) are
L23203: always denoted by Roman letters a, b, C. Parameters (which are internal to functions
L23204: or probability distributions) are always denoted by Greek letters α, β, Γ. Generic, un-
L23205: specified parameters are denoted by ϕ. This distinction is retained throughout the book
L23206: except for the policy in reinforcement learning, which is denoted by π according to the
L23207: usual convention.
L23208: Sets
L23209: Sets are denoted by curly brackets, so {0, 1, 2} denotes the numbers 0, 1, and 2. The
L23210: notation {0, 1, 2, . . .} denotes the set of non-negative integers. Sometimes, we want to
L23211: specify a set of variables and {xi}I
L23212: i=1 denotes the I variables x1, . . . xI. When it’s not
L23213: necessary to specify how many items are in the set, this is shortened to {xi}.
L23214: The
L23215: notation {xi, yi}I
L23216: i=1 denotes the set of I pairs xi, yi. The convention for naming sets is
L23217: to use calligraphic letters. Notably, Bt is used to denote the set of indices in a batch at
L23218: iteration t during training. The number of elements in a set S is denoted by |S|.
L23219: The set R denotes the set of real numbers. The set R+ denotes the set of non-negative
L23220: real numbers. The notation RD denotes the set of D-dimensional vectors containing real
L23221: Draft: please send errata to udlbookmail@gmail.com.
L23224: <!-- page 452 -->
L23225: 438
L23226: A
L23227: Notation
L23228: numbers. The notation RD1×D2 denotes the set of matrices of dimension D1 × D2. The
L23229: notation RD1×D2×D3 denotes the set of tensors of size D1 × D2 × D3 and so on.
L23230: The notation [a, b] denotes the real numbers from a to b, including a and b themselves.
L23231: When the square brackets are replaced by round brackets, this means that the adjacent
L23232: value is not included in the set. For example, the set (−π, π] denotes the real numbers
L23233: from −π to π, but excluding −π.
L23234: Membership of sets is denoted by the symbol ∈, so x ∈R+ means that the variable x
L23235: is a non-negative real number, and the notation Σ ∈RD×D denotes that Σ is a matrix
L23236: of size D×D. Sometimes, we want to work through each element of a set systematically,
L23237: and the notation ∀{1, . . . , K} means “for all” the integers from 1 to K.
L23238: Functions
L23239: Functions are expressed as a name, followed by square brackets that contain the argu-
L23240: ments of the function. For example, log[x] returns the logarithm of the variable x. When
L23241: the function returns a vector, it is written in bold and starts with a small letter. For
L23242: example, the function y = mlp[x, ϕ] returns a vector y and has vector arguments x
L23243: and ϕ. When a function returns a matrix or tensor, it is written in bold and starts with
L23244: a capital letter. For example, the function Y = Sa[X, ϕ] returns a matrix Y and has
L23245: arguments X and ϕ. When we want to leave the arguments of a function deliberately
L23246: ambiguous, we use the bullet symbol (e.g., mlp[•, ϕ]).
L23247: Minimizing and maximizing
L23248: Some special functions are used repeatedly throughout the text:
L23249: • The function minx[f[x]] returns the minimum value of the function f[x] over all
L23250: possible values of the variable x. This notation is often used without specifying
L23251: the details of how this minimum might be found.
L23252: • The function argminx[f[x]] returns the value of x that minimizes f[x], so if y =
L23253: argminx[f[x]], then minx[f[x]] = f[y].
L23254: • The functions maxx[f[x]] and argmaxx[f[x]] perform the equivalent operations for
L23255: maximizing functions.
L23256: Probability distributions
L23257: Probability distributions should be written as Pr(x = a), denoting that the random
L23258: variable x takes the value of a.
L23259: However, this notation is cumbersome.
L23260: Hence, we
L23261: usually simplify this and just write Pr(x), where x denotes either the random variable
L23262: or the value it takes according to the sense of the equation. The conditional probability
L23263: of y given x is written as Pr(y|x). The joint probability of y and x is written as Pr(y, x).
L23264: These two forms can be combined, so Pr(y|x, ϕ) denotes the probability of the variable y,
L23265: given that we know x and ϕ. Similarly, Pr(y, x|ϕ) denotes the probability of variables y
L23266: and x given that we know ϕ.
L23267: When we need two probability distributions over the
L23268: same variable, we write Pr(x) for the first distribution and q(x) for the second. More
L23269: information about probability distributions can be found in appendix C.
L23270: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L23273: <!-- page 453 -->
L23274: 439
L23275: Asymptotic notation
L23276: Asymptotic notation is used to compare the amount of work done by different algorithms
L23277: as the size D of the input increases. This can be done in various ways, but this book only
L23278: uses big-O notation, which represents an upper bound on the growth of computation in
L23279: an algorithm. A function f[n] is O[g[n]] if there exists a constant c > 0 and integer n0
L23280: such that f[n] < c · g[n] for all n > n0.
L23281: This notation provides a bound on the worst-case running time of an algorithm.
L23282: For example, when we say that inversion of a D × D matrix is O[D3], we mean that the
L23283: computation will increase no faster than some constant times D3 once D is large enough.
L23284: This gives us an idea of how feasible it is to invert matrices of different sizes. If D = 103,
L23285: then it may take of the order of 109 operations to invert it.
L23286: Miscellaneous
L23287: A small dot in a mathematical equation is intended to improve ease of reading and
L23288: has no real meaning (or just implies multiplication). For example, α · f[x] is the same
L23289: as αf[x] but is easier to read. To avoid ambiguity, dot products are written as aT b (see
L23290: appendix B.3.4). A left arrow symbol ←denotes assignment, so x ←x + 2 means that
L23291: we are adding two to the current value of x.
L23292: Draft: please send errata to udlbookmail@gmail.com.
L23295: <!-- page 454 -->
L23296: Appendix B
L23297: Mathematics
L23298: This appendix reviews mathematical concepts that are used in the main text.
L23299: B.1
L23300: Functions
L23301: A function defines a mapping from a set X (e.g., the set of real numbers) to another
L23302: set Y. An injection is a one-to-one function where every element in the first set maps to
L23303: a unique position in the second set (but there may be elements of the second set that
L23304: are not mapped to). A surjection is a function where every element in the second set
L23305: receives a mapping from the first (but there may be multiple elements of the first set that
L23306: are mapped to the same element of the second set). A bijection or bijective mapping is
L23307: a function that is both injective and surjective. It provides a one-to-one correspondence
L23308: between all members of the two sets. A diffeomorphism is a special case of a bijection
L23309: where both the forward and reverse mapping are differentiable.
L23310: B.1.1
L23311: Lipschitz constant
L23312: A function f[z] is Lipschitz continuous if for all z1, z2:
L23313: ||f[z1] −f[z2]|| ≤β||z1 −z2||,
L23314: (B.1)
L23315: where β is known as the Lipschitz constant and determines the maximum gradient of
L23316: the function (i.e., how fast the function can change) with respect to the distance metric.
L23317: If the Lipschitz constant is less than one, the function is a contraction mapping, and we
L23318: can use Banach’s theorem to find the inverse for any point (see figure 16.9).
L23319: Composing two functions with Lipschitz constants β1 and β2 creates a new Lipschitz
L23320: continuous function with a constant that is less than or equal to β1β2.
L23321: Adding two
L23322: functions with Lipschitz constants β1 and β2 creates a new Lipschitz continuous func-
L23323: tion with a constant that is less than or equal to β1+β2. The Lipschitz constant of a
L23324: linear transformation f[z] = Az+b with respect to a Euclidean distance measure is the
L23325: maximum eigenvalue of A.
L23326: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L23329: <!-- page 455 -->
L23330: B.1
L23331: Functions
L23332: 441
L23333: B.1.2
L23334: Convexity
L23335: A function is convex if we can draw a straight line between any two points on the
L23336: function, and this line always lies above the function. Similarly, a function is concave
L23337: if a straight line between any two points always lies below the function. By definition,
L23338: convex (concave) functions have at most one minimum (maximum).
L23339: A region of RD is convex if we can draw a straight line between any two points on the
L23340: boundary of the region without intersecting the boundary in another place. Gradient
L23341: descent guarantees to find the global minimum of any function that is both convex and
L23342: defined on a convex region.
L23343: B.1.3
L23344: Special functions
L23345: The following functions are used in the main text:
L23346: • The exponential function y = exp[x] (figure B.1a) maps a real variable x ∈R to a
L23347: non-negative number y ∈R+ as y = ex.
L23348: • The logarithm x = log[y] (figure B.1b) is the inverse of the exponential function
L23349: and maps a non-negative number y ∈R+ to a real variable x ∈R. Note that all
L23350: logarithms in this book are natural (i.e., in base e).
L23351: • The gamma function Γ[x] (figure B.1c) is defined as:
L23352: Γ[x] =
L23353: Z ∞
L23354: 0
L23355: tx−1e−tdt.
L23356: (B.2)
L23357: This extends the factorial function to continuous values so that Γ[x] = (x −1)! for
L23358: x ∈{1, 2, . . .}.
L23359: • The Dirac delta function δ[z] has a total area of one, all of which is at position z = 0.
L23360: A dataset with N elements can be thought of as a probability distribution consisting
L23361: of a sum of N delta functions centered at each data point xi and scaled by 1/N.
L23362: The delta function is usually drawn as an arrow (e.g., figure 5.12).
L23363: The delta
L23364: function has the key property that:
L23365: Z
L23366: f[x]δ[x −x0]dx = f[x0].
L23367: (B.3)
L23368: B.1.4
L23369: Stirling’s formula
L23370: Stirling’s formula (figure B.2) approximates the factorial function (and hence the Gamma
L23371: function) using the formula:
L23372: x! ≈
L23373: √
L23374: 2πx
L23375: x
L23376: e
L23377: x
L23378: .
L23379: (B.4)
L23380: Draft: please send errata to udlbookmail@gmail.com.
L23383: <!-- page 456 -->
L23384: 442
L23385: B
L23386: Mathematics
L23387: Figure B.1 Exponential, logarithm, and gamma functions. a) The exponential
L23388: function maps a real number to a positive number. It is a convex function. b)
L23389: The logarithm is the inverse of the exponential and maps a positive number to a
L23390: real number. It is a concave function. c) The Gamma function is a continuous
L23391: extension of the factorial function so that Γ[x] = (x −1)! for x ∈{1, 2, . . .}.
L23392: Figure B.2 Stirling’s formula. The facto-
L23393: rial function x! can be approximated by
L23394: Stirling’s formula Stir[x] which is defined
L23395: for every real value.
L23396: B.2
L23397: Binomial coeﬀicients
L23398: Binomial coeﬀicients are written as
L23399:  n
L23400: k
L23401: 
L23402: and pronounced as “n choose k.”
L23403: They are
L23404: positive integers that represent the number of ways of choosing an unordered subset of k
L23405: items from a set of n items without replacement. Binomial coeﬀicients can be computed
L23406: using the simple formula:
L23407: n
L23408: k
L23409: 
L23410: =
L23411: n!
L23412: k!(n −k)!.
L23413: (B.5)
L23414: B.2.1
L23415: Autocorrelation
L23416: The autocorrelation r[τ] of a continuous function f[z] is defined as:
L23417: r[τ] =
L23418: Z ∞
L23419: −∞
L23420: f[t + τ]f[t]dt,
L23421: (B.6)
L23422: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
L23425: <!-- page 457 -->
L23426: B.3
L23427: Vector, matrices, and tensors
L23428: 443
L23429: where τ is the time lag. Sometimes, this is normalized by r[0] so that the autocorrelation
L23430: at time lag zero is one. The autocorrelation function is a measure of the correlation of the
L23431: function with itself as a function of an offset (i.e., the time lag). If a function changes
L23432: slowly and predictably, then the autocorrelation function will decrease slowly as the
L23433: time lag increases from zero. If the function changes fast and unpredictably, then it will
L23434: decrease quickly to zero.
L23435: B.3
L23436: Vector, matrices, and tensors
L23437: In machine learning, a vector x ∈RD is a one-dimensional array of D numbers, which
L23438: we will assume are organized in a column. Similarly, a matrix Y ∈RD1×D2 is a two-
L23439: dimensional array of numbers with D1 rows and D2 columns. A tensor z ∈RD1×D2...×DN
L23440: is an N-dimensional array of numbers. Confusingly, all three of these quantities are stored
L23441: in objects known as “tensors” in deep learning APIs such as PyTorch and TensorFlow.
L23442: B.3.1
L23443: Transpose
L23444: The transpose AT ∈RD2×D1 of a matrix A ∈RD1×D2 is formed by reflecting it around
L23445: the principal diagonal so that the kth column becomes the kth row and vice-versa. If we
L23446: take the transpose of a matrix product AB, then we take the transpose of the original
L23447: matrices but reverse the order so that
L23448: (AB)T = BT AT .
L23449: (B.7)
L23450: The transpose of a column vector a is a row vector aT and vice-versa.
L23451: B.3.2
L23452: Vector and matrix norms
L23453: For a vector z, the ℓp norm is defined as:
L23454: ||z||p =
L23455:  D
L23456: X
L23457: d=1
L23458: |zd|p
L23459: !1/p
L23460: ,
L23461: (B.8)
L23462: for real-valued p > 1.
L23463: When p = 2, this returns the length of the vector, and this
L23464: is known as the Euclidean norm. It is this case that is most commonly used in deep
L23465: learning, and often the exponent p is omitted, and the Euclidean norm is just written
L23466: as ||z||. When p = ∞, the operator returns the maximum absolute value in the vector.
L23467: Norms can be computed in a similar way for matrices. For example, the ℓ2 norm of
L23468: a matrix Z (known as the Frobenius norm) is calculated as:
L23469: Draft: please send errata to udlbookmail@gmail.com.
L23472: <!-- page 458 -->
L23473: 444
L23474: B
L23475: Mathematics
L23476: ||Z||F =
L23477: 
L23478: 
L23479: I
L23480: X
L23481: i=1
L23482: J
L23483: X
L23484: j=1
L23485: |zij|2
L23486: 
L23487: 
L23488: 1/2
L23489: .
L23490: (B.9)
L23491: B.3.3
L23492: Product of matrices
L23493: The product C = AB of two matrices A ∈RD1×D2 and B ∈RD2×D3 is a third ma-
L23494: trix C ∈RD1×D3 where:
L23495: Cij =
L23496: D2
L23497: X
L23498: d=1
L23499: AidBdj.
L23500: (B.10)
L23501: B.3.4
L23502: Dot product of vectors
L23503: The dot product aT b of two vectors a ∈RD and b ∈RD is a scalar and is defined as:
L23504: aT b = bT a =
L23505: D
L23506: X
L23507: d=1
L23508: adbd.
L23509: (B.11)
L23510: It can be shown that the dot product is proportional to the Euclidean norm of the first
L23511: vector times the Euclidean norm of the second vector times the angle θ between them:
L23512: aT b = ||a||||b|| cos[θ].
L23513: (B.12)
L23514: B.3.5
L23515: Inverse
L23516: A square matrix A may or may not have an inverse A−1 such that A−1A = AA−1 = I.
L23517: If a matrix does not have an inverse, it is called singular.
L23518: If we take the inverse of a
L23519: matrix product AB where A and B are square and invertible, then we can equivalently
L23520: take the inverse of each matrix individually and reverse the order of multiplication.
L23521: (AB)−1 = B−1A−1.
L23522: (B.13)
L23523: In general, it takes O[D3] operations to invert a D×D matrix. However, inversion is
L23524: more eﬀicient for special types of matrices, including diagonal, orthogonal, and triangular
L23525: matrices (see section B.4).
L23526: B.3.6
L23527: Subspaces
L23528: Consider a matrix A ∈RD1×D2. If the number of columns D2 of the matrix is fewer than
L23529: the number of rows D1 (i.e., the matrix is “portrait”), the product Ax cannot reach all
L23530: This work is subject to a Creative Commons CC-BY-NC-ND license. (C) MIT Press.
