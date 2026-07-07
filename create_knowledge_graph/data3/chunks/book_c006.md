L02059: ## QUICK CHECK ANSWERS 1.3
L02061: 1. (a) $+\infty$
L02062: (b) 5
L02063: (c) $-\infty$
L02064: (d) 0
L02065: 2. (a) $\frac{1}{2}$
L02066: (b) does not exist (c) $e$
L02067: 3. (a) 9 (b) $-\frac{2}{3}$
L02068: (c) does not exist (d) 4
L02069: 4. $1 / x, e^{x}$, and $e^{-x}$ each has a horizontal asymptote.
L02071: ### 1.4 LIMITS (DISCUSSED MORE RIGOROUSLY)
L02073: In the previous sections of this chapter we focused on the discovery of values of limits, either by sampling selected $x$-values or by applying limit theorems that were stated without proof. Our main goal in this section is to define the notion of a limit precisely, thereby making it possible to establish limits with certainty and to prove theorems about them. This will also provide us with a deeper understanding of some of the more subtle properties of functions.
L02075: ## MOTIVATION FOR THE DEFINITION OF A TWO-SIDED LIMIT
L02077: The statement $\lim _{x \rightarrow a} f(x)=L$ can be interpreted informally to mean that we can make the value of $f(x)$ as close as we like to the real number $L$ by making the value of $x$ sufficiently close to $a$. It is our goal to make the informal phrases "as close as we like to $L$ " and "sufficiently close to $a$ " mathematically precise.
L02079: To do this, consider the function $f$ graphed in Figure 1.4.1 a for which $f(x) \rightarrow L$ as $x \rightarrow a$. For visual simplicity we have drawn the graph of $f$ to be increasing on an open interval containing $a$, and we have intentionally placed a hole in the graph at $x=a$ to emphasize that $f$ need not be defined at $x=a$ to have a limit there.
L02081: [FIGURE:473f62b58fc8a237 | This figure contains three graphs illustrating the definition of a limit. Each graph shows a curve $y=f(x)$ in the first quadrant of a Cartesian coordinate system. Graph (a) shows an intuitive...]
L02082: △ Figure 1.4.1
L02084: Next, let us choose any positive number $\epsilon$ and ask how close $x$ must be to $a$ in order for the values of $f(x)$ to be within $\epsilon$ units of $L$. We can answer this geometrically by drawing horizontal lines from the points $L+\epsilon$ and $L-\epsilon$ on the $y$-axis until they meet the curve $y=f(x)$, and then drawing vertical lines from those points on the curve to the $x$-axis (Figure 1.4.1b). As indicated in the figure, let $x_{0}$ and $x_{1}$ be the points where those vertical lines intersect the $x$-axis.
L02086: [FIGURE:52ef983b97adacfd | The figure illustrates the epsilon-delta definition of a limit with two diagrams. The top diagram shows a graph of a function $y=f(x)$ on an $xy$-plane, where for a given $\epsilon$-interval...]
L02087: Figure 1.4.2
L02089: Now imagine that $x$ gets closer and closer to $a$ (from either side). Eventually, $x$ will lie inside the interval $\left(x_{0}, x_{1}\right)$, which is marked in green in Figure 1.4.1c; and when this happens, the value of $f(x)$ will fall between $L-\epsilon$ and $L+\epsilon$, marked in red in the figure. Thus, we conclude:
L02091: If $f(x) \rightarrow L$ as $x \rightarrow a$, then for any positive number $\epsilon$, we can find an open interval $\left(x_{0}, x_{1}\right)$ on the $x$-axis that contains $a$ and has the property that for each $x$ in that interval (except possibly for $x=a$ ), the value of $f(x)$ is between $L-\epsilon$ and $L+\epsilon$.
L02093: What is important about this result is that it holds no matter how small we make $\epsilon$. However, making $\epsilon$ smaller and smaller forces $f(x)$ closer and closer to $L$-which is precisely the concept we were trying to capture mathematically.
L02095: Observe that in Figure 1.4.1 the interval $\left(x_{0}, x_{1}\right)$ extends farther on the right side of $a$ than on the left side. However, for many purposes it is preferable to have an interval that extends the same distance on both sides of $a$. For this purpose, let us choose any positive number $\delta$ that is smaller than both $x_{1}-a$ and $a-x_{0}$, and consider the interval
L02097: $$
L02098: (a-\delta, a+\delta)
L02099: $$
L02101: This interval extends the same distance $\delta$ on both sides of $a$ and lies inside of the interval $\left(x_{0}, x_{1}\right)$ (Figure 1.4.2). Moreover, the condition
L02103: $$
L02104: \begin{equation*}
L02105: L-\epsilon<f(x)<L+\epsilon \tag{1}
L02106: \end{equation*}
L02107: $$
L02109: holds for every $x$ in this interval (except possibly $x=a$ ), since this condition holds on the larger interval $\left(x_{0}, x_{1}\right)$.
L02111: Since (1) can be expressed as
L02113: $$
L02114: |f(x)-L|<\epsilon
L02115: $$
L02117: and the condition that $x$ lies in the interval $(a-\delta, a+\delta)$, but $x \neq a$, can be expressed as
L02119: $$
L02120: 0<|x-a|<\delta
L02121: $$
L02123: we are led to the following precise definition of a two-sided limit.
L02124: 1.4.1 LIMIT DEFINITION Let $f(x)$ be defined for all $x$ in some open interval containing the number $a$, with the possible exception that $f(x)$ need not be defined at $a$. We will write
L02126: $$
L02127: \lim _{x \rightarrow a} f(x)=L
L02128: $$
L02130: if given any number $\epsilon>0$ we can find a number $\delta>0$ such that
L02132: $$
L02133: |f(x)-L|<\epsilon \quad \text { if } \quad 0<|x-a|<\delta
L02134: $$
L02136: This definition, which is attributed to the German mathematician Karl Weierstrass and is commonly called the "epsilon-delta" definition of a two-sided limit, makes the transition from an informal concept of a limit to a precise definition. Specifically, the informal phrase "as close as we like to $L$ " is given quantitative meaning by our ability to choose the positive number $\epsilon$ arbitrarily, and the phrase "sufficiently close to $a$ " is quantified by the positive number $\delta$.
L02138: In the preceding sections we illustrated various numerical and graphical methods for guessing at limits. Now that we have a precise definition to work with, we can actually
L02139: confirm the validity of those guesses with mathematical proof. Here is a typical example of such a proof.
L02141: Example 1 Use Definition 1.4.1 to prove that $\lim _{x \rightarrow 2}(3 x-5)=1$.
L02142: Solution. We must show that given any positive number $\epsilon$, we can find a positive number $\delta$ such that
L02144: $$
L02145: \begin{equation*}
L02146: |\underbrace{(3 x-5)}_{f(x)}-\underbrace{1}_{L}|<\epsilon \quad \text { if } \quad 0<|x-\underbrace{2}_{a}|<\delta \tag{2}
L02147: \end{equation*}
L02148: $$
L02150: There are two things to do. First, we must discover a value of $\delta$ for which this statement holds, and then we must prove that the statement holds for that $\delta$. For the discovery part we begin by simplifying (2) and writing it as
L02152: $$
L02153: |3 x-6|<\epsilon \quad \text { if } \quad 0<|x-2|<\delta
L02154: $$
L02156: Next we will rewrite this statement in a form that will facilitate the discovery of an appropriate $\delta$ :
L02158: $$
L02159: \begin{array}{lll}
L02160: 3|x-2|<\epsilon & \text { if } & 0<|x-2|<\delta \\
L02161: |x-2|<\epsilon / 3 & \text { if } & 0<|x-2|<\delta \tag{3}
L02162: \end{array}
L02163: $$
L02165: It should be self-evident that this last statement holds if $\delta=\epsilon / 3$, which completes the discovery portion of our work. Now we need to prove that (2) holds for this choice of $\delta$. However, statement (2) is equivalent to (3), and (3) holds with $\delta=\epsilon / 3$, so (2) also holds with $\delta=\epsilon / 3$. This proves that $\lim _{x \rightarrow 2}(3 x-5)=1$.
L02167: This example illustrates the general form of a limit proof: We assume that we are given a positive number $\epsilon$, and we try to prove that we can find a positive number $\delta$ such that
L02169: $$
L02170: \begin{equation*}
L02171: |f(x)-L|<\epsilon \text { if } 0<|x-a|<\delta \tag{4}
L02172: \end{equation*}
L02173: $$
L02175: This is done by first discovering $\delta$, and then proving that the discovered $\delta$ works. Since the argument has to be general enough to work for all positive values of $\epsilon$, the quantity $\delta$ has to be expressed as a function of $\epsilon$. In Example 1 we found the function $\delta=\epsilon / 3$ by some simple algebra; however, most limit proofs require a little more algebraic and logical ingenuity. Thus, if you find our ensuing discussion of " $\epsilon-\delta$ " proofs challenging, do not become discouraged; the concepts and techniques are intrinsically difficult. In fact, a precise understanding of limits evaded the finest mathematical minds for more than 150 years after the basic concepts of calculus were discovered.
L02176: [FIGURE:6344e800268f9283 | A black and white portrait shows an older man with light, receding hair, looking slightly to the left. He is wearing a dark suit and a bow tie. This image likely depicts a historical figure relevant...]
L02178: Karl Weierstrass (1815-1897) Weierstrass, the son of a customs officer, was born in Ostenfelde, Germany. As a youth Weierstrass showed outstanding skills in languages and mathematics. However, at the urging of his dominant father, Weierstrass entered the law and commerce program at the University of Bonn. To the chagrin of his family, the rugged and congenial young man concentrated instead on fencing and beer drinking. Four years later he returned home without a degree. In 1839 Weierstrass entered the Academy of Münster to study for a career in secondary education, and he met and studied under an excellent mathematician named Christof Gudermann. Gudermann's ideas greatly influenced the work of Weierstrass. After receiving his teaching certificate, Weierstrass spent the next 15 years in secondary education teaching German, geography, and mathematics. In addition, he taught handwriting to small children. During this period much of Weierstrass's mathematical work
L02179: was ignored because he was a secondary schoolteacher and not a college professor. Then, in 1854, he published a paper of major importance that created a sensation in the mathematics world and catapulted him to international fame overnight. He was immediately given an honorary Doctorate at the University of Königsberg and began a new career in college teaching at the University of Berlin in 1856. In 1859 the strain of his mathematical research caused a temporary nervous breakdown and led to spells of dizziness that plagued him for the rest of his life. Weierstrass was a brilliant teacher and his classes overflowed with multitudes of auditors. In spite of his fame, he never lost his early beer-drinking congeniality and was always in the company of students, both ordinary and brilliant. Weierstrass was acknowledged as the leading mathematical analyst in the world. He and his students opened the door to the modern school of mathematical analysis.
L02181: In Example 2 the limit from the left and the two-sided limit do not exist at $x=0$ because $\sqrt{x}$ is defined only for nonnegative values of $x$.
L02183: [FIGURE:6aee6bbf224599c9 | A number line, labeled with an $x$-axis, shows a central point $a$ marked with an open circle, indicating it is excluded. Two nested open intervals are depicted: a larger one spanning from $a-\delta$...]
L02184: △ Figure 1.4.3
L02186: If you are wondering how we knew to make the restriction $\delta \leq 1$, as opposed to $\delta \leq 5$ or $\delta \leq \frac{1}{2}$, for example, the answer is that 1 is merely a convenient choice-any restriction of the form $\delta \leq c$ would work equally well.
L02188: Example 2 Prove that $\lim _{x \rightarrow 0^{+}} \sqrt{x}=0$.
L02189: Solution. Note that the domain of $\sqrt{x}$ is $0 \leq x$, so it is valid to discuss the limit as $x \rightarrow 0^{+}$. We must show that given $\epsilon>0$, there exists a $\delta>0$ such that
L02191: $$
L02192: |\sqrt{x}-0|<\epsilon \quad \text { if } \quad 0<x-0<\delta
L02193: $$
L02195: or more simply,
L02197: $$
L02198: \begin{equation*}
L02199: \sqrt{x}<\epsilon \quad \text { if } \quad 0<x<\delta \tag{5}
L02200: \end{equation*}
L02201: $$
L02203: But, by squaring both sides of the inequality $\sqrt{x}<\epsilon$, we can rewrite (5) as
L02205: $$
L02206: \begin{equation*}
L02207: x<\epsilon^{2} \quad \text { if } \quad 0<x<\delta \tag{6}
L02208: \end{equation*}
L02209: $$
L02211: It should be self-evident that (6) is true if $\delta=\epsilon^{2}$; and since (6) is a reformulation of (5), we have shown that (5) holds with $\delta=\epsilon^{2}$. This proves that $\lim _{x \rightarrow 0^{+}} \sqrt{x}=0$.
L02213: ## THE VALUE OF $\boldsymbol{\delta}$ IS NOT UNIQUE
L02215: In preparation for our next example, we note that the value of $\delta$ in Definition 1.4.1 is not unique; once we have found a value of $\delta$ that fulfills the requirements of the definition, then any smaller positive number $\delta_{1}$ will also fulfill those requirements. That is, if it is true that
L02217: $$
L02218: |f(x)-L|<\epsilon \quad \text { if } \quad 0<|x-a|<\delta
L02219: $$
L02221: then it will also be true that
L02223: $$
L02224: |f(x)-L|<\epsilon \quad \text { if } \quad 0<|x-a|<\delta_{1}
L02225: $$
L02227: This is because $\left\{x: 0<|x-a|<\delta_{1}\right\}$ is a subset of $\{x: 0<|x-a|<\delta\}$ (Figure 1.4.3), and hence if $|f(x)-L|<\epsilon$ is satisfied for all $x$ in the larger set, then it will automatically be satisfied for all $x$ in the subset. Thus, in Example 1, where we used $\delta=\epsilon / 3$, we could have used any smaller value of $\delta$ such as $\delta=\epsilon / 4, \delta=\epsilon / 5$, or $\delta=\epsilon / 6$.
L02229: Example 3 Prove that $\lim _{x \rightarrow 3} x^{2}=9$.
L02230: Solution. We must show that given any positive number $\epsilon$, we can find a positive number $\delta$ such that
L02232: $$
L02233: \begin{equation*}
L02234: \left|x^{2}-9\right|<\epsilon \quad \text { if } \quad 0<|x-3|<\delta \tag{7}
L02235: \end{equation*}
L02236: $$
L02238: Because $|x-3|$ occurs on the right side of this "if statement," it will be helpful to factor the left side to introduce a factor of $|x-3|$. This yields the following alternative form of (7):
L02240: $$
L02241: \begin{equation*}
L02242: |x+3||x-3|<\epsilon \quad \text { if } \quad 0<|x-3|<\delta \tag{8}
L02243: \end{equation*}
L02244: $$
L02246: We wish to bound the factor $|x+3|$. If we knew, for example, that $\delta \leq 1$, then we would have $-1<x-3<1$, so $5<x+3<7$, and consequently $|x+3|<7$. Thus, if $\delta \leq 1$ and $0<|x-3|<\delta$, then
L02248: $$
L02249: |x+3||x-3|<7 \delta
L02250: $$
L02252: It follows that (8) will be satisfied for any positive $\delta$ such that $\delta \leq 1$ and $7 \delta<\epsilon$. We can achieve this by taking $\delta$ to be the minimum of the numbers 1 and $\epsilon / 7$, which is sometimes written as $\delta=\min (1, \epsilon / 7)$. This proves that $\lim _{x \rightarrow 3} x^{2}=9$.
L02254: ## LIMITS AS $\boldsymbol{x} \rightarrow \pm \infty$
L02256: In Section 1.3 we discussed the limits
L02258: $$
L02259: \lim _{x \rightarrow+\infty} f(x)=L \quad \text { and } \quad \lim _{x \rightarrow-\infty} f(x)=L
L02260: $$
L02262: from an intuitive point of view. The first limit can be interpreted to mean that we can make the value of $f(x)$ as close as we like to $L$ by taking $x$ sufficiently large, and the second can be interpreted to mean that we can make the value of $f(x)$ as close as we like to $L$ by taking $x$ sufficiently far to the left of 0 . These ideas are captured in the following definitions and are illustrated in Figure 1.4.4.
L02263: 1.4.2 DEFINITION Let $f(x)$ be defined for all $x$ in some infinite open interval extending in the positive $x$-direction. We will write
L02265: $$
L02266: \lim _{x \rightarrow+\infty} f(x)=L
L02267: $$
L02269: if given any number $\epsilon>0$, there corresponds a positive number $N$ such that
L02271: $$
L02272: |f(x)-L|<\epsilon \quad \text { if } \quad x>N
L02273: $$
L02275: 1.4.3 DEFINITION Let $f(x)$ be defined for all $x$ in some infinite open interval extending in the negative $x$-direction. We will write
L02277: $$
L02278: \lim _{x \rightarrow-\infty} f(x)=L
L02279: $$
L02281: if given any number $\epsilon>0$, there corresponds a negative number $N$ such that
L02283: $$
L02284: |f(x)-L|<\epsilon \quad \text { if } \quad x<N
L02285: $$
L02287: To see how these definitions relate to our informal concepts of these limits, suppose that $f(x) \rightarrow L$ as $x \rightarrow+\infty$, and for a given $\epsilon$ let $N$ be the positive number described in Definition 1.4.2. If $x$ is allowed to increase indefinitely, then eventually $x$ will lie in the interval $(N,+\infty)$, which is marked in green in Figure 1.4.4a; when this happens, the value of $f(x)$ will fall between $L-\epsilon$ and $L+\epsilon$, marked in red in the figure. Since this is true for all positive values of $\epsilon$ (no matter how small), we can force the values of $f(x)$ as close as we like to $L$ by making $N$ sufficiently large. This agrees with our informal concept of this limit. Similarly, Figure 1.4.4b illustrates Definition 1.4.3.
L02289: [FIGURE:8035139bd1c15005 | The figure displays two graphs, (a) and (b), illustrating the epsilon-N definition of limits at infinity. Graph (a) shows $\lim_{x \rightarrow+\infty} f(x)=L$. A wavy blue curve $f(x)$ approaches a...]
L02290: Δ Figure 1.4.4
L02292: - Example 4 Prove that $\lim _{x \rightarrow+\infty} \frac{1}{x}=0$.
L02294: [FIGURE:2a1d112cb72c7f65 | The figure consists of two graphs, (a) and (b), illustrating the formal definitions of infinite limits at a point $x=a$. Both graphs feature an x-axis and a y-axis. Graph (a) shows a function $f(x)$...]
L02295: △ Figure 1.4.5
L02297: How would you define these limits?
L02299: $$
L02300: \begin{aligned}
L02301: & \lim _{x \rightarrow a^{+}} f(x)=+\infty \\
L02302: & \lim _{x \rightarrow a^{-}} f(x)=+\infty \\
L02303: & \lim _{x \rightarrow a^{+}} f(x)=-\infty \\
L02304: & \lim _{x \rightarrow+\infty} f(x)=+\infty \\
L02305: & \lim _{x \rightarrow-\infty} f(x)=-\infty \\
L02306: & \lim _{x \rightarrow+\infty} f(x)=-\infty \\
L02307: & \lim _{x \rightarrow-\infty} f(x)=-\infty
L02308: \end{aligned}
L02309: $$
L02311: Solution. Applying Definition 1.4.2 with $f(x)=1 / x$ and $L=0$, we must show that given $\epsilon>0$, we can find a number $N>0$ such that
L02313: $$
L02314: \begin{equation*}
L02315: \left|\frac{1}{x}-0\right|<\epsilon \quad \text { if } \quad x>N \tag{9}
L02316: \end{equation*}
L02317: $$
L02319: Because $x \rightarrow+\infty$ we can assume that $x>0$. Thus, we can eliminate the absolute values in this statement and rewrite it as
L02321: $$
L02322: \frac{1}{x}<\epsilon \quad \text { if } \quad x>N
L02323: $$
L02325: or, on taking reciprocals,
L02327: $$
L02328: \begin{equation*}
L02329: x>\frac{1}{\epsilon} \quad \text { if } \quad x>N \tag{10}
L02330: \end{equation*}
L02331: $$
L02333: It is self-evident that $N=1 / \epsilon$ satisfies this requirement, and since (10) and (9) are equivalent for $x>0$, the proof is complete. $\square$
L02335: ## INFINITE LIMITS
L02337: In Section 1.1 we discussed limits of the following type from an intuitive viewpoint:
L02339: $$
L02340: \begin{array}{ll}
L02341: \lim _{x \rightarrow a} f(x)=+\infty, & \lim _{x \rightarrow a} f(x)=-\infty \\
L02342: \lim _{x \rightarrow a^{+}} f(x)=+\infty, & \lim _{x \rightarrow a^{+}} f(x)=-\infty \\
L02343: \lim _{x \rightarrow a^{-}} f(x)=+\infty, & \lim _{x \rightarrow a^{-}} f(x)=-\infty \tag{13}
L02344: \end{array}
L02345: $$
L02347: Recall that each of these expressions describes a particular way in which the limit fails to exist. The $+\infty$ indicates that the limit fails to exist because $f(x)$ increases without bound, and the $-\infty$ indicates that the limit fails to exist because $f(x)$ decreases without bound. These ideas are captured more precisely in the following definitions and are illustrated in Figure 1.4.5.
L02348: 1.4.4 DEFINITION Let $f(x)$ be defined for all $x$ in some open interval containing $a$, except that $f(x)$ need not be defined at $a$. We will write
L02350: $$
L02351: \lim _{x \rightarrow a} f(x)=+\infty
L02352: $$
L02354: if given any positive number $M$, we can find a number $\delta>0$ such that $f(x)$ satisfies
L02356: $$
L02357: f(x)>M \quad \text { if } \quad 0<|x-a|<\delta
L02358: $$
L02360: 1.4.5 DEFINITION Let $f(x)$ be defined for all $x$ in some open interval containing $a$, except that $f(x)$ need not be defined at $a$. We will write
L02362: $$
L02363: \lim _{x \rightarrow a} f(x)=-\infty
L02364: $$
L02366: if given any negative number $M$, we can find a number $\delta>0$ such that $f(x)$ satisfies
L02368: $$
L02369: f(x)<M \quad \text { if } \quad 0<|x-a|<\delta
L02370: $$
L02372: To see how these definitions relate to our informal concepts of these limits, suppose that $f(x) \rightarrow+\infty$ as $x \rightarrow a$, and for a given $M$ let $\delta$ be the corresponding positive number described in Definition 1.4.4. Next, imagine that $x$ gets closer and closer to $a$ (from either side). Eventually, $x$ will lie in the interval $(a-\delta, a+\delta)$, which is marked in green in Figure 1.4.5a; when this happens the value of $f(x)$ will be greater than $M$, marked in red in
L02373: the figure. Since this is true for any positive value of $M$ (no matter how large), we can force the values of $f(x)$ to be as large as we like by making $x$ sufficiently close to $a$. This agrees with our informal concept of this limit. Similarly, Figure 1.4.5b illustrates Definition 1.4.5.
L02375: - Example 5 Prove that $\lim _{x \rightarrow 0} \frac{1}{x^{2}}=+\infty$.
L02377: Solution. Applying Definition 1.4.4 with $f(x)=1 / x^{2}$ and $a=0$, we must show that given a number $M>0$, we can find a number $\delta>0$ such that
L02379: $$
L02380: \begin{equation*}
L02381: \frac{1}{x^{2}}>M \quad \text { if } \quad 0<|x-0|<\delta \tag{14}
L02382: \end{equation*}
L02383: $$
L02385: or, on taking reciprocals and simplifying,
L02387: $$
L02388: \begin{equation*}
L02389: x^{2}<\frac{1}{M} \quad \text { if } \quad 0<|x|<\delta \tag{15}
L02390: \end{equation*}
L02391: $$
L02393: But $x^{2}<1 / M$ if $|x|<1 / \sqrt{M}$, so that $\delta=1 / \sqrt{M}$ satisfies (15). Since (14) is equivalent to (15), the proof is complete.
L02395: ## QUICK CHECK EXERCISES 1.4 (See page 109 for answers.)
L02397: 1. The definition of a two-sided limit states: $\lim _{x \rightarrow a} f(x)=L$ if given any number $\_\_\_\_$ there is a number $\_\_\_\_$ such that $|f(x)-L|<\epsilon$ if $\_\_\_\_$ .
L02398: 2. Suppose that $f(x)$ is a function such that for any given $\epsilon>0$, the condition $0<|x-1|<\epsilon / 2$ guarantees that $|f(x)-5|<\epsilon$. What limit results from this property?
L02399: 3. Suppose that $\epsilon$ is any positive number. Find the largest value of $\delta$ such that $|5 x-10|<\epsilon$ if $0<|x-2|<\delta$.
L02400: 4. The definition of limit at $+\infty$ states: $\lim _{x \rightarrow+\infty} f(x)=L$ if given any number $\_\_\_\_$ there is a positive number
L02401: $\_\_\_\_$ such that $|f(x)-L|<\epsilon$ if $\_\_\_\_$ .
L02402: 5. Find the smallest positive number $N$ such that for each $x>N$, the value of $f(x)=1 / \sqrt{x}$ is within 0.01 of 0 .
L02404: ## EXERCISE SET 1.4 Graphing Utility
L02406: 1. (a) Find the largest open interval, centered at the origin on the $x$-axis, such that for each $x$ in the interval the value of the function $f(x)=x+2$ is within 0.1 unit of the number $f(0)=2$.
L02407: (b) Find the largest open interval, centered at $x=3$, such that for each $x$ in the interval the value of the function $f(x)=4 x-5$ is within 0.01 unit of the number $f(3)=7$.
L02408: (c) Find the largest open interval, centered at $x=4$, such that for each $x$ in the interval the value of the function $f(x)=x^{2}$ is within 0.001 unit of the number $f(4)=16$.
L02409: 2. In each part, find the largest open interval, centered at $x=0$, such that for each $x$ in the interval the value of $f(x)=2 x+3$ is within $\epsilon$ units of the number $f(0)=3$.
L02410: (a) $\epsilon=0.1$
L02411: (b) $\epsilon=0.01$
L02412: (c) $\epsilon=0.0012$
L02413: 3. (a) Find the values of $x_{0}$ and $x_{1}$ in the accompanying figure.
L02414: (b) Find a positive number $\delta$ such that $|\sqrt{x}-2|<0.05$ if $0<|x-4|<\delta$.
L02416: [FIGURE:13cf6b31ffade110 | A graph shows the function $y = \sqrt{x}$ in the first quadrant. The point $(4, 2)$ is marked on the curve. Horizontal dashed lines at $y = 2 - 0.05$, $y = 2$, and $y = 2 + 0.05$ define an...]
L02417: Not drawn to scale
