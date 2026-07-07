L09370: ## QUICK CHECK ANSWERS 3.5
L09372: 1. tangent; $f(x) ; x_{0}$
L09373: 2. $y=1+(-4)(x-2)$ or $y=-4 x+9$
L09374: 3. $d y=-0.4, \Delta y=-0.41$
L09375: 4. within $\pm 1 \%$
L09377: ### 3.6 L'HÔPITAL'S RULE; INDETERMINATE FORMS
L09379: In this section we will discuss a general method for using derivatives to find limits. This method will enable us to establish limits with certainty that earlier in the text we were only able to conjecture using numerical or graphical evidence. The method that we will discuss in this section is an extremely powerful tool that is used internally by many computer programs to calculate limits of various types.
L09381: ## INDETERMINATE FORMS OF TYPE 0/0
L09383: Recall that a limit of the form
L09385: $$
L09386: \begin{equation*}
L09387: \lim _{x \rightarrow a} \frac{f(x)}{g(x)} \tag{1}
L09388: \end{equation*}
L09389: $$
L09391: in which $f(x) \rightarrow 0$ and $g(x) \rightarrow 0$ as $x \rightarrow a$ is called an indeterminate form of type $\mathbf{0} / \mathbf{0}$. Some examples encountered earlier in the text are
L09393: $$
L09394: \lim _{x \rightarrow 1} \frac{x^{2}-1}{x-1}=2, \quad \lim _{x \rightarrow 0} \frac{\sin x}{x}=1, \quad \lim _{x \rightarrow 0} \frac{1-\cos x}{x}=0
L09395: $$
L09397: ## WARNING
L09399: Note that in L'Hôpital's rule the numerator and denominator are differentiated individually. This is not the same as differentiating $f(x) / g(x)$.
L09401: The first limit was obtained algebraically by factoring the numerator and canceling the common factor of $x-1$, and the second two limits were obtained using geometric methods. However, there are many indeterminate forms for which neither algebraic nor geometric methods will produce the limit, so we need to develop a more general method.
L09403: To motivate such a method, suppose that (1) is an indeterminate form of type $0 / 0$ in which $f^{\prime}$ and $g^{\prime}$ are continuous at $x=a$ and $g^{\prime}(a) \neq 0$. Since $f$ and $g$ can be closely approximated by their local linear approximations near $a$, it is reasonable to expect that
L09405: $$
L09406: \begin{equation*}
L09407: \lim _{x \rightarrow a} \frac{f(x)}{g(x)}=\lim _{x \rightarrow a} \frac{f(a)+f^{\prime}(a)(x-a)}{g(a)+g^{\prime}(a)(x-a)} \tag{2}
L09408: \end{equation*}
L09409: $$
L09411: Since we are assuming that $f^{\prime}$ and $g^{\prime}$ are continuous at $x=a$, we have
L09413: $$
L09414: \lim _{x \rightarrow a} f^{\prime}(x)=f^{\prime}(a) \quad \text { and } \quad \lim _{x \rightarrow a} g^{\prime}(x)=g^{\prime}(a)
L09415: $$
L09417: and since the differentiability of $f$ and $g$ at $x=a$ implies the continuity of $f$ and $g$ at $x=a$, we have
L09419: $$
L09420: f(a)=\lim _{x \rightarrow a} f(x)=0 \quad \text { and } \quad g(a)=\lim _{x \rightarrow a} g(x)=0
L09421: $$
L09423: Thus, we can rewrite (2) as
L09425: $$
L09426: \begin{equation*}
L09427: \lim _{x \rightarrow a} \frac{f(x)}{g(x)}=\lim _{x \rightarrow a} \frac{f^{\prime}(a)(x-a)}{g^{\prime}(a)(x-a)}=\lim _{x \rightarrow a} \frac{f^{\prime}(a)}{g^{\prime}(a)}=\lim _{x \rightarrow a} \frac{f^{\prime}(x)}{g^{\prime}(x)} \tag{3}
L09428: \end{equation*}
L09429: $$
L09431: This result, called L'Hôpital's rule, converts the given indeterminate form into a limit involving derivatives that is often easier to evaluate.
L09433: Although we motivated (3) by assuming that $f$ and $g$ have continuous derivatives at $x=a$ and that $g^{\prime}(a) \neq 0$, the result is true under less stringent conditions and is also valid for one-sided limits and limits at $+\infty$ and $-\infty$. The proof of the following precise statement of L'Hôpital's rule is omitted.
L09434: 3.6.1 THEOREM (L'Hôpital's Rule for Form 0/0) Suppose that $f$ and $g$ are differentiable functions on an open interval containing $x=a$, except possibly at $x=a$, and that
L09436: $$
L09437: \lim _{x \rightarrow a} f(x)=0 \quad \text { and } \quad \lim _{x \rightarrow a} g(x)=0
L09438: $$
L09440: If $\lim _{x \rightarrow a}\left[f^{\prime}(x) / g^{\prime}(x)\right]$ exists, or if this limit is $+\infty$ or $-\infty$, then
L09442: $$
L09443: \lim _{x \rightarrow a} \frac{f(x)}{g(x)}=\lim _{x \rightarrow a} \frac{f^{\prime}(x)}{g^{\prime}(x)}
L09444: $$
L09446: Moreover, this statement is also true in the case of a limit as $x \rightarrow a^{-}, x \rightarrow a^{+}, x \rightarrow-\infty$, or as $x \rightarrow+\infty$.
L09448: In the examples that follow we will apply L'Hôpital's rule using the following three-step process:
L09450: ## Applying L'Hôpital's Rule
L09452: Step 1. Check that the limit of $f(x) / g(x)$ is an indeterminate form of type $0 / 0$.
L09453: Step 2. Differentiate $f$ and $g$ separately.
L09454: Step 3. Find the limit of $f^{\prime}(x) / g^{\prime}(x)$. If this limit is finite, $+\infty$, or $-\infty$, then it is equal to the limit of $f(x) / g(x)$.
L09456: The limit in Example 1 can be interpreted as the limit form of a certain derivative. Use that derivative to evaluate the limit.
L09458: ## WARNING
L09460: Applying L'Hôpital's rule to limits that are not indeterminate forms can produce incorrect results. For example, the computation
L09462: $$
L09463: \begin{aligned}
L09464: \lim _{x \rightarrow 0} \frac{x+6}{x+2} & =\lim _{x \rightarrow 0} \frac{\frac{d}{d x}[x+6]}{\frac{d}{d x}[x+2]} \\
L09465: & =\lim _{x \rightarrow 0} \frac{1}{1}=1
L09466: \end{aligned}
L09467: $$
L09469: is not valid, since the limit is not an indeterminate form. The correct result is
L09471: $$
L09472: \lim _{x \rightarrow 0} \frac{x+6}{x+2}=\frac{0+6}{0+2}=3
L09473: $$
L09475: Example 1 Find the limit
L09477: $$
L09478: \lim _{x \rightarrow 2} \frac{x^{2}-4}{x-2}
L09479: $$
L09481: using L'Hôpital's rule, and check the result by factoring.
L09482: Solution. The numerator and denominator have a limit of 0 , so the limit is an indeterminate form of type 0/0. Applying L'Hôpital's rule yields
L09484: $$
L09485: \lim _{x \rightarrow 2} \frac{x^{2}-4}{x-2}=\lim _{x \rightarrow 2} \frac{\frac{d}{d x}\left[x^{2}-4\right]}{\frac{d}{d x}[x-2]}=\lim _{x \rightarrow 2} \frac{2 x}{1}=4
L09486: $$
L09488: This agrees with the computation
L09490: $$
L09491: \lim _{x \rightarrow 2} \frac{x^{2}-4}{x-2}=\lim _{x \rightarrow 2} \frac{(x-2)(x+2)}{x-2}=\lim _{x \rightarrow 2}(x+2)=4
L09492: $$
L09494: Example 2 In each part confirm that the limit is an indeterminate form of type $0 / 0$, and evaluate it using L'Hôpital's rule.
L09495: (a) $\lim _{x \rightarrow 0} \frac{\sin 2 x}{x}$
L09496: (b) $\lim _{x \rightarrow \pi / 2} \frac{1-\sin x}{\cos x}$
L09497: (c) $\lim _{x \rightarrow 0} \frac{e^{x}-1}{x^{3}}$
L09498: (d) $\lim _{x \rightarrow 0^{-}} \frac{\tan x}{x^{2}}$
L09499: (e) $\lim _{x \rightarrow 0} \frac{1-\cos x}{x^{2}}$
L09500: (f) $\lim _{x \rightarrow+\infty} \frac{x^{-4 / 3}}{\sin (1 / x)}$
L09502: Solution (a). The numerator and denominator have a limit of 0 , so the limit is an indeterminate form of type 0/0. Applying L'Hôpital's rule yields
L09504: $$
L09505: \lim _{x \rightarrow 0} \frac{\sin 2 x}{x}=\lim _{x \rightarrow 0} \frac{\frac{d}{d x}[\sin 2 x]}{\frac{d}{d x}[x]}=\lim _{x \rightarrow 0} \frac{2 \cos 2 x}{1}=2
L09506: $$
L09508: Observe that this result agrees with that obtained by substitution in Example 4(b) of Section 1.6.
L09510: Solution (b). The numerator and denominator have a limit of 0 , so the limit is an indeterminate form of type $0 / 0$. Applying L'Hôpital's rule yields
L09512: $$
L09513: \lim _{x \rightarrow \pi / 2} \frac{1-\sin x}{\cos x}=\lim _{x \rightarrow \pi / 2} \frac{\frac{d}{d x}[1-\sin x]}{\frac{d}{d x}[\cos x]}=\lim _{x \rightarrow \pi / 2} \frac{-\cos x}{-\sin x}=\frac{0}{-1}=0
L09514: $$
L09516: Guillaume François Antoine de L'Hôpital (1661-1704) French mathematician. L'Hôpital, born to parents of the French high nobility, held the title of Marquis de SainteMesme Comte d'Autrement. He showed mathematical talent quite early and at age 15 solved a difficult problem about cycloids posed by Pascal. As a young man he served briefly as a cavalry officer, but resigned because of nearsightedness. In his own time he gained fame as the author of the first textbook ever published on differential calculus, L'Analyse des
L09518: Infiniment Petits pour l'Intelligence des Lignes Courbes (1696). L'Hôpital's rule appeared for the first time in that book. Actually, L'Hôpital's rule and most of the material in the calculus text were due to John Bernoulli, who was L'Hôpital's teacher. L'Hôpital dropped his plans for a book on integral calculus when Leibniz informed him that he intended to write such a text. L'Hôpital was apparently generous and personable, and his many contacts with major mathematicians provided the vehicle for disseminating major discoveries in calculus throughout Europe.
L09520: Solution ( $\boldsymbol{c}$ ). The numerator and denominator have a limit of 0 , so the limit is an indeterminate form of type $0 / 0$. Applying L'Hôpital's rule yields
L09522: $$
L09523: \lim _{x \rightarrow 0} \frac{e^{x}-1}{x^{3}}=\lim _{x \rightarrow 0} \frac{\frac{d}{d x}\left[e^{x}-1\right]}{\frac{d}{d x}\left[x^{3}\right]}=\lim _{x \rightarrow 0} \frac{e^{x}}{3 x^{2}}=+\infty
L09524: $$
L09526: Solution (d). The numerator and denominator have a limit of 0 , so the limit is an indeterminate form of type 0/0. Applying L'Hôpital's rule yields
L09528: $$
L09529: \lim _{x \rightarrow 0^{-}} \frac{\tan x}{x^{2}}=\lim _{x \rightarrow 0^{-}} \frac{\sec ^{2} x}{2 x}=-\infty
L09530: $$
L09532: Solution (e). The numerator and denominator have a limit of 0 , so the limit is an indeterminate form of type 0/0. Applying L'Hôpital's rule yields
L09534: $$
L09535: \lim _{x \rightarrow 0} \frac{1-\cos x}{x^{2}}=\lim _{x \rightarrow 0} \frac{\sin x}{2 x}
L09536: $$
L09538: Since the new limit is another indeterminate form of type $0 / 0$, we apply L'Hôpital's rule again:
L09540: $$
L09541: \lim _{x \rightarrow 0} \frac{1-\cos x}{x^{2}}=\lim _{x \rightarrow 0} \frac{\sin x}{2 x}=\lim _{x \rightarrow 0} \frac{\cos x}{2}=\frac{1}{2}
L09542: $$
L09544: Solution ( $f$ ). The numerator and denominator have a limit of 0 , so the limit is an indeterminate form of type 0/0. Applying L'Hôpital's rule yields
L09546: $$
L09547: \lim _{x \rightarrow+\infty} \frac{x^{-4 / 3}}{\sin (1 / x)}=\lim _{x \rightarrow+\infty} \frac{-\frac{4}{3} x^{-7 / 3}}{\left(-1 / x^{2}\right) \cos (1 / x)}=\lim _{x \rightarrow+\infty} \frac{\frac{4}{3} x^{-1 / 3}}{\cos (1 / x)}=\frac{0}{1}=0
L09548: $$
L09550: ## INDETERMINATE FORMS OF TYPE $\infty / \infty$
L09552: When we want to indicate that the limit (or a one-sided limit) of a function is $+\infty$ or $-\infty$ without being specific about the sign, we will say that the limit is $\infty$. For example,
L09554: $$
L09555: \begin{array}{ccccc}
L09556: \lim _{x \rightarrow a^{+}} f(x)=\infty & \text { means } & \lim _{x \rightarrow a^{+}} f(x)=+\infty & \text { or } & \lim _{x \rightarrow a^{+}} f(x)=-\infty \\
L09557: \lim _{x \rightarrow+\infty} f(x)=\infty & \text { means } & \lim _{x \rightarrow+\infty} f(x)=+\infty & \text { or } & \lim _{x \rightarrow+\infty} f(x)=-\infty \\
L09558: \lim _{x \rightarrow a} f(x)=\infty & \text { means } & \lim _{x \rightarrow a^{+}} f(x)= \pm \infty & \text { and } & \lim _{x \rightarrow a^{-}} f(x)= \pm \infty
L09559: \end{array}
L09560: $$
L09562: The limit of a ratio, $f(x) / g(x)$, in which the numerator has limit $\infty$ and the denominator has limit $\infty$ is called an indeterminate form of type $\infty / \infty$. The following version of L'Hôpital's rule, which we state without proof, can often be used to evaluate limits of this type.
L09563: 3.6.2 THEOREM (L'Hôpital's Rule for Form $\infty / \infty$ ) Suppose that $f$ and $g$ are differentiable functions on an open interval containing $x=a$, except possibly at $x=a$, and that
L09565: $$
L09566: \lim _{x \rightarrow a} f(x)=\infty \quad \text { and } \quad \lim _{x \rightarrow a} g(x)=\infty
L09567: $$
L09569: If $\lim _{x \rightarrow a}\left[f^{\prime}(x) / g^{\prime}(x)\right]$ exists, or if this limit is $+\infty$ or $-\infty$, then
L09571: $$
L09572: \lim _{x \rightarrow a} \frac{f(x)}{g(x)}=\lim _{x \rightarrow a} \frac{f^{\prime}(x)}{g^{\prime}(x)}
L09573: $$
L09575: Moreover, this statement is also true in the case of a limit as $x \rightarrow a^{-}, x \rightarrow a^{+}, x \rightarrow-\infty$, or as $x \rightarrow+\infty$.
L09577: [FIGURE:1a6805b9b838e637 | Two graphs illustrate the behavior of functions involving ratios of polynomial and exponential terms. Graph (a) shows the function $y = x^5 / e^x$, which starts at 0, rises to a maximum around $(5...]
L09578: - Figure 3.6.1
L09580: - Example 3 In each part confirm that the limit is an indeterminate form of type $\infty / \infty$ and apply L'Hôpital's rule.
L09581: (a) $\lim _{x \rightarrow+\infty} \frac{x}{e^{x}}$
L09582: (b) $\lim _{x \rightarrow 0^{+}} \frac{\ln x}{\csc x}$
L09584: Solution (a). The numerator and denominator both have a limit of $+\infty$, so we have an indeterminate form of type $\infty / \infty$. Applying L'Hôpital's rule yields
L09586: $$
L09587: \lim _{x \rightarrow+\infty} \frac{x}{e^{x}}=\lim _{x \rightarrow+\infty} \frac{1}{e^{x}}=0
L09588: $$
L09590: Solution (b). The numerator has a limit of $-\infty$ and the denominator has a limit of $+\infty$, so we have an indeterminate form of type $\infty / \infty$. Applying L'Hôpital's rule yields
L09592: $$
L09593: \begin{equation*}
L09594: \lim _{x \rightarrow 0^{+}} \frac{\ln x}{\csc x}=\lim _{x \rightarrow 0^{+}} \frac{1 / x}{-\csc x \cot x} \tag{4}
L09595: \end{equation*}
L09596: $$
L09598: This last limit is again an indeterminate form of type $\infty / \infty$. Moreover, any additional applications of L'Hôpital's rule will yield powers of $1 / x$ in the numerator and expressions involving $\csc x$ and $\cot x$ in the denominator; thus, repeated application of L'Hôpital's rule simply produces new indeterminate forms. We must try something else. The last limit in (4) can be rewritten as
L09600: $$
L09601: \lim _{x \rightarrow 0^{+}}\left(-\frac{\sin x}{x} \tan x\right)=-\lim _{x \rightarrow 0^{+}} \frac{\sin x}{x} \cdot \lim _{x \rightarrow 0^{+}} \tan x=-(1)(0)=0
L09602: $$
L09604: Thus,
L09606: $$
L09607: \lim _{x \rightarrow 0^{+}} \frac{\ln x}{\csc x}=0
L09608: $$
L09610: ## ANALYZING THE GROWTH OF EXPONENTIAL FUNCTIONS USING L'HÔPITAL'S RULE
L09612: If $n$ is any positive integer, then $x^{n} \rightarrow+\infty$ as $x \rightarrow+\infty$. Such integer powers of $x$ are sometimes used as "measuring sticks" to describe how rapidly other functions grow. For example, we know that $e^{x} \rightarrow+\infty$ as $x \rightarrow+\infty$ and that the growth of $e^{x}$ is very rapid (Table 0.5.5); however, the growth of $x^{n}$ is also rapid when $n$ is a high power, so it is reasonable to ask whether high powers of $x$ grow more or less rapidly than $e^{x}$. One way to investigate this is to examine the behavior of the ratio $x^{n} / e^{x}$ as $x \rightarrow+\infty$. For example, Figure 3.6.1a shows the graph of $y=x^{5} / e^{x}$. This graph suggests that $x^{5} / e^{x} \rightarrow 0$ as $x \rightarrow+\infty$, and this implies that the growth of the function $e^{x}$ is sufficiently rapid that its values eventually overtake those of $x^{5}$ and force the ratio toward zero. Stated informally, " $e^{x}$ eventually grows more rapidly than $x^{5}$." The same conclusion could have been reached by putting $e^{x}$ on top and examining the behavior of $e^{x} / x^{5}$ as $x \rightarrow+\infty$ (Figure 3.6.1b). In this case the values of $e^{x}$ eventually overtake those of $x^{5}$ and force the ratio toward $+\infty$. More generally, we can use L'Hôpital's rule to show that $e^{x}$ eventually grows more rapidly than any positive integer power of $x$, that is,
L09614: $$
L09615: \begin{equation*}
L09616: \lim _{x \rightarrow+\infty} \frac{x^{n}}{e^{x}}=0 \quad \text { and } \quad \lim _{x \rightarrow+\infty} \frac{e^{x}}{x^{n}}=+\infty \tag{5-6}
L09617: \end{equation*}
L09618: $$
L09620: Both limits are indeterminate forms of type $\infty / \infty$ that can be evaluated using L'Hôpital's rule. For example, to establish (5), we will need to apply L'Hôpital's rule $n$ times. For this purpose, observe that successive differentiations of $x^{n}$ reduce the exponent by 1 each time, thus producing a constant for the $n$th derivative. For example, the successive derivatives
L09621: of $x^{3}$ are $3 x^{2}, 6 x$, and 6. In general, the $n$th derivative of $x^{n}$ is $n(n-1)(n-2) \cdots 1=n!$ (verify). ${ }^{*}$ Thus, applying L'Hôpital's rule $n$ times to (5) yields
L09623: $$
L09624: \lim _{x \rightarrow+\infty} \frac{x^{n}}{e^{x}}=\lim _{x \rightarrow+\infty} \frac{n!}{e^{x}}=0
L09625: $$
L09627: Limit (6) can be established similarly.
L09629: ## INDETERMINATE FORMS OF TYPE $0 \cdot \infty$
L09631: Thus far we have discussed indeterminate forms of type $0 / 0$ and $\infty / \infty$. However, these are not the only possibilities; in general, the limit of an expression that has one of the forms
L09633: $$
L09634: \frac{f(x)}{g(x)}, \quad f(x) \cdot g(x), \quad f(x)^{g(x)}, \quad f(x)-g(x), \quad f(x)+g(x)
L09635: $$
L09637: is called an indeterminate form if the limits of $f(x)$ and $g(x)$ individually exert conflicting influences on the limit of the entire expression. For example, the limit
L09639: $$
L09640: \lim _{x \rightarrow 0^{+}} x \ln x
L09641: $$
L09643: is an indeterminate form of type $\mathbf{0} \cdot \infty$ because the limit of the first factor is 0 , the limit of the second factor is $-\infty$, and these two limits exert conflicting influences on the product. On the other hand, the limit
L09645: $$
L09646: \lim _{x \rightarrow+\infty}\left[\sqrt{x}\left(1-x^{2}\right)\right]
L09647: $$
L09649: is not an indeterminate form because the first factor has a limit of $+\infty$, the second factor has a limit of $-\infty$, and these influences work together to produce a limit of $-\infty$ for the product.
L09651: Indeterminate forms of type $0 \cdot \infty$ can sometimes be evaluated by rewriting the product as a ratio, and then applying L'Hôpital's rule for indeterminate forms of type $0 / 0$ or $\infty / \infty$.
L09653: ## WARNING
L09655: It is tempting to argue that an indeterminate form of type $0 \cdot \infty$ has value 0 since "zero times anything is zero." However, this is fallacious since $0 \cdot \infty$ is not a product of numbers, but rather a statement about limits. For example, here are two indeterminate forms of type $0 \cdot \infty$ whose limits are not zero:
L09657: $$
L09658: \begin{aligned}
L09659: \lim _{x \rightarrow 0}\left(x \cdot \frac{1}{x}\right) & =\lim _{x \rightarrow 0} 1=1 \\
L09660: \lim _{x \rightarrow 0^{+}}\left(\sqrt{x} \cdot \frac{1}{x}\right) & =\lim _{x \rightarrow 0^{+}}\left(\frac{1}{\sqrt{x}}\right) \\
L09661: & =+\infty
L09662: \end{aligned}
L09663: $$
L09665: ## Example 4 Evaluate
L09667: (a) $\lim _{x \rightarrow 0^{+}} x \ln x$
L09668: (b) $\lim _{x \rightarrow \pi / 4}(1-\tan x) \sec 2 x$
L09670: Solution (a). The factor $x$ has a limit of 0 and the factor $\ln x$ has a limit of $-\infty$, so the stated problem is an indeterminate form of type $0 \cdot \infty$. There are two possible approaches: we can rewrite the limit as
L09672: $$
L09673: \lim _{x \rightarrow 0^{+}} \frac{\ln x}{1 / x} \quad \text { or } \quad \lim _{x \rightarrow 0^{+}} \frac{x}{1 / \ln x}
L09674: $$
L09676: the first being an indeterminate form of type $\infty / \infty$ and the second an indeterminate form of type $0 / 0$. However, the first form is the preferred initial choice because the derivative of $1 / x$ is less complicated than the derivative of $1 / \ln x$. That choice yields
L09678: $$
L09679: \lim _{x \rightarrow 0^{+}} x \ln x=\lim _{x \rightarrow 0^{+}} \frac{\ln x}{1 / x}=\lim _{x \rightarrow 0^{+}} \frac{1 / x}{-1 / x^{2}}=\lim _{x \rightarrow 0^{+}}(-x)=0
L09680: $$
L09682: Solution (b). The stated problem is an indeterminate form of type $0 \cdot \infty$. We will convert it to an indeterminate form of type 0/0:
L09684: $$
L09685: \begin{aligned}
L09686: \lim _{x \rightarrow \pi / 4}(1-\tan x) \sec 2 x & =\lim _{x \rightarrow \pi / 4} \frac{1-\tan x}{1 / \sec 2 x}=\lim _{x \rightarrow \pi / 4} \frac{1-\tan x}{\cos 2 x} \\
L09687: & =\lim _{x \rightarrow \pi / 4} \frac{-\sec ^{2} x}{-2 \sin 2 x}=\frac{-2}{-2}=1
L09688: \end{aligned}
L09689: $$
L09691: [^1]
L09692: ## INDETERMINATE FORMS OF TYPE $\infty-\infty$
L09694: A limit problem that leads to one of the expressions
L09696: $$
L09697: \begin{array}{ll}
L09698: (+\infty)-(+\infty), & (-\infty)-(-\infty), \\
L09699: (+\infty)+(-\infty), & (-\infty)+(+\infty)
L09700: \end{array}
L09701: $$
L09703: is called an indeterminate form of type $\infty-\infty$. Such limits are indeterminate because the two terms exert conflicting influences on the expression: one pushes it in the positive direction and the other pushes it in the negative direction. However, limit problems that lead to one of the expressions
L09705: $$
L09706: \begin{array}{ll}
L09707: (+\infty)+(+\infty), & (+\infty)-(-\infty), \\
L09708: (-\infty)+(-\infty), & (-\infty)-(+\infty)
L09709: \end{array}
L09710: $$
L09712: are not indeterminate, since the two terms work together (those on the top produce a limit of $+\infty$ and those on the bottom produce a limit of $-\infty$ ).
L09714: Indeterminate forms of type $\infty-\infty$ can sometimes be evaluated by combining the terms and manipulating the result to produce an indeterminate form of type $0 / 0$ or $\infty / \infty$.
L09716: - Example 5 Evaluate $\lim _{x \rightarrow 0^{+}}\left(\frac{1}{x}-\frac{1}{\sin x}\right)$.
L09718: Solution. Both terms have a limit of $+\infty$, so the stated problem is an indeterminate form of type $\infty-\infty$. Combining the two terms yields
L09720: $$
L09721: \lim _{x \rightarrow 0^{+}}\left(\frac{1}{x}-\frac{1}{\sin x}\right)=\lim _{x \rightarrow 0^{+}} \frac{\sin x-x}{x \sin x}
L09722: $$
L09724: which is an indeterminate form of type $0 / 0$. Applying L'Hôpital's rule twice yields
L09726: $$
L09727: \begin{aligned}
L09728: \lim _{x \rightarrow 0^{+}} \frac{\sin x-x}{x \sin x} & =\lim _{x \rightarrow 0^{+}} \frac{\cos x-1}{\sin x+x \cos x} \\
L09729: & =\lim _{x \rightarrow 0^{+}} \frac{-\sin x}{\cos x+\cos x-x \sin x}=\frac{0}{2}=0
L09730: \end{aligned}
L09731: $$
L09733: ## INDETERMINATE FORMS OF TYPE $0^{0}, \infty^{0}, 1^{\infty}$
L09735: Limits of the form
L09737: $$
L09738: \lim f(x)^{g(x)}
L09739: $$
L09741: can give rise to indeterminate forms of the types $\mathbf{0}^{\boldsymbol{0}}, \boldsymbol{\infty}^{\boldsymbol{0}}$, and $\mathbf{1}^{\boldsymbol{\infty}}$. (The interpretations of these symbols should be clear.) For example, the limit
L09743: $$
L09744: \lim _{x \rightarrow 0^{+}}(1+x)^{1 / x}
L09745: $$
L09747: whose value we know to be $e$ [see Formula (1) of Section 3.2] is an indeterminate form of type $1^{\infty}$. It is indeterminate because the expressions $1+x$ and $1 / x$ exert two conflicting influences: the first approaches 1 , which drives the expression toward 1 , and the second approaches $+\infty$, which drives the expression toward $+\infty$.
L09749: Indeterminate forms of types $0^{0}, \infty{ }^{0}$, and $1^{\infty}$ can sometimes be evaluated by first introducing a dependent variable
L09751: $$
L09752: y=f(x)^{g(x)}
L09753: $$
L09755: and then computing the limit of $\ln y$. Since
L09757: $$
L09758: \ln y=\ln \left[f(x)^{g(x)}\right]=g(x) \cdot \ln [f(x)]
L09759: $$
L09761: the limit of $\ln y$ will be an indeterminate form of type $0 \cdot \infty$ (verify), which can be evaluated by methods we have already studied. Once the limit of $\ln y$ is known, it is a straightforward matter to determine the limit of $y=f(x)^{g(x)}$, as we will illustrate in the next example.
L09763: Example 6 Find $\lim _{x \rightarrow 0}(1+\sin x)^{1 / x}$.
L09764: Solution. As discussed above, we begin by introducing a dependent variable
L09766: $$
L09767: y=(1+\sin x)^{1 / x}
L09768: $$
L09770: and taking the natural logarithm of both sides:
L09772: $$
L09773: \ln y=\ln (1+\sin x)^{1 / x}=\frac{1}{x} \ln (1+\sin x)=\frac{\ln (1+\sin x)}{x}
L09774: $$
L09776: Thus,
L09778: $$
L09779: \lim _{x \rightarrow 0} \ln y=\lim _{x \rightarrow 0} \frac{\ln (1+\sin x)}{x}
L09780: $$
L09782: which is an indeterminate form of type $0 / 0$, so by L'Hôpital's rule
L09784: $$
L09785: \lim _{x \rightarrow 0} \ln y=\lim _{x \rightarrow 0} \frac{\ln (1+\sin x)}{x}=\lim _{x \rightarrow 0} \frac{(\cos x) /(1+\sin x)}{1}=1
L09786: $$
L09788: Since we have shown that $\ln y \rightarrow 1$ as $x \rightarrow 0$, the continuity of the exponential function implies that $e^{\ln y} \rightarrow e^{1}$ as $x \rightarrow 0$, and this implies that $y \rightarrow e$ as $x \rightarrow 0$. Thus,
L09790: $$
L09791: \lim _{x \rightarrow 0}(1+\sin x)^{1 / x}=e
L09792: $$
