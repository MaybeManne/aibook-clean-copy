L05214: ## QUICK CHECK ANSWERS 2.2
L05216: 1. $\frac{f(x+h)-f(x)}{h}$
L05217: 2. (a) $2 x$
L05218: (b) $\frac{1}{2 \sqrt{x}}$
L05219: 3. $1 ;-\frac{2}{3}$
L05220: 4. Theorem 2.2.3: If $f$ is differentiable at $x_{0}$, then $f$ is continuous at $x_{0}$.
L05222: ### 2.3 INTRODUCTION TO TECHNIQUES OF DIFFERENTIATION
L05224: In the last section we defined the derivative of a function $f$ as a limit, and we used that limit to calculate a few simple derivatives. In this section we will develop some important theorems that will enable us to calculate derivatives more efficiently.
L05226: [FIGURE:c05691248c07265a | A Cartesian coordinate system displays the graph of the constant function $y=c$ as a horizontal line. A specific point $(x,c)$ is marked on this line, with a dashed vertical line indicating its...]
L05227: - Figure 2.3.1
L05229: The tangent line to the graph of $f(x)=c$ has slope 0 for all $x$.
L05231: ## DERIVATIVE OF A CONSTANT
L05233: The simplest kind of function is a constant function $f(x)=c$. Since the graph of $f$ is a horizontal line of slope 0 , the tangent line to the graph of $f$ has slope 0 for every $x$; and hence we can see geometrically that $f^{\prime}(x)=0$ (Figure 2.3.1). We can also see this algebraically since
L05235: $$
L05236: f^{\prime}(x)=\lim _{h \rightarrow 0} \frac{f(x+h)-f(x)}{h}=\lim _{h \rightarrow 0} \frac{c-c}{h}=\lim _{h \rightarrow 0} 0=0
L05237: $$
L05239: Thus, we have established the following result.
L05240: 2.3.1 THEOREM The derivative of a constant function is 0 ; that is, if $c$ is any real number, then
L05242: $$
L05243: \begin{equation*}
L05244: \frac{d}{d x}[c]=0 \tag{1}
L05245: \end{equation*}
L05246: $$
L05248: ## Example 1
L05250: $$
L05251: \frac{d}{d x}[1]=0, \quad \frac{d}{d x}[-3]=0, \quad \frac{d}{d x}[\pi]=0, \quad \frac{d}{d x}[-\sqrt{2}]=0
L05252: $$
L05254: [FIGURE:22a9e0ce65a86b1a | The figure displays the graph of the linear function $y=x$ in a Cartesian coordinate system. A specific point $(x,x)$ on the line is highlighted with a blue dot, with its x-coordinate indicated by a...]
L05255: - Figure 2.3.2
L05257: The tangent line to the graph of $f(x)=x$ has slope 1 for all $x$.
L05259: Verify that Formulas (2), (3), and (4) are the special cases of (5) in which $n=1,2$, and 3 .
L05261: The binomial formula can be found on the front endpaper of the text. Replacing $y$ by $h$ in this formula yields the identity used in the proof of Theorem 2.3.2.
L05263: ## DERIVATIVES OF POWER FUNCTIONS
L05265: The simplest power function is $f(x)=x$. Since the graph of $f$ is a line of slope 1 , it follows from Example 3 of Section 2.2 that $f^{\prime}(x)=1$ for all $x$ (Figure 2.3.2). In other words,
L05267: $$
L05268: \begin{equation*}
L05269: \frac{d}{d x}[x]=1 \tag{2}
L05270: \end{equation*}
L05271: $$
L05273: Example 1 of Section 2.2 shows that the power function $f(x)=x^{2}$ has derivative $f^{\prime}(x)= 2 x$. From Example 2 in that section one can infer that the power function $f(x)=x^{3}$ has derivative $f^{\prime}(x)=3 x^{2}$. That is,
L05275: $$
L05276: \begin{equation*}
L05277: \frac{d}{d x}\left[x^{2}\right]=2 x \quad \text { and } \quad \frac{d}{d x}\left[x^{3}\right]=3 x^{2} \tag{3-4}
L05278: \end{equation*}
L05279: $$
L05281: These results are special cases of the following more general result.
L05282: 2.3.2 THEOREM (The Power Rule) If $n$ is a positive integer, then
L05284: $$
L05285: \begin{equation*}
L05286: \frac{d}{d x}\left[x^{n}\right]=n x^{n-1} \tag{5}
L05287: \end{equation*}
L05288: $$
L05290: proof Let $f(x)=x^{n}$. Thus, from the definition of a derivative and the binomial formula for expanding the expression $(x+h)^{n}$, we obtain
L05292: $$
L05293: \begin{aligned}
L05294: \frac{d}{d x}\left[x^{n}\right] & =f^{\prime}(x)=\lim _{h \rightarrow 0} \frac{f(x+h)-f(x)}{h}=\lim _{h \rightarrow 0} \frac{(x+h)^{n}-x^{n}}{h} \\
L05295: & =\lim _{h \rightarrow 0} \frac{\left[x^{n}+n x^{n-1} h+\frac{n(n-1)}{2!} x^{n-2} h^{2}+\cdots+n x h^{n-1}+h^{n}\right]-x^{n}}{h} \\
L05296: & =\lim _{h \rightarrow 0} \frac{n x^{n-1} h+\frac{n(n-1)}{2!} x^{n-2} h^{2}+\cdots+n x h^{n-1}+h^{n}}{h} \\
L05297: & =\lim _{h \rightarrow 0}\left[n x^{n-1}+\frac{n(n-1)}{2!} x^{n-2} h+\cdots+n x h^{n-2}+h^{n-1}\right] \\
L05298: & =n x^{n-1}+0+\cdots+0+0 \\
L05299: & =n x^{n-1}
L05300: \end{aligned}
L05301: $$
L05303: ## Example 2
L05305: $$
L05306: \frac{d}{d x}\left[x^{4}\right]=4 x^{3}, \quad \frac{d}{d x}\left[x^{5}\right]=5 x^{4}, \quad \frac{d}{d t}\left[t^{12}\right]=12 t^{11}
L05307: $$
L05309: Although our proof of the power rule in Formula (5) applies only to positive integer powers of $x$, it is not difficult to show that the same formula holds for all integer powers of $x$ (Exercise 82). Also, we saw in Example 4 of Section 2.2 that
L05311: $$
L05312: \begin{equation*}
L05313: \frac{d}{d x}[\sqrt{x}]=\frac{1}{2 \sqrt{x}} \tag{6}
L05314: \end{equation*}
L05315: $$
L05317: which can be expressed as
L05319: $$
L05320: \frac{d}{d x}\left[x^{1 / 2}\right]=\frac{1}{2} x^{-1 / 2}=\frac{1}{2} x^{(1 / 2)-1}
L05321: $$
L05323: Thus, Formula (5) is valid for $n=\frac{1}{2}$, as well. In fact, it can be shown that this formula holds for any real exponent. We state this more general result for our use now, although we won't be prepared to prove it until Chapter 3.
L05325: ### 2.3.3 THEOREM (Extended Power Rule) If $r$ is any real number, then
L05327: $$
L05328: \begin{equation*}
L05329: \frac{d}{d x}\left[x^{r}\right]=r x^{r-1} \tag{7}
L05330: \end{equation*}
L05331: $$
L05333: In words, to differentiate a power function, decrease the constant exponent by one and multiply the resulting power function by the original exponent.
L05335: ## Example 3
L05337: $$
L05338: \begin{aligned}
L05339: & \frac{d}{d x}\left[x^{\pi}\right]=\pi x^{\pi-1} \\
L05340: & \frac{d}{d x}\left[\frac{1}{x}\right]=\frac{d}{d x}\left[x^{-1}\right]=(-1) x^{-1-1}=-x^{-2}=-\frac{1}{x^{2}} \\
L05341: & \frac{d}{d w}\left[\frac{1}{w^{100}}\right]=\frac{d}{d w}\left[w^{-100}\right]=-100 w^{-101}=-\frac{100}{w^{101}} \\
L05342: & \frac{d}{d x}\left[x^{4 / 5}\right]=\frac{4}{5} x^{(4 / 5)-1}=\frac{4}{5} x^{-1 / 5} \\
L05343: & \frac{d}{d x}[\sqrt[3]{x}]=\frac{d}{d x}\left[x^{1 / 3}\right]=\frac{1}{3} x^{-2 / 3}=\frac{1}{3 \sqrt[3]{x^{2}}}
L05344: \end{aligned}
L05345: $$
L05347: ## DERIVATIVE OF A CONSTANT TIMES A FUNCTION
L05349: Formula (8) can also be expressed in function notation as
L05351: $$
L05352: (c f)^{\prime}=c f^{\prime}
L05353: $$
L05355: 2.3.4 THEOREM (Constant Multiple Rule) If $f$ is differentiable at $x$ and $c$ is any real number, then $c f$ is also differentiable at $x$ and
L05357: $$
L05358: \begin{equation*}
L05359: \frac{d}{d x}[c f(x)]=c \frac{d}{d x}[f(x)] \tag{8}
L05360: \end{equation*}
L05361: $$
L05363: ## PROOF
L05365: $$
L05366: \begin{aligned}
L05367: \frac{d}{d x}[c f(x)] & =\lim _{h \rightarrow 0} \frac{c f(x+h)-c f(x)}{h} \\
L05368: & =\lim _{h \rightarrow 0} c\left[\frac{f(x+h)-f(x)}{h}\right] \\
L05369: & =c \lim _{h \rightarrow 0} \frac{f(x+h)-f(x)}{h} \quad \begin{array}{l}
L05370: \text { A constant factor can be } \\
L05371: \text { moved through a limit sign. }
L05372: \end{array} \\
L05373: & =c \frac{d}{d x}[f(x)]
L05374: \end{aligned}
L05375: $$
L05377: In words, a constant factor can be moved through a derivative sign.
L05379: Formulas (9) and (10) can also be expressed as
L05381: $$
L05382: \begin{aligned}
L05383: & (f+g)^{\prime}=f^{\prime}+g^{\prime} \\
L05384: & (f-g)^{\prime}=f^{\prime}-g^{\prime}
L05385: \end{aligned}
L05386: $$
L05388: ## Example 4
L05390: $$
L05391: \begin{aligned}
L05392: & \frac{d}{d x}\left[4 x^{8}\right]=4 \frac{d}{d x}\left[x^{8}\right]=4\left[8 x^{7}\right]=32 x^{7} \\
L05393: & \frac{d}{d x}\left[-x^{12}\right]=(-1) \frac{d}{d x}\left[x^{12}\right]=-12 x^{11} \\
L05394: & \frac{d}{d x}\left[\frac{\pi}{x}\right]=\pi \frac{d}{d x}\left[x^{-1}\right]=\pi\left(-x^{-2}\right)=-\frac{\pi}{x^{2}}
L05395: \end{aligned}
L05396: $$
L05398: ## DERIVATIVES OF SUMS AND DIFFERENCES
L05400: 2.3.5 THEOREM (Sum and Difference Rules) If $f$ and $g$ are differentiable at $x$, then so are $f+g$ and $f-g$ and
L05402: $$
L05403: \begin{align*}
L05404: & \frac{d}{d x}[f(x)+g(x)]=\frac{d}{d x}[f(x)]+\frac{d}{d x}[g(x)]  \tag{9}\\
L05405: & \frac{d}{d x}[f(x)-g(x)]=\frac{d}{d x}[f(x)]-\frac{d}{d x}[g(x)] \tag{10}
L05406: \end{align*}
L05407: $$
L05409: PROOF Formula (9) can be proved as follows:
L05411: $$
L05412: \begin{aligned}
L05413: \frac{d}{d x}[f(x)+g(x)] & =\lim _{h \rightarrow 0} \frac{[f(x+h)+g(x+h)]-[f(x)+g(x)]}{h} \\
L05414: & =\lim _{h \rightarrow 0} \frac{[f(x+h)-f(x)]+[g(x+h)-g(x)]}{h} \\
L05415: & =\lim _{h \rightarrow 0} \frac{f(x+h)-f(x)}{h}+\lim _{h \rightarrow 0} \frac{g(x+h)-g(x)}{h} \quad \begin{array}{l}
L05416: \text { The limit of a sum is } \\
L05417: \text { the sum of the limits. }
L05418: \end{array} \\
L05419: & =\frac{d}{d x}[f(x)]+\frac{d}{d x}[g(x)]
L05420: \end{aligned}
L05421: $$
L05423: Formula (10) can be proved in a similar manner or, alternatively, by writing $f(x)-g(x)$ as $f(x)+(-1) g(x)$ and then applying Formulas (8) and (9).
L05425: In words, the derivative of a sum equals the sum of the derivatives, and the derivative of a difference equals the difference of the derivatives.
L05427: ## Example 5
L05429: $$
L05430: \begin{aligned}
L05431: \frac{d}{d x}\left[2 x^{6}+x^{-9}\right] & =\frac{d}{d x}\left[2 x^{6}\right]+\frac{d}{d x}\left[x^{-9}\right]=12 x^{5}+(-9) x^{-10}=12 x^{5}-9 x^{-10} \\
L05432: \frac{d}{d x}\left[\frac{\sqrt{x}-2 x}{\sqrt{x}}\right] & =\frac{d}{d x}[1-2 \sqrt{x}] \\
L05433: & =\frac{d}{d x}[1]-\frac{d}{d x}[2 \sqrt{x}]=0-2\left(\frac{1}{2 \sqrt{x}}\right)=-\frac{1}{\sqrt{x}} \quad \text { See Formula (6). }
L05434: \end{aligned}
L05435: $$
L05437: [FIGURE:9775974a975e5576 | A graph displays the curve of the function $y = x^3 - 3x + 4$ on an $xy$-plane. The curve has a local maximum at $(-1, 6)$ and a local minimum at $(1, 2)$, with horizontal lines extending from these...]
L05438: △ Figure 2.3.3
L05440: [FIGURE:18e3b3b558479f73 | A graph shows the blue curve $y = 5x^{-1} - \frac{1}{5}x$ in the first quadrant. A purple line, which is tangent to the curve at the point $(5,0)$, intersects the y-axis at $(0,2)$. The triangular...]
L05441: Figure 2.3.4
L05443: Although Formulas (9) and (10) are stated for sums and differences of two functions, they can be extended to any finite number of functions. For example, by grouping and applying Formula (9) twice we obtain
L05445: $$
L05446: (f+g+h)^{\prime}=[(f+g)+h]^{\prime}=(f+g)^{\prime}+h^{\prime}=f^{\prime}+g^{\prime}+h^{\prime}
L05447: $$
L05449: As illustrated in the following example, the constant multiple rule together with the extended versions of the sum and difference rules can be used to differentiate any polynomial.
L05451: Example 6 Find $d y / d x$ if $y=3 x^{8}-2 x^{5}+6 x+1$.
L05452: Solution.
L05454: $$
L05455: \begin{aligned}
L05456: \frac{d y}{d x} & =\frac{d}{d x}\left[3 x^{8}-2 x^{5}+6 x+1\right] \\
L05457: & =\frac{d}{d x}\left[3 x^{8}\right]-\frac{d}{d x}\left[2 x^{5}\right]+\frac{d}{d x}[6 x]+\frac{d}{d x}[1] \\
L05458: & =24 x^{7}-10 x^{4}+6
L05459: \end{aligned}
L05460: $$
L05462: Example 7 At what points, if any, does the graph of $y=x^{3}-3 x+4$ have a horizontal tangent line?
L05464: Solution. Horizontal tangent lines have slope zero, so we must find those values of $x$ for which $y^{\prime}(x)=0$. Differentiating yields
L05466: $$
L05467: y^{\prime}(x)=\frac{d}{d x}\left[x^{3}-3 x+4\right]=3 x^{2}-3
L05468: $$
L05470: Thus, horizontal tangent lines occur at those values of $x$ for which $3 x^{2}-3=0$, that is, if $x=-1$ or $x=1$. The corresponding points on the curve $y=x^{3}-3 x+4$ are $(-1,6)$ and $(1,2)$ (see Figure 2.3.3).
L05472: Example 8 Find the area of the triangle formed from the coordinate axes and the tangent line to the curve $y=5 x^{-1}-\frac{1}{5} x$ at the point $(5,0)$.
L05474: Solution. Since the derivative of $y$ with respect to $x$ is
L05476: $$
L05477: y^{\prime}(x)=\frac{d}{d x}\left[5 x^{-1}-\frac{1}{5} x\right]=\frac{d}{d x}\left[5 x^{-1}\right]-\frac{d}{d x}\left[\frac{1}{5} x\right]=-5 x^{-2}-\frac{1}{5}
L05478: $$
L05480: the slope of the tangent line at the point $(5,0)$ is $y^{\prime}(5)=-\frac{2}{5}$. Thus, the equation of the tangent line at this point is
L05482: $$
L05483: y-0=-\frac{2}{5}(x-5) \quad \text { or equivalently } \quad y=-\frac{2}{5} x+2
L05484: $$
L05486: Since the $y$-intercept of this line is 2 , the right triangle formed from the coordinate axes and the tangent line has legs of length 5 and 2 , so its area is $\frac{1}{2}(5)(2)=5$ (Figure 2.3.4).
L05488: ## HIGHER DERIVATIVES
L05490: The derivative $f^{\prime}$ of a function $f$ is itself a function and hence may have a derivative of its own. If $f^{\prime}$ is differentiable, then its derivative is denoted by $f^{\prime \prime}$ and is called the second derivative of $f$. As long as we have differentiability, we can continue the process
L05491: of differentiating to obtain third, fourth, fifth, and even higher derivatives of $f$. These successive derivatives are denoted by
L05493: $$
L05494: f^{\prime}, \quad f^{\prime \prime}=\left(f^{\prime}\right)^{\prime}, \quad f^{\prime \prime \prime}=\left(f^{\prime \prime}\right)^{\prime}, \quad f^{(4)}=\left(f^{\prime \prime \prime}\right)^{\prime}, \quad f^{(5)}=\left(f^{(4)}\right)^{\prime}, \ldots
L05495: $$
L05497: If $y=f(x)$, then successive derivatives can also be denoted by
L05499: $$
L05500: y^{\prime}, \quad y^{\prime \prime}, \quad y^{\prime \prime \prime}, \quad y^{(4)}, \quad y^{(5)}, \ldots
L05501: $$
L05503: Other common notations are
L05505: $$
L05506: \begin{aligned}
L05507: y^{\prime} & =\frac{d y}{d x}=\frac{d}{d x}[f(x)] \\
L05508: y^{\prime \prime} & =\frac{d^{2} y}{d x^{2}}=\frac{d}{d x}\left[\frac{d}{d x}[f(x)]\right]=\frac{d^{2}}{d x^{2}}[f(x)] \\
L05509: y^{\prime \prime \prime} & =\frac{d^{3} y}{d x^{3}}=\frac{d}{d x}\left[\frac{d^{2}}{d x^{2}}[f(x)]\right]=\frac{d^{3}}{d x^{3}}[f(x)] \\
L05510: \vdots & \vdots
L05511: \end{aligned}
L05512: $$
L05514: These are called, in succession, the first derivative, the second derivative, the third derivative, and so forth. The number of times that $f$ is differentiated is called the order of the derivative. A general $n$th order derivative can be denoted by
L05516: $$
L05517: \begin{equation*}
L05518: \frac{d^{n} y}{d x^{n}}=f^{(n)}(x)=\frac{d^{n}}{d x^{n}}[f(x)] \tag{11}
L05519: \end{equation*}
L05520: $$
L05522: and the value of a general $n$th order derivative at a specific point $x=x_{0}$ can be denoted by
L05524: $$
L05525: \begin{equation*}
L05526: \left.\frac{d^{n} y}{d x^{n}}\right|_{x=x_{0}}=f^{(n)}\left(x_{0}\right)=\left.\frac{d^{n}}{d x^{n}}[f(x)]\right|_{x=x_{0}} \tag{12}
L05527: \end{equation*}
L05528: $$
L05530: - Example 9 If $f(x)=3 x^{4}-2 x^{3}+x^{2}-4 x+2$, then
L05532: $$
L05533: \begin{aligned}
L05534: & f^{\prime}(x)=12 x^{3}-6 x^{2}+2 x-4 \\
L05535: & f^{\prime \prime}(x)=36 x^{2}-12 x+2 \\
L05536: & f^{\prime \prime \prime}(x)=72 x-12 \\
L05537: & f^{(4)}(x)=72 \\
L05538: & f^{(5)}(x)=0 \\
L05539: & \vdots \\
L05540: & f^{(n)}(x)=0 \quad(n \geq 5)
L05541: \end{aligned}
L05542: $$
L05544: We will discuss the significance of second derivatives and those of higher order in later sections.
L05546: ## QUICK CHECK EXERCISES 2.3 (See page 163 for answers.)
L05548: 1. In each part, determine $f^{\prime}(x)$.
L05549: (a) $f(x)=\sqrt{6}$
L05550: (b) $f(x)=\sqrt{6} x$
L05551: (c) $f(x)=6 \sqrt{x}$
L05552: (d) $f(x)=\sqrt{6 x}$
L05553: 2. In parts (a)-(d), determine $f^{\prime}(x)$.
L05554: (a) $f(x)=x^{3}+5$
L05555: (b) $f(x)=x^{2}\left(x^{3}+5\right)$
L05556: (c) $f(x)=\frac{x^{3}+5}{2}$
L05557: (d) $f(x)=\frac{x^{3}+5}{x^{2}}$
L05558: 3. The slope of the tangent line to the curve $y=x^{2}+4 x+7$ at $x=1$ is $\_\_\_\_$ .
L05559: 4. If $f(x)=3 x^{3}-3 x^{2}+x+1$, then $f^{\prime \prime}(x)=$ $\_\_\_\_$
L05561: 1-8 Find $d y / d x$.
L05563: 1. $y=4 x^{7}$
L05564: 2. $y=-3 x^{12}$
L05565: 3. $y=3 x^{8}+2 x+1$
L05566: 4. $y=\frac{1}{2}\left(x^{4}+7\right)$
L05567: 5. $y=\pi^{3}$
L05568: 6. $y=\sqrt{2} x+(1 / \sqrt{2})$
L05569: 7. $y=-\frac{1}{3}\left(x^{7}+2 x-9\right)$
L05570: 8. $y=\frac{x^{2}+1}{5}$
L05572: 9-16 Find $f^{\prime}(x)$.
L05573: 9. $f(x)=x^{-3}+\frac{1}{x^{7}}$
L05574: 10. $f(x)=\sqrt{x}+\frac{1}{x}$
L05575: 11. $f(x)=-3 x^{-8}+2 \sqrt{x}$
L05576: 12. $f(x)=7 x^{-6}-5 \sqrt{x}$
L05577: 13. $f(x)=x^{e}+\frac{1}{x^{\sqrt{10}}}$
L05578: 14. $f(x)=\sqrt[3]{\frac{8}{x}}$
L05579: 15. $f(x)=a x^{3}+b x^{2}+c x+d \quad(a, b, c, d$ constant $)$
L05580: 16. $f(x)=\frac{1}{a}\left(x^{2}+\frac{1}{b} x+c\right) \quad(a, b, c$ constant $)$
L05582: 17-18 Find $y^{\prime}(1)$.
L05583: 17. $y=5 x^{2}-3 x+1$
L05584: 18. $y=\frac{x^{3 / 2}+2}{x}$
L05586: 19-20 Find $d x / d t$.
L05587: 19. $x=t^{2}-t$
L05588: 20. $x=\frac{t^{2}+1}{3 t}$
L05590: 21-24 Find $d y /\left.d x\right|_{x=1}$.
L05591: 21. $y=1+x+x^{2}+x^{3}+x^{4}+x^{5}$
L05592: 22. $y=\frac{1+x+x^{2}+x^{3}+x^{4}+x^{5}+x^{6}}{x^{3}}$
L05593: 23. $y=(1-x)(1+x)\left(1+x^{2}\right)\left(1+x^{4}\right)$
L05594: 24. $y=x^{24}+2 x^{12}+3 x^{8}+4 x^{6}$
L05596: 25-26 Approximate $f^{\prime}(1)$ by considering the difference quotient
L05598: $$
L05599: \frac{f(1+h)-f(1)}{h}
L05600: $$
L05602: for values of $h$ near 0 , and then find the exact value of $f^{\prime}(1)$ by differentiating.
L05603: 25. $f(x)=x^{3}-3 x+1$
L05604: 26. $f(x)=\frac{1}{x^{2}}$
L05606: 27-28 Use a graphing utility to estimate the value of $f^{\prime}(1)$ by zooming in on the graph of $f$, and then compare your estimate to the exact value obtained by differentiating.
L05607: 27. $f(x)=\frac{x^{2}+1}{x}$
L05608: 28. $f(x)=\frac{x+2 x^{3 / 2}}{\sqrt{x}}$
L05610: 29-32 Find the indicated derivative.
L05611: 29. $\frac{d}{d t}\left[16 t^{2}\right]$
L05612: 30. $\frac{d C}{d r}$, where $C=2 \pi r$
L05613: 31. $V^{\prime}(r)$, where $V=\pi r^{3}$
L05614: 32. $\frac{d}{d \alpha}\left[2 \alpha^{-1}+\alpha\right]$
L05616: 33-36 True-False Determine whether the statement is true or false. Explain your answer.
L05617: 33. If $f$ and $g$ are differentiable at $x=2$, then
L05619: $$
L05620: \left.\frac{d}{d x}[f(x)-8 g(x)]\right|_{x=2}=f^{\prime}(2)-8 g^{\prime}(2)
L05621: $$
L05623: 34. If $f(x)$ is a cubic polynomial, then $f^{\prime}(x)$ is a quadratic polynomial.
L05624: 35. If $f^{\prime}(2)=5$, then
L05626: $$
L05627: \left.\frac{d}{d x}\left[4 f(x)+x^{3}\right]\right|_{x=2}=\left.\frac{d}{d x}[4 f(x)+8]\right|_{x=2}=4 f^{\prime}(2)=20
L05628: $$
L05630: 36. If $f(x)=x^{2}\left(x^{4}-x\right)$, then
L05632: $$
L05633: f^{\prime \prime}(x)=\frac{d}{d x}\left[x^{2}\right] \cdot \frac{d}{d x}\left[x^{4}-x\right]=2 x\left(4 x^{3}-1\right)
L05634: $$
L05636: 37. A spherical balloon is being inflated.
L05637: (a) Find a general formula for the instantaneous rate of change of the volume $V$ with respect to the radius $r$, given that $V=\frac{4}{3} \pi r^{3}$.
L05638: (b) Find the rate of change of $V$ with respect to $r$ at the instant when the radius is $r=5$.
L05639: 38. Find $\frac{d}{d \lambda}\left[\frac{\lambda \lambda_{0}+\lambda^{6}}{2-\lambda_{0}}\right] \quad$ ( $\lambda_{0}$ is constant).
L05640: 39. Find an equation of the tangent line to the graph of $y=f(x)$ at $x=-3$ if $f(-3)=2$ and $f^{\prime}(-3)=5$.
L05641: 40. Find an equation of the tangent line to the graph of $y=f(x)$ at $x=2$ if $f(2)=-2$ and $f^{\prime}(2)=-1$.
L05643: 41-42 Find $d^{2} y / d x^{2}$. □
L05644: 41.
L05645: (a) $y=7 x^{3}-5 x^{2}+x$
L05646: (b) $y=12 x^{2}-2 x+3$
L05647: (c) $y=\frac{x+1}{x}$
L05648: (d) $y=\left(5 x^{2}-3\right)\left(7 x^{3}+x\right)$
L05649: 42.
L05650: (a) $y=4 x^{7}-5 x^{3}+2 x$
L05651: (b) $y=3 x+2$
L05652: (c) $y=\frac{3 x-2}{5 x}$
L05653: (d) $y=\left(x^{3}-5\right)(2 x+3)$
L05655: 43-44 Find $y^{\prime \prime \prime}$.
L05656: 43.
L05657: (a) $y=x^{-5}+x^{5}$
L05658: (b) $y=1 / x$
L05659: (c) $y=a x^{3}+b x+c$
L05660: ( $a, b, c$ constant)
L05661: 44.
L05662: (a) $y=5 x^{2}-4 x+7$
L05663: (b) $y=3 x^{-2}+4 x^{-1}+x$
L05664: (c) $y=a x^{4}+b x^{2}+c \quad(a, b, c$ constant $)$
L05665: 45. Find
L05666: (a) $f^{\prime \prime \prime}(2)$, where $f(x)=3 x^{2}-2$
L05667: (b) $\left.\frac{d^{2} y}{d x^{2}}\right|_{x=1}$, where $y=6 x^{5}-4 x^{2}$
L05668: (c) $\left.\frac{d^{4}}{d x^{4}}\left[x^{-3}\right]\right|_{x=1}$.
L05669: 46. Find
L05670: (a) $y^{\prime \prime \prime}(0)$, where $y=4 x^{4}+2 x^{3}+3$
L05671: (b) $\left.\frac{d^{4} y}{d x^{4}}\right|_{x=1}$, where $y=\frac{6}{x^{4}}$.
L05672: 47. Show that $y=x^{3}+3 x+1$ satisfies $y^{\prime \prime \prime}+x y^{\prime \prime}-2 y^{\prime}=0$.
L05673: 48. Show that if $x \neq 0$, then $y=1 / x$ satisfies the equation $x^{3} y^{\prime \prime}+x^{2} y^{\prime}-x y=0$.
L05675: 49-50 Use a graphing utility to make rough estimates of the locations of all horizontal tangent lines, and then find their exact locations by differentiating.
L05676: 49. $y=\frac{1}{3} x^{3}-\frac{3}{2} x^{2}+2 x \quad$ 50. $y=\frac{x^{2}+9}{x}$
L05678: ## FOCUS ON CONCEPTS
L05680: 51. Find a function $y=a x^{2}+b x+c$ whose graph has an $x$-intercept of 1 , a $y$-intercept of -2 , and a tangent line with a slope of -1 at the $y$-intercept.
L05681: 52. Find $k$ if the curve $y=x^{2}+k$ is tangent to the line $y=2 x$.
L05682: 53. Find the $x$-coordinate of the point on the graph of $y=x^{2}$ where the tangent line is parallel to the secant line that cuts the curve at $x=-1$ and $x=2$.
L05683: 54. Find the $x$-coordinate of the point on the graph of $y=\sqrt{x}$ where the tangent line is parallel to the secant line that cuts the curve at $x=1$ and $x=4$.
L05684: 55. Find the coordinates of all points on the graph of $y=1-x^{2}$ at which the tangent line passes through the point $(2,0)$.
L05685: 56. Show that any two tangent lines to the parabola $y=a x^{2}$, $a \neq 0$, intersect at a point that is on the vertical line halfway between the points of tangency.
L05686: 57. Suppose that $L$ is the tangent line at $x=x_{0}$ to the graph of the cubic equation $y=a x^{3}+b x$. Find the $x$-coordinate of the point where $L$ intersects the graph a second time.
L05687: 58. Show that the segment of the tangent line to the graph of $y=1 / x$ that is cut off by the coordinate axes is bisected by the point of tangency.
L05688: 59. Show that the triangle that is formed by any tangent line to the graph of $y=1 / x, x>0$, and the coordinate axes has an area of 2 square units.
L05689: 60. Find conditions on $a, b, c$, and $d$ so that the graph of the polynomial $f(x)=a x^{3}+b x^{2}+c x+d$ has
L05690: (a) exactly two horizontal tangents
L05691: (b) exactly one horizontal tangent
L05692: (c) no horizontal tangents.
L05693: 61. Newton's Law of Universal Gravitation states that the magnitude $F$ of the force exerted by a point with mass $M$ on a
L05694: point with mass $m$ is
L05696: $$
L05697: F=\frac{G m M}{r^{2}}
L05698: $$
L05700: where $G$ is a constant and $r$ is the distance between the bodies. Assuming that the points are moving, find a formula for the instantaneous rate of change of $F$ with respect to $r$.
L05701: 62. In the temperature range between $0^{\circ} \mathrm{C}$ and $700^{\circ} \mathrm{C}$ the resistance $R$ [in ohms $(\Omega)$ ] of a certain platinum resistance thermometer is given by
L05703: $$
L05704: R=10+0.04124 T-1.779 \times 10^{-5} T^{2}
L05705: $$
L05707: where $T$ is the temperature in degrees Celsius. Where in the interval from $0^{\circ} \mathrm{C}$ to $700^{\circ} \mathrm{C}$ is the resistance of the thermometer most sensitive and least sensitive to temperature changes? [Hint: Consider the size of $d R / d T$ in the interval $0 \leq T \leq 700$.]
L05709: 63-64 Use a graphing utility to make rough estimates of the intervals on which $f^{\prime}(x)>0$, and then find those intervals exactly by differentiating.
L05710: 63. $f(x)=x-\frac{1}{x}$
L05711: 64. $f(x)=x^{3}-3 x$
L05713: 65-68 You are asked in these exercises to determine whether a piecewise-defined function $f$ is differentiable at a value $x=x_{0}$, where $f$ is defined by different formulas on different sides of $x_{0}$. You may use without proof the following result, which is a consequence of the Mean-Value Theorem (discussed in Section 4.8). Theorem. Let $f$ be continuous at $x_{0}$ and suppose that $\lim _{x \rightarrow x_{0}} f^{\prime}(x)$ exists. Then $f$ is differentiable at $x_{0}$, and $f^{\prime}\left(x_{0}\right)=\lim _{x \rightarrow x_{0}} f^{\prime}(x)$.
L05714: 65. Show that
L05716: $$
L05717: f(x)= \begin{cases}x^{2}+x+1, & x \leq 1 \\ 3 x, & x>1\end{cases}
L05718: $$
L05720: is continuous at $x=1$. Determine whether $f$ is differentiable at $x=1$. If so, find the value of the derivative there. Sketch the graph of $f$.
L05721: 66. Let
L05723: $$
L05724: f(x)= \begin{cases}x^{2}-16 x, & x<9 \\ \sqrt{x}, & x \geq 9\end{cases}
L05725: $$
L05727: Is $f$ continuous at $x=9$ ? Determine whether $f$ is differentiable at $x=9$. If so, find the value of the derivative there.
L05728: 67. Let
L05730: $$
L05731: f(x)= \begin{cases}x^{2}, & x \leq 1 \\ \sqrt{x}, & x>1\end{cases}
L05732: $$
L05734: Determine whether $f$ is differentiable at $x=1$. If so, find the value of the derivative there.
L05735: 68. Let
L05737: $$
L05738: f(x)= \begin{cases}x^{3}+\frac{1}{16}, & x<\frac{1}{2} \\ \frac{3}{4} x^{2}, & x \geq \frac{1}{2}\end{cases}
L05739: $$
L05741: Determine whether $f$ is differentiable at $x=\frac{1}{2}$. If so, find the value of the derivative there.
L05742: 69. Find all points where $f$ fails to be differentiable. Justify your answer.
L05743: (a) $f(x)=|3 x-2|$
L05744: (b) $f(x)=\left|x^{2}-4\right|$
L05745: 70. In each part, compute $f^{\prime}, f^{\prime \prime}, f^{\prime \prime \prime}$, and then state the formula for $f^{(n)}$.
L05746: (a) $f(x)=1 / x$
L05747: (b) $f(x)=1 / x^{2}$
L05748: [Hint: The expression $(-1)^{n}$ has a value of 1 if $n$ is even and -1 if $n$ is odd. Use this expression in your answer.]
L05749: 71. (a) Prove:
L05751: $$
L05752: \begin{aligned}
L05753: & \frac{d^{2}}{d x^{2}}[c f(x)]=c \frac{d^{2}}{d x^{2}}[f(x)] \\
L05754: & \frac{d^{2}}{d x^{2}}[f(x)+g(x)]=\frac{d^{2}}{d x^{2}}[f(x)]+\frac{d^{2}}{d x^{2}}[g(x)]
L05755: \end{aligned}
L05756: $$
L05758: (b) Do the results in part (a) generalize to $n$th derivatives? Justify your answer.
L05759: 72. Let $f(x)=x^{8}-2 x+3$; find
L05761: $$
L05762: \lim _{w \rightarrow 2} \frac{f^{\prime}(w)-f^{\prime}(2)}{w-2}
L05763: $$
L05765: 73. (a) Find $f^{(n)}(x)$ if $f(x)=x^{n}, n=1,2,3, \ldots$.
L05766: (b) Find $f^{(n)}(x)$ if $f(x)=x^{k}$ and $n>k$, where $k$ is a positive integer.
L05767: (c) Find $f^{(n)}(x)$ if
L05769: $$
L05770: f(x)=a_{0}+a_{1} x+a_{2} x^{2}+\cdots+a_{n} x^{n}
L05771: $$
L05773: 74. (a) Prove: If $f^{\prime \prime}(x)$ exists for each $x$ in ( $a, b$ ), then both $f$ and $f^{\prime}$ are continuous on $(a, b)$.
L05774: (b) What can be said about the continuity of $f$ and its derivatives if $f^{(n)}(x)$ exists for each $x$ in $(a, b)$ ?
L05775: 75. Let $f(x)=(m x+b)^{n}$, where $m$ and $b$ are constants and $n$ is an integer. Use the result of Exercise 52 in Section 2.2 to prove that $f^{\prime}(x)=n m(m x+b)^{n-1}$.
L05777: 76-77 Verify the result of Exercise 75 for $f(x)$.
L05778: 76. $f(x)=(2 x+3)^{2}$
L05779: 77. $f(x)=(3 x-1)^{3}$
L05781: 78-81 Use the result of Exercise 75 to compute the derivative of the given function $f(x)$.
L05782: 78. $f(x)=\frac{1}{x-1}$
L05783: 79. $f(x)=\frac{3}{(2 x+1)^{2}}$
L05784: 80. $f(x)=\frac{x}{x+1}$
L05785: 81. $f(x)=\frac{2 x^{2}+4 x+3}{x^{2}+2 x+1}$
L05786: 82. The purpose of this exercise is to extend the power rule (Theorem 2.3.2) to any integer exponent. Let $f(x)=x^{n}$, where $n$ is any integer. If $n>0$, then $f^{\prime}(x)=n x^{n-1}$ by Theorem 2.3.2.
L05787: (a) Show that the conclusion of Theorem 2.3.2 holds in the case $n=0$.
L05788: (b) Suppose that $n<0$ and set $m=-n$ so that
L05790: $$
L05791: f(x)=x^{n}=x^{-m}=\frac{1}{x^{m}}
L05792: $$
L05794: Use Definition 2.2.1 and Theorem 2.3.2 to show that
L05796: $$
L05797: \frac{d}{d x}\left[\frac{1}{x^{m}}\right]=-m x^{m-1} \cdot \frac{1}{x^{2 m}}
L05798: $$
L05800: and conclude that $f^{\prime}(x)=n x^{n-1}$.
