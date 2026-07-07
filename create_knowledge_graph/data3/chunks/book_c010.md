L03272: ## QUICK CHECK ANSWERS 1.5
L03274: 1. $f(c)$ is defined; $\lim _{x \rightarrow c} f(x)$ exists; $\lim _{x \rightarrow c} f(x)=f(c)$
L03275: 2. (a) yes (b) no (c) yes (d) yes
L03276: 3. (a) 3 (b) 3
L03277: 4. $-2 / 5$
L03278: 5. $x=1,4$
L03280: ### 1.6 CONTINUITY OF TRIGONOMETRIC, EXPONENTIAL, AND INVERSE FUNCTIONS
L03282: [FIGURE:ff68a8b170df5f3e | A diagram on a Cartesian coordinate system shows a unit circle centered at the origin. Two points, $P(\cos x, \sin x)$ and $Q(\cos c, \sin c)$, are marked on the circle in the first quadrant. Angle...]
L03283: As $x$ approaches $c$ the point $P$ approaches the point $Q$.
L03285: - Figure 1.6.1
L03287: Theorem 1.6.1 implies that the six basic trigonometric functions are continuous on their domains. In particular, $\sin x$ and $\cos x$ are continuous everywhere.
L03289: In this section we will discuss the continuity properties of trigonometric functions, exponential functions, and inverses of various continuous functions. We will also discuss some important limits involving such functions.
L03291: ## CONTINUITY OF TRIGONOMETRIC FUNCTIONS
L03293: Recall from trigonometry that the graphs of $\sin x$ and $\cos x$ are drawn as continuous curves. We will not formally prove that these functions are continuous, but we can motivate this fact by letting $c$ be a fixed angle in radian measure and $x$ a variable angle in radian measure. If, as illustrated in Figure 1.6.1, the angle $x$ approaches the angle $c$, then the point $P(\cos x, \sin x)$ moves along the unit circle toward $Q(\cos c, \sin c)$, and the coordinates of $P$ approach the corresponding coordinates of $Q$. This implies that
L03295: $$
L03296: \begin{equation*}
L03297: \lim _{x \rightarrow c} \sin x=\sin c \quad \text { and } \quad \lim _{x \rightarrow c} \cos x=\cos c \tag{1}
L03298: \end{equation*}
L03299: $$
L03301: Thus, $\sin x$ and $\cos x$ are continuous at the arbitrary point $c$; that is, these functions are continuous everywhere.
L03303: The formulas in (1) can be used to find limits of the remaining trigonometric functions by expressing them in terms of $\sin x$ and $\cos x$; for example, if $\cos c \neq 0$, then
L03305: $$
L03306: \lim _{x \rightarrow c} \tan x=\lim _{x \rightarrow c} \frac{\sin x}{\cos x}=\frac{\sin c}{\cos c}=\tan c
L03307: $$
L03309: Thus, we are led to the following theorem.
L03310: 1.6.1 THEOREM If $c$ is any number in the natural domain of the stated trigonometric function, then
L03312: $$
L03313: \begin{array}{lll}
L03314: \lim _{x \rightarrow c} \sin x=\sin c & \lim _{x \rightarrow c} \cos x=\cos c & \lim _{x \rightarrow c} \tan x=\tan c \\
L03315: \lim _{x \rightarrow c} \csc x=\csc c & \lim _{x \rightarrow c} \sec x=\sec c & \lim _{x \rightarrow c} \cot x=\cot c
L03316: \end{array}
L03317: $$
L03319: Example 1 Find the limit
L03321: $$
L03322: \lim _{x \rightarrow 1} \cos \left(\frac{x^{2}-1}{x-1}\right)
L03323: $$
L03325: Solution. Since the cosine function is continuous everywhere, it follows from Theorem 1.5.5 that
L03327: $$
L03328: \lim _{x \rightarrow 1} \cos (g(x))=\cos \left(\lim _{x \rightarrow 1} g(x)\right)
L03329: $$
L03331: provided $\lim _{x \rightarrow 1} g(x)$ exists. Thus,
L03333: $$
L03334: \lim _{x \rightarrow 1} \cos \left(\frac{x^{2}-1}{x-1}\right)=\lim _{x \rightarrow 1} \cos (x+1)=\cos \left(\lim _{x \rightarrow 1}(x+1)\right)=\cos 2
L03335: $$
L03337: ## - CONTINUITY OF INVERSE FUNCTIONS
L03339: Since the graphs of a one-to-one function $f$ and its inverse $f^{-1}$ are reflections of one another about the line $y=x$, it is clear geometrically that if the graph of $f$ has no breaks or holes in it, then neither does the graph of $f^{-1}$. This, and the fact that the range of $f$ is the domain of $f^{-1}$, suggests the following result, which we state without formal proof.
L03341: To paraphrase Theorem 1.6.2, the inverse of a continuous function is continuous.
L03343: [FIGURE:b1bee89818cffd7e | A graph in the $xy$-plane shows three curves: $y = g(x)$ (green), $y = f(x)$ (blue), and $y = h(x)$ (purple). The curve $y = f(x)$ is positioned between $y = g(x)$ and $y = h(x)$, with the region...]
L03344: - Figure 1.6.2
L03346: 1.6.2 THEOREM If $f$ is a one-to-one function that is continuous at each point of its domain, then $f^{-1}$ is continuous at each point of its domain; that is, $f^{-1}$ is continuous at each point in the range of $f$.
L03348: - Example 2 Use Theorem 1.6.2 to prove that $\sin ^{-1} x$ is continuous on the interval $[-1,1]$.
L03350: Solution. Recall that $\sin ^{-1} x$ is the inverse of the restricted sine function whose domain is the interval $[-\pi / 2, \pi / 2]$ and whose range is the interval $[-1,1]$ (Definition 0.4.6 and Figure 0.4.13). Since $\sin x$ is continuous on the interval $[-\pi / 2, \pi / 2]$, Theorem 1.6.2 implies $\sin ^{-1} x$ is continuous on the interval $[-1,1]$.
L03352: Arguments similar to the solution of Example 2 show that each of the inverse trigonometric functions defined in Section 0.4 is continuous at each point of its domain.
L03354: When we introduced the exponential function $f(x)=b^{x}$ in Section 0.5, we assumed that its graph is a curve without breaks, gaps, or holes; that is, we assumed that the graph of $y=b^{x}$ is a continuous curve. This assumption and Theorem 1.6.2 imply the following theorem, which we state without formal proof.
L03356: ### 1.6.3 THEOREM Let $b>0, b \neq 1$.
L03358: (a) The function $b^{x}$ is continuous on $(-\infty,+\infty)$.
L03359: (b) The function $\log _{b} x$ is continuous on ( $0,+\infty$ ).
L03361: - Example 3 Where is the function $f(x)=\frac{\tan ^{-1} x+\ln x}{x^{2}-4}$ continuous?
L03363: Solution. The fraction will be continuous at all points where the numerator and denominator are both continuous and the denominator is nonzero. Since $\tan ^{-1} x$ is continuous everywhere and $\ln x$ is continuous if $x>0$, the numerator is continuous if $x>0$. The denominator, being a polynomial, is continuous everywhere, so the fraction will be continuous at all points where $x>0$ and the denominator is nonzero. Thus, $f$ is continuous on the intervals $(0,2)$ and $(2,+\infty)$.
L03365: ## OBTAINING LIMITS BY SQUEEZING
L03367: In Section 1.1 we used numerical evidence to conjecture that
L03369: $$
L03370: \begin{equation*}
L03371: \lim _{x \rightarrow 0} \frac{\sin x}{x}=1 \tag{2}
L03372: \end{equation*}
L03373: $$
L03375: However, this limit is not easy to establish with certainty. The limit is an indeterminate form of type $0 / 0$, and there is no simple algebraic manipulation that one can perform to obtain the limit. Later in the text we will develop general methods for finding limits of indeterminate forms, but in this particular case we can use a technique called squeezing.
L03377: The method of squeezing is used to prove that $f(x) \rightarrow L$ as $x \rightarrow c$ by "trapping" or "squeezing" $f$ between two functions, $g$ and $h$, whose limits as $x \rightarrow c$ are known with certainty to be $L$. As illustrated in Figure 1.6.2, this forces $f$ to have a limit of $L$ as well. This is the idea behind the following theorem, which we state without proof.
L03379: The Squeezing Theorem also holds for one-sided limits and limits at $+\infty$ and $-\infty$. How do you think the hypotheses would change in those cases?
L03381: [FIGURE:eed55478cbe14651 | Two graphs illustrate important limits. The top graph plots the function $y = \frac{\sin x}{x}$ on an x-y coordinate system from $x = -2\pi$ to $x = 2\pi$, showing that as $x$ approaches 0, the...]
L03382: Figure 1.6.3
L03384: Figure 1.6.4
L03386: ### 1.6.4 THEOREM (The Squeezing Theorem) Let $f, g$, and $h$ be functions satisfying
L03388: $$
L03389: g(x) \leq f(x) \leq h(x)
L03390: $$
L03392: for all $x$ in some open interval containing the number $c$, with the possible exception that the inequalities need not hold at $c$. If $g$ and $h$ have the same limit as $x$ approaches $c$, say
L03394: $$
L03395: \lim _{x \rightarrow c} g(x)=\lim _{x \rightarrow c} h(x)=L
L03396: $$
L03398: then $f$ also has this limit as $x$ approaches $c$, that is,
L03400: $$
L03401: \lim _{x \rightarrow c} f(x)=L
L03402: $$
L03404: To illustrate how the Squeezing Theorem works, we will prove the following results, which are illustrated in Figure 1.6.3.
L03406: ### 1.6.5 THEOREM
L03408: (a) $\lim _{x \rightarrow 0} \frac{\sin x}{x}=1$
L03409: (b) $\lim _{x \rightarrow 0} \frac{1-\cos x}{x}=0$
L03411: PROOF (a) In this proof we will interpret $x$ as an angle in radian measure, and we will assume to start that $0<x<\pi / 2$. As illustrated in Figure 1.6.4, the area of a sector with central angle $x$ and radius 1 lies between the areas of two triangles, one with area $\frac{1}{2} \tan x$ and the other with area $\frac{1}{2} \sin x$. Since the sector has area $\frac{1}{2} x$ (see marginal note), it follows that
L03413: $$
L03414: \frac{1}{2} \tan x \geq \frac{1}{2} x \geq \frac{1}{2} \sin x
L03415: $$
L03417: Multiplying through by $2 /(\sin x)$ and using the fact that $\sin x>0$ for $0<x<\pi / 2$, we obtain
L03419: $$
L03420: \frac{1}{\cos x} \geq \frac{x}{\sin x} \geq 1
L03421: $$
L03423: Next, taking reciprocals reverses the inequalities, so we obtain
L03425: $$
L03426: \begin{equation*}
L03427: \cos x \leq \frac{\sin x}{x} \leq 1 \tag{3}
L03428: \end{equation*}
L03429: $$
L03431: which squeezes the function $(\sin x) / x$ between the functions $\cos x$ and 1 . Although we derived these inequalities by assuming that $0<x<\pi / 2$, they also hold for $-\pi / 2<x<0$ [since replacing $x$ by $-x$ and using the identities $\sin (-x)=-\sin x$, and $\cos (-x)=\cos x$
L03432: [FIGURE:9a41814575a8e0aa | The figure provides a geometric proof for the inequality $\frac{1}{2} \tan x \geq \frac{1}{2} x \geq \frac{1}{2} \sin x$ for $0 < x < \frac{\pi}{2}$. A unit circle in the first quadrant shows an...]
L03434: Recall that the area $A$ of a sector of radius $r$ and central angle $\theta$ is
L03436: $$
L03437: A=\frac{1}{2} r^{2} \theta
L03438: $$
L03440: This can be derived from the relationship
L03442: $$
L03443: \frac{A}{\pi r^{2}}=\frac{\theta}{2 \pi}
L03444: $$
L03446: which states that the area of the sector is to the area of the circle as the central angle of the sector is to the central angle of the circle.
L03447: [FIGURE:04e69d8174d99d9f | A circle is shown with a sector highlighted in light blue. The sector is defined by two radii and the arc between them. The central angle of the sector is labeled $\theta$, and the radius is labeled...]
L03449: ## TECHNOLOGY MASTERY
L03451: Use a graphing utility to confirm the limits in Example 4, and if you have a CAS, use it to obtain the limits.
L03453: [FIGURE:7ffa67a5739be0e3 | A graph displays the function $y = \sin(\frac{1}{x})$ on an $xy$-plane. The curve oscillates between $y=-1$ and $y=1$, with the oscillations becoming infinitely dense as $x$ approaches $0$, a region...]
L03454: - Figure 1.6.5
L03456: leaves (3) unchanged]. Finally, since
L03458: $$
L03459: \lim _{x \rightarrow 0} \cos x=1 \quad \text { and } \quad \lim _{x \rightarrow 0} 1=1
L03460: $$
L03462: the Squeezing Theorem implies that
L03464: $$
L03465: \lim _{x \rightarrow 0} \frac{\sin x}{x}=1
L03466: $$
L03468: proof (b) For this proof we will use the limit in part (a), the continuity of the sine function, and the trigonometric identity $\sin ^{2} x=1-\cos ^{2} x$. We obtain
L03470: $$
L03471: \begin{aligned}
L03472: \lim _{x \rightarrow 0} \frac{1-\cos x}{x} & =\lim _{x \rightarrow 0}\left[\frac{1-\cos x}{x} \cdot \frac{1+\cos x}{1+\cos x}\right]=\lim _{x \rightarrow 0} \frac{\sin ^{2} x}{(1+\cos x) x} \\
L03473: & =\left(\lim _{x \rightarrow 0} \frac{\sin x}{x}\right)\left(\lim _{x \rightarrow 0} \frac{\sin x}{1+\cos x}\right)=(1)\left(\frac{0}{1+1}\right)=0
L03474: \end{aligned}
L03475: $$
L03477: Example 4 Find
L03478: (a) $\lim _{x \rightarrow 0} \frac{\tan x}{x}$
L03479: (b) $\lim _{\theta \rightarrow 0} \frac{\sin 2 \theta}{\theta}$
L03480: (c) $\lim _{x \rightarrow 0} \frac{\sin 3 x}{\sin 5 x}$
L03482: Solution (a).
L03484: $$
L03485: \lim _{x \rightarrow 0} \frac{\tan x}{x}=\lim _{x \rightarrow 0}\left(\frac{\sin x}{x} \cdot \frac{1}{\cos x}\right)=\left(\lim _{x \rightarrow 0} \frac{\sin x}{x}\right)\left(\lim _{x \rightarrow 0} \frac{1}{\cos x}\right)=(1)(1)=1
L03486: $$
L03488: Solution (b). The trick is to multiply and divide by 2 , which will make the denominator the same as the argument of the sine function [just as in Theorem 1.6.5(a)]:
L03490: $$
L03491: \lim _{\theta \rightarrow 0} \frac{\sin 2 \theta}{\theta}=\lim _{\theta \rightarrow 0} 2 \cdot \frac{\sin 2 \theta}{2 \theta}=2 \lim _{\theta \rightarrow 0} \frac{\sin 2 \theta}{2 \theta}
L03492: $$
L03494: Now make the substitution $x=2 \theta$, and use the fact that $x \rightarrow 0$ as $\theta \rightarrow 0$. This yields
L03496: $$
L03497: \lim _{\theta \rightarrow 0} \frac{\sin 2 \theta}{\theta}=2 \lim _{\theta \rightarrow 0} \frac{\sin 2 \theta}{2 \theta}=2 \lim _{x \rightarrow 0} \frac{\sin x}{x}=2(1)=2
L03498: $$
L03500: Solution (c).
L03502: $$
L03503: \lim _{x \rightarrow 0} \frac{\sin 3 x}{\sin 5 x}=\lim _{x \rightarrow 0} \frac{\frac{\sin 3 x}{x}}{\frac{\sin 5 x}{x}}=\lim _{x \rightarrow 0} \frac{3 \cdot \frac{\sin 3 x}{3 x}}{5 \cdot \frac{\sin 5 x}{5 x}}=\frac{3 \cdot 1}{5 \cdot 1}=\frac{3}{5}
L03504: $$
L03506: Example 5 Discuss the limits
L03507: (a) $\lim _{x \rightarrow 0} \sin \left(\frac{1}{x}\right)$
L03508: (b) $\lim _{x \rightarrow 0} x \sin \left(\frac{1}{x}\right)$
L03510: Solution (a). Let us view $1 / x$ as an angle in radian measure. As $x \rightarrow 0^{+}$, the angle $1 / x$ approaches $+\infty$, so the values of $\sin (1 / x)$ keep oscillating between -1 and 1 without approaching a limit. Similarly, as $x \rightarrow 0^{-}$, the angle $1 / x$ approaches $-\infty$, so again the values of $\sin (1 / x)$ keep oscillating between -1 and 1 without approaching a limit. These conclusions are consistent with the graph shown in Figure 1.6.5. Note that the oscillations become more and more rapid as $x \rightarrow 0$ because $1 / x$ increases (or decreases) more and more rapidly as $x$ approaches 0 .
L03512: Confirm (4) by considering the cases $x>0$ and $x<0$ separately.
L03514: [FIGURE:1e558a457211b8d7 | A graph on an x-y coordinate system displays three functions. The function $y = x \sin \left(\frac{1}{x}\right)$ is an oscillating curve that approaches the origin from both positive and negative...]
L03515: Figure 1.6.6
L03517: Solution (b). Since
L03519: $$
L03520: -1 \leq \sin \left(\frac{1}{x}\right) \leq 1
L03521: $$
L03523: it follows that if $x \neq 0$, then
L03525: $$
L03526: \begin{equation*}
L03527: -|x| \leq x \sin \left(\frac{1}{x}\right) \leq|x| \tag{4}
L03528: \end{equation*}
L03529: $$
L03531: Since $|x| \rightarrow 0$ as $x \rightarrow 0$, the inequalities in (4) and the Squeezing Theorem imply that
L03533: $$
L03534: \lim _{x \rightarrow 0} x \sin \left(\frac{1}{x}\right)=0
L03535: $$
L03537: This is consistent with the graph shown in Figure 1.6.6. $\square$
L03539: It follows from part (b) of this example that the function
L03541: $$
L03542: f(x)= \begin{cases}x \sin (1 / x), & x \neq 0 \\ 0, & x=0\end{cases}
L03543: $$
L03545: is continuous at $x=0$, since the value of the function and the value of the limit are the same at 0 . This shows that the behavior of a function can be very complex in the vicinity of $x=c$, even though the function is continuous at $c$.
L03547: ## QUICK CHECK EXERCISES 1.6 (See page 128 for answers.)
L03549: 1. In each part, is the given function continuous on the interval $[0, \pi / 2)$ ?
L03550: (a) $\sin x$
L03551: (b) $\cos x$
L03552: (c) $\tan x$
L03553: (d) $\csc x$
L03554: 2. Evaluate
L03555: (a) $\lim _{x \rightarrow 0} \frac{\sin x}{x}$
L03556: (b) $\lim _{x \rightarrow 0} \frac{1-\cos x}{x}$.
L03557: 3. Suppose a function $f$ has the property that for all real numbers $x$
L03559: $$
L03560: 3-|x| \leq f(x) \leq 3+|x|
L03561: $$
L03563: From this we can conclude that $f(x) \rightarrow$ $\_\_\_\_$ as $x \rightarrow$
L03564: $\_\_\_\_$ .
L03565: 4. In each part, give the largest interval on which the function is continuous.
L03566: (a) $e^{x}$
L03567: (b) $\ln x$
L03568: (c) $\sin ^{-1} x$
L03569: (d) $\tan ^{-1} x$
L03571: ## EXERCISE SET 1.6 Graphing Utility
L03573: 1-8 Find the discontinuities, if any. $\square$
L03575: 1. $f(x)=\sin \left(x^{2}-2\right)$
L03576: 2. $f(x)=\cos \left(\frac{x}{x-\pi}\right)$
L03577: 3. $f(x)=|\cot x|$
L03578: 4. $f(x)=\sec x$
L03579: 5. $f(x)=\csc x$
L03580: 6. $f(x)=\frac{1}{1+\sin ^{2} x}$
L03581: 7. $f(x)=\frac{1}{1-2 \sin x}$
L03582: 8. $f(x)=\sqrt{2+\tan ^{2} x}$
L03584: 9-14 Determine where $f$ is continuous. $\square$
L03585: 9. $f(x)=\sin ^{-1} 2 x$
L03586: 10. $f(x)=\cos ^{-1}(\ln x)$
L03587: 11. $f(x)=\frac{\ln \left(\tan ^{-1} x\right)}{x^{2}-9}$
L03588: 12. $f(x)=\exp \left(\frac{\sin x}{x}\right)$
L03589: 13. $f(x)=\frac{\sin ^{-1}(1 / x)}{x}$
L03590: 14. $f(x)=\ln |x|-2 \ln (x+3)$
L03592: 15-16 In each part, use Theorem 1.5.6(b) to show that the function is continuous everywhere.
L03593: 15.
L03594: (a) $\sin \left(x^{3}+7 x+1\right)$
L03595: (b) $|\sin x|$
L03596: (c) $\cos ^{3}(x+1)$
L03597: 16.
L03598: (a) $|3+\sin 2 x|$
L03599: (b) $\sin (\sin x)$
L03600: (c) $\cos ^{5} x-2 \cos ^{3} x+1$
L03602: 17-42 Find the limits.
L03603: 17. $\lim _{x \rightarrow+\infty} \cos \left(\frac{1}{x}\right)$
L03604: 18. $\lim _{x \rightarrow+\infty} \sin \left(\frac{\pi x}{2-3 x}\right)$
L03605: 19. $\lim _{x \rightarrow+\infty} \sin ^{-1}\left(\frac{x}{1-2 x}\right)$
L03606: 20. $\lim _{x \rightarrow+\infty} \ln \left(\frac{x+1}{x}\right)$
L03607: 21. $\lim _{x \rightarrow 0} e^{\sin x}$
L03608: 22. $\lim _{x \rightarrow+\infty} \cos \left(2 \tan ^{-1} x\right)$
L03609: 23. $\lim _{\theta \rightarrow 0} \frac{\sin 3 \theta}{\theta}$
L03610: 24. $\lim _{h \rightarrow 0} \frac{\sin h}{2 h}$
L03611: 25. $\lim _{\theta \rightarrow 0^{+}} \frac{\sin \theta}{\theta^{2}}$
L03612: 26. $\lim _{\theta \rightarrow 0} \frac{\sin ^{2} \theta}{\theta}$
L03613: 27. $\lim _{x \rightarrow 0} \frac{\tan 7 x}{\sin 3 x}$
L03614: 28. $\lim _{x \rightarrow 0} \frac{\sin 6 x}{\sin 8 x}$
L03615: 29. $\lim _{x \rightarrow 0^{+}} \frac{\sin x}{5 \sqrt{x}}$
L03616: 30. $\lim _{x \rightarrow 0} \frac{\sin ^{2} x}{3 x^{2}}$
L03617: 31. $\lim _{x \rightarrow 0} \frac{\sin x^{2}}{x}$
L03618: 32. $\lim _{h \rightarrow 0} \frac{\sin h}{1-\cos h}$
L03619: 33. $\lim _{t \rightarrow 0} \frac{t^{2}}{1-\cos ^{2} t}$
L03620: 34. $\lim _{x \rightarrow 0} \frac{x}{\cos \left(\frac{1}{2} \pi-x\right)}$
L03621: 35. $\lim _{\theta \rightarrow 0} \frac{\theta^{2}}{1-\cos \theta}$
L03622: 36. $\lim _{h \rightarrow 0} \frac{1-\cos 3 h}{\cos ^{2} 5 h-1}$
L03623: 37. $\lim _{x \rightarrow 0^{+}} \sin \left(\frac{1}{x}\right)$
L03624: 38. $\lim _{x \rightarrow 0} \frac{x^{2}-3 \sin x}{x}$
L03625: 39. $\lim _{x \rightarrow 0} \frac{2-\cos 3 x-\cos 4 x}{x}$
L03626: 40. $\lim _{x \rightarrow 0} \frac{\tan 3 x^{2}+\sin ^{2} 5 x}{x^{2}}$
L03628: 41-42 (a) Complete the table and make a guess about the limit indicated. (b) Find the exact value of the limit.
L03629: 41. $f(x)=\frac{\sin (x-5)}{x^{2}-25} ; \lim _{x \rightarrow 5} f(x)$
L03631: | $x$ | 4 | 4.5 | 4.9 | 5.1 | 5.5 | 6 |
L03632: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
L03633: | $f(x)$ |  |  |  |  |  |  |
L03635: Table Ex-41
L03636: 42. $f(x)=\frac{\sin \left(x^{2}+3 x+2\right)}{x+2} ; \lim _{x \rightarrow-2} f(x)$
L03638: | $x$ | -2.1 | -2.01 | -2.001 | -1.999 | -1.99 | -1.9 |
L03639: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
L03640: | $f(x)$ |  |  |  |  |  |  |
L03642: - Table Ex-42
L03644: 43-46 True-False Determine whether the statement is true or false. Explain your answer. $\square$
L03645: 43. Suppose that for all real numbers $x$, a function $f$ satisfies
L03647: $$
L03648: |f(x)+5| \leq|x+1|
L03649: $$
L03651: Then $\lim _{x \rightarrow-1} f(x)=-5$.
L03652: 44. For $0<x<\pi / 2$, the graph of $y=\sin x$ lies below the graph of $y=x$ and above the graph of $y=x \cos x$.
L03653: 45. If an invertible function $f$ is continuous everywhere, then its inverse $f^{-1}$ is also continuous everywhere.
L03654: 46. Suppose that $M$ is a positive number and that for all real numbers $x$, a function $f$ satisfies
L03656: $$
L03657: -M \leq f(x) \leq M
L03658: $$
L03660: Then
L03662: $$
L03663: \lim _{x \rightarrow 0} x f(x)=0 \quad \text { and } \quad \lim _{x \rightarrow+\infty} \frac{f(x)}{x}=0
L03664: $$
L03666: ## FOCUS ON CONCEPTS
L03668: 47. In an attempt to verify that $\lim _{x \rightarrow 0}(\sin x) / x=1$, a student constructs the accompanying table.
L03669: (a) What mistake did the student make?
L03670: (b) What is the exact value of the limit illustrated by this table?
L03672: | $x$ | -0.01 | -0.001 | 0.001 | 0.01 |
L03673: | :---: | :---: | :---: | :---: | :---: |
L03674: | $\sin x / x$ | 0.017453 | 0.017453 | 0.017453 | 0.017453 |
L03676: ## - Table Ex-47
L03678: 48. Consider $\lim _{x \rightarrow 0}(1-\cos x) / x$, where $x$ is in degrees. Why is it possible to evaluate this limit with little or no computation?
L03679: 49. In the circle in the accompanying figure, a central angle of measure $\theta$ radians subtends a chord of length $c(\theta)$ and a circular arc of length $s(\theta)$. Based on your intuition, what would you conjecture is the value of $\lim _{\theta \rightarrow 0^{+}} c(\theta) / s(\theta)$ ? Verify your conjecture by computing the limit.
L03681: [FIGURE:097c88a568cc8d4b | A red circle is shown with its center marked. A central angle, labeled $\theta$, is drawn from the center, with its vertex at the center and its sides as two radii. A blue line segment, labeled...]
L03682: -Figure Ex-49
L03684: 50. What is wrong with the following "proof" that $\lim _{x \rightarrow 0}[(\sin 2 x) / x]=1$ ? Since
L03686: $$
L03687: \lim _{x \rightarrow 0}(\sin 2 x-x)=\lim _{x \rightarrow 0} \sin 2 x-\lim _{x \rightarrow 0} x=0-0=0
L03688: $$
L03690: if $x$ is close to 0 , then $\sin 2 x-x \approx 0$ or, equivalently, $\sin 2 x \approx x$. Dividing both sides of this approximate equality by $x$ yields $(\sin 2 x) / x \approx 1$. That is, $\lim _{x \rightarrow 0}[(\sin 2 x) / x]=1$.
L03691: 51. Find a nonzero value for the constant $k$ that makes
L03693: $$
L03694: f(x)= \begin{cases}\frac{\tan k x}{x}, & x<0 \\ 3 x+2 k^{2}, & x \geq 0\end{cases}
L03695: $$
L03697: continuous at $x=0$.
L03698: 52. Is
L03700: $$
L03701: f(x)= \begin{cases}\frac{\sin x}{|x|}, & x \neq 0 \\ 1, & x=0\end{cases}
L03702: $$
L03704: continuous at $x=0$ ? Explain.
L03705: 53. In parts (a)-(c), find the limit by making the indicated substitution.
L03706: (a) $\lim _{x \rightarrow+\infty} x \sin \frac{1}{x} ; \quad t=\frac{1}{x}$
L03707: (b) $\lim _{x \rightarrow-\infty} x\left(1-\cos \frac{1}{x}\right) ; \quad t=\frac{1}{x}$
L03708: (c) $\lim _{x \rightarrow \pi} \frac{\pi-x}{\sin x} ; \quad t=\pi-x$
L03709: 54. Find $\lim _{x \rightarrow 2} \frac{\cos (\pi / x)}{x-2}$. [Hint: Let $t=\frac{\pi}{2}-\frac{\pi}{x}$.]
L03710: 55. Find $\lim _{x \rightarrow 1} \frac{\sin (\pi x)}{x-1}$.
L03711: 56. Find $\lim _{x \rightarrow \pi / 4} \frac{\tan x-1}{x-\pi / 4}$.
L03712: 57. Find $\lim _{x \rightarrow \pi / 4} \frac{\cos x-\sin x}{x-\pi / 4}$.
L03713: 58. Suppose that $f$ is an invertible function, $f(0)=0, f$ is continuous at 0 , and $\lim _{x \rightarrow 0}(f(x) / x)$ exists. Given that $L=\lim _{x \rightarrow 0}(f(x) / x)$, show
L03715: $$
L03716: \lim _{x \rightarrow 0} \frac{x}{f^{-1}(x)}=L
L03717: $$
L03719: [Hint: Apply Theorem 1.5.5 to the composition $h \circ g$, where
L03721: $$
L03722: h(x)= \begin{cases}f(x) / x, & x \neq 0 \\ L, & x=0\end{cases}
L03723: $$
L03725: and $g(x)=f^{-1}(x)$.]
L03726: 59-62 Apply the result of Exercise 58, if needed, to find the limits.
L03727: 59. $\lim _{x \rightarrow 0} \frac{x}{\sin ^{-1} x}$
L03728: 60. $\lim _{x \rightarrow 0} \frac{\tan ^{-1} x}{x}$
L03729: 61. $\lim _{x \rightarrow 0} \frac{\sin ^{-1} 5 x}{x}$
L03730: 62. $\lim _{x \rightarrow 1} \frac{\sin ^{-1}(x-1)}{x^{2}-1}$
L03732: ## FOCUS ON CONCEPTS
L03734: 63. In Example 5 we used the Squeezing Theorem to prove that
L03736: $$
L03737: \lim _{x \rightarrow 0} x \sin \left(\frac{1}{x}\right)=0
L03738: $$
L03740: Why couldn't we have obtained the same result by writing
L03742: $$
L03743: \begin{aligned}
L03744: \lim _{x \rightarrow 0} x \sin \left(\frac{1}{x}\right) & =\lim _{x \rightarrow 0} x \cdot \lim _{x \rightarrow 0} \sin \left(\frac{1}{x}\right) \\
L03745: & =0 \cdot \lim _{x \rightarrow 0} \sin \left(\frac{1}{x}\right)=0 ?
L03746: \end{aligned}
L03747: $$
L03749: 64. Sketch the graphs of the curves $y=1-x^{2}, y=\cos x$, and $y=f(x)$, where $f$ is a function that satisfies the inequalities
L03751: $$
L03752: 1-x^{2} \leq f(x) \leq \cos x
L03753: $$
L03755: for all $x$ in the interval $(-\pi / 2, \pi / 2)$. What can you say about the limit of $f(x)$ as $x \rightarrow 0$ ? Explain.
L03756: 65. Sketch the graphs of the curves $y=1 / x, y=-1 / x$, and $y=f(x)$, where $f$ is a function that satisfies the inequalities
L03758: $$
L03759: -\frac{1}{x} \leq f(x) \leq \frac{1}{x}
L03760: $$
L03762: for all $x$ in the interval $[1,+\infty)$. What can you say about the limit of $f(x)$ as $x \rightarrow+\infty$ ? Explain your reasoning.
L03763: 66. Draw pictures analogous to Figure 1.6.2 that illustrate the Squeezing Theorem for limits of the forms $\lim _{x \rightarrow+\infty} f(x)$ and $\lim _{x \rightarrow-\infty} f(x)$.
L03764: 67. (a) Use the Intermediate-Value Theorem to show that the equation $x=\cos x$ has at least one solution in the interval $[0, \pi / 2]$.
L03765: (b) Show graphically that there is exactly one solution in the interval.
L03766: (c) Approximate the solution to three decimal places.
L03767: 68. (a) Use the Intermediate-Value Theorem to show that the equation $x+\sin x=1$ has at least one solution in the interval $[0, \pi / 6]$.
L03768: (b) Show graphically that there is exactly one solution in the interval.
L03769: (c) Approximate the solution to three decimal places.
L03770: 69. In the study of falling objects near the surface of the Earth, the acceleration $\boldsymbol{g}$ due to gravity is commonly taken to be a constant $9.8 \mathrm{~m} / \mathrm{s}^{2}$. However, the elliptical shape of the Earth and other factors cause variations in this value that depend on latitude. The following formula, known as the World Geodetic System 1984 (WGS 84) Ellipsoidal Gravity Formula, is used to predict the value of $g$ at a latitude of $\phi$ degrees (either north or south of the equator):
L03772: $$
L03773: g=9.7803253359 \frac{1+0.0019318526461 \sin ^{2} \phi}{\sqrt{1-0.0066943799901 \sin ^{2} \phi}} \mathrm{~m} / \mathrm{s}^{2}
L03774: $$
L03776: (a) Use a graphing utility to graph the curve $y=g(\phi)$ for $0^{\circ} \leq \phi \leq 90^{\circ}$. What do the values of $g$ at $\phi=0^{\circ}$ and at $\phi=90^{\circ}$ tell you about the WGS 84 ellipsoid model for the Earth?
L03777: (b) Show that $g=9.8 \mathrm{~m} / \mathrm{s}^{2}$ somewhere between latitudes of $38^{\circ}$ and $39^{\circ}$.
L03778: 70. Writing In your own words, explain the practical value of the Squeezing Theorem.
L03779: 71. Writing A careful examination of the proof of Theorem 1.6.5 raises the issue of whether the proof might actually be a circular argument! Read the article "A Circular Argument" by Fred Richman in the March 1993 issue of The College Mathematics Journal, and write a short report on the author's principal points.
