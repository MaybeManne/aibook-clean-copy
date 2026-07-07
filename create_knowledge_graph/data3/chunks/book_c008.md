L02674: ## QUICK CHECK ANSWERS 1.4
L02676: 1. $\epsilon>0 ; \delta>0 ; 0<|x-a|<\delta$
L02677: 2. $\lim _{x \rightarrow 1} f(x)=5$
L02678: 3. $\delta=\epsilon / 5$
L02679: 4. $\epsilon>0 ; N ; x>N$
L02680: 5. $N=10,000$
L02682: ### 1.5 CONTINUITY
L02684: [FIGURE:08058e9f1dd66e94 | A hand is reaching upwards towards a baseball suspended in mid-air against a cloudy blue sky. This image likely serves as a decorative or introductory visual, as its direct relevance to the...]
L02685: Joseph Helfenberger/iStockphoto
L02687: A baseball moves along a "continuous" trajectory after leaving the pitcher's hand.
L02689: A thrown baseball cannot vanish at some point and reappear someplace else to continue its motion. Thus, we perceive the path of the ball as an unbroken curve. In this section, we translate "unbroken curve" into a precise mathematical formulation called continuity, translate "unbroken curve" into a precise mathematical formulation called continuity,
L02691: ## DEFINITION OF CONTINUITY
L02693: Intuitively, the graph of a function can be described as a "continuous curve" if it has no breaks or holes. To make this idea more precise we need to understand what properties of a function can cause breaks or holes. Referring to Figure 1.5.1, we see that the graph of a function has a break or hole if any of the following conditions occur:
L02695: - The function $f$ is undefined at $c$ (Figure 1.5.1a).
L02696: - The limit of $f(x)$ does not exist as $x$ approaches $c$ (Figures 1.5.1b, 1.5.1c).
L02697: - The value of the function and the value of the limit at $c$ are different (Figure 1.5.1d).
L02699: [FIGURE:4100cfc68b82376b | The figure displays four graphs, (a) through (d), illustrating different conditions for continuity of a function $y=f(x)$ at a point $x=c$. Graph (a) shows a function with a hole at $x=c$, where the...]
L02700: △ Figure 1.5.1
L02702: The third condition in Definition 1.5.1 actually implies the first two, since it is tacitly understood in the statement
L02704: $$
L02705: \lim _{x \rightarrow c} f(x)=f(c)
L02706: $$
L02708: that the limit exists and the function is defined at $c$. Thus, when we want to establish continuity at $c$ our usual procedure will be to verify the third condition only.
L02710: This suggests the following definition.
L02711: 1.5.1 DEFINITION A function $f$ is said to be continuous at $\boldsymbol{x}=\boldsymbol{c}$ provided the following conditions are satisfied:
L02713: 1. $f(c)$ is defined.
L02714: 2. $\lim _{x \rightarrow c} f(x)$ exists.
L02715: 3. $\lim _{x \rightarrow c} f(x)=f(c)$.
L02717: If one or more of the conditions of this definition fails to hold, then we will say that $f$ has a discontinuity at $\boldsymbol{x}=\boldsymbol{c}$. Each function drawn in Figure 1.5.1 illustrates a discontinuity at $x=c$. In Figure 1.5.1a, the function is not defined at $c$, violating the first condition of Definition 1.5.1. In Figure 1.5.1b, the one-sided limits of $f(x)$ as $x$ approaches $c$ both exist but are not equal. Thus, $\lim _{x \rightarrow c} f(x)$ does not exist, and this violates the second condition of Definition 1.5.1. We will say that a function like that in Figure 1.5.1 $b$ has a jump discontinuity at $c$. In Figure 1.5.1c, the one-sided limits of $f(x)$ as $x$ approaches $c$ are infinite. Thus, $\lim _{x \rightarrow c} f(x)$ does not exist, and this violates the second condition of Definition 1.5.1. We will say that a function like that in Figure 1.5.1c has an infinite discontinuity at $c$. In Figure 1.5.1d, the function is defined at $c$ and $\lim _{x \rightarrow c} f(x)$ exists, but these two values are not equal, violating the third condition of Definition 1.5.1. We will
L02719: [FIGURE:25fb1943b4d0ca7d | A photograph shows two construction workers in blue hard hats sitting on the ground next to an open trench. The trench contains a large, thick bundle of cables, and other cables are visible on the...]
L02720: Chris Hondros/Getty Images A poor connection in a transmission cable can cause a discontinuity in the electrical signal it carries.
L02722: say that a function like that in Figure 1.5.1d has a removable discontinuity at $c$. Exercises 33 and 34 help to explain why discontinuities of this type are given this name.
L02724: Example 1 Determine whether the following functions are continuous at $x=2$.
L02726: $$
L02727: f(x)=\frac{x^{2}-4}{x-2}, \quad g(x)=\left\{\begin{array}{ll}
L02728: \frac{x^{2}-4}{x-2}, & x \neq 2 \\
L02729: 3, & x=2,
L02730: \end{array} \quad h(x)= \begin{cases}\frac{x^{2}-4}{x-2}, & x \neq 2 \\
L02731: 4, & x=2\end{cases}\right.
L02732: $$
L02734: Solution. In each case we must determine whether the limit of the function as $x \rightarrow 2$ is the same as the value of the function at $x=2$. In all three cases the functions are identical, except at $x=2$, and hence all three have the same limit at $x=2$, namely,
L02736: $$
L02737: \lim _{x \rightarrow 2} f(x)=\lim _{x \rightarrow 2} g(x)=\lim _{x \rightarrow 2} h(x)=\lim _{x \rightarrow 2} \frac{x^{2}-4}{x-2}=\lim _{x \rightarrow 2}(x+2)=4
L02738: $$
L02740: The function $f$ is undefined at $x=2$, and hence is not continuous at $x=2$ (Figure 1.5.2a). The function $g$ is defined at $x=2$, but its value there is $g(2)=3$, which is not the same as the limit as $x$ approaches 2 ; hence, $g$ is also not continuous at $x=2$ (Figure 1.5.2b). The value of the function $h$ at $x=2$ is $h(2)=4$, which is the same as the limit as $x$ approaches 2 ; hence, $h$ is continuous at $x=2$ (Figure 1.5.2c). (Note that the function $h$ could have been written more simply as $h(x)=x+2$, but we wrote it in piecewise form to emphasize its relationship to $f$ and $g$.)
L02742: [FIGURE:1c4181e5f79569c7 | The figure displays three graphs, labeled (a), (b), and (c), each showing a linear function with different continuity properties at $x=2$. All three graphs have x and y axes, with a tick mark at...]
L02743: △ Figure 1.5.2
L02745: ## CONTINUITY IN APPLICATIONS
L02747: In applications, discontinuities often signal the occurrence of important physical events. For example, Figure 1.5.3a is a graph of voltage versus time for an underground cable that is accidentally cut by a work crew at time $t=t_{0}$ (the voltage drops to zero when the line is cut). Figure 1.5.3b shows the graph of inventory versus time for a company that restocks its warehouse to $y_{1}$ units when the inventory falls to $y_{0}$ units. The discontinuities occur at those times when restocking occurs.
L02749: [FIGURE:bdb95a59cdef5ee1 | The figure displays two graphs. Graph (a) shows voltage $V$ as a function of time $t$. The voltage is a positive, slightly oscillating value until time $t_0$, where it sharply drops to zero and...]
L02750: - Figure 1.5.3
L02752: [FIGURE:3d77e8a5291228d6 | A graph on an $xy$-coordinate system displays the function $y=f(x)$. The curve starts with an open circle at $x=a$ and extends to a closed circle at $x=b$. An additional isolated closed point is...]
L02753: △ Figure 1.5.4
L02755: Modify Definition 1.5.2 appropriately so that it applies to intervals of the form $[a,+\infty),(-\infty, b],(a, b]$, and $[a, b)$.
L02757: [FIGURE:7c7735c1f404da79 | A graph displays a blue semi-circular curve in the Cartesian coordinate system. The curve starts at the point $(-3, 0)$ on the x-axis, rises to a maximum height of $y=3$ at $x=0$, and descends to the...]
L02758: △ Figure 1.5.5
L02760: $$
L02761: f(x)=\sqrt{9-x^{2}}
L02762: $$
L02764: ## CONTINUITY ON AN INTERVAL
L02766: If a function $f$ is continuous at each number in an open interval $(a, b)$, then we say that $f$ is continuous on ( $\boldsymbol{a}, \boldsymbol{b}$ ). This definition applies to infinite open intervals of the form ( $a,+\infty$ ), $(-\infty, b)$, and $(-\infty,+\infty)$. In the case where $f$ is continuous on $(-\infty,+\infty)$, we will say that $f$ is continuous everywhere.
L02768: Because Definition 1.5.1 involves a two-sided limit, that definition does not generally apply at the endpoints of a closed interval $[a, b]$ or at the endpoint of an interval of the form $[a, b),(a, b],(-\infty, b]$, or $[a,+\infty)$. To remedy this problem, we will agree that a function is continuous at an endpoint of an interval if its value at the endpoint is equal to the appropriate one-sided limit at that endpoint. For example, the function graphed in Figure 1.5.4 is continuous at the right endpoint of the interval $[a, b]$ because
L02770: $$
L02771: \lim _{x \rightarrow b^{-}} f(x)=f(b)
L02772: $$
L02774: but it is not continuous at the left endpoint because
L02776: $$
L02777: \lim _{x \rightarrow a^{+}} f(x) \neq f(a)
L02778: $$
L02780: In general, we will say a function $f$ is continuous from the left at $c$ if
L02782: $$
L02783: \lim _{x \rightarrow c^{-}} f(x)=f(c)
L02784: $$
L02786: and is continuous from the right at $c$ if
L02788: $$
L02789: \lim _{x \rightarrow c^{+}} f(x)=f(c)
L02790: $$
L02792: Using this terminology we define continuity on a closed interval as follows.
L02793: 1.5.2 Definition A function $f$ is said to be continuous on a closed interval $[\boldsymbol{a}, \boldsymbol{b}]$ if the following conditions are satisfied:
L02795: 1. $f$ is continuous on $(a, b)$.
L02796: 2. $f$ is continuous from the right at $a$.
L02797: 3. $f$ is continuous from the left at $b$.
L02799: - Example 2 What can you say about the continuity of the function $f(x)=\sqrt{9-x^{2}}$ ?
L02801: Solution. Because the natural domain of this function is the closed interval [ $-3,3$ ], we will need to investigate the continuity of $f$ on the open interval $(-3,3)$ and at the two endpoints. If $c$ is any point in the interval $(-3,3)$, then it follows from Theorem 1.2.2(e) that
L02803: $$
L02804: \lim _{x \rightarrow c} f(x)=\lim _{x \rightarrow c} \sqrt{9-x^{2}}=\sqrt{\lim _{x \rightarrow c}\left(9-x^{2}\right)}=\sqrt{9-c^{2}}=f(c)
L02805: $$
L02807: which proves $f$ is continuous at each point in the interval $(-3,3)$. The function $f$ is also continuous at the endpoints since
L02809: $$
L02810: \begin{aligned}
L02811: & \lim _{x \rightarrow 3^{-}} f(x)=\lim _{x \rightarrow 3^{-}} \sqrt{9-x^{2}}=\sqrt{\lim _{x \rightarrow 3^{-}}\left(9-x^{2}\right)}=0=f(3) \\
L02812: & \lim _{x \rightarrow-3^{+}} f(x)=\lim _{x \rightarrow-3^{+}} \sqrt{9-x^{2}}=\sqrt{\lim _{x \rightarrow-3^{+}}\left(9-x^{2}\right)}=0=f(-3)
L02813: \end{aligned}
L02814: $$
L02816: Thus, $f$ is continuous on the closed interval $[-3,3]$ (Figure 1.5.5).
L02818: ## SOME PROPERTIES OF CONTINUOUS FUNCTIONS
L02820: The following theorem, which is a consequence of Theorem 1.2.2, will enable us to reach conclusions about the continuity of functions that are obtained by adding, subtracting, multiplying, and dividing continuous functions.
L02822: ### 1.5.3 THEOREM If the functions $f$ and $g$ are continuous at $c$, then
L02824: (a) $f+g$ is continuous at $c$.
L02825: (b) $f-g$ is continuous at $c$.
L02826: (c) $f g$ is continuous at $c$.
L02827: (d) $f / g$ is continuous at $c$ if $g(c) \neq 0$ and has a discontinuity at $c$ if $g(c)=0$.
L02829: We will prove part (d). The remaining proofs are similar and will be left to the exercises.
L02831: PROOF First, consider the case where $g(c)=0$. In this case $f(c) / g(c)$ is undefined, so the function $f / g$ has a discontinuity at $c$.
L02833: Next, consider the case where $g(c) \neq 0$. To prove that $f / g$ is continuous at $c$, we must show that
L02835: $$
L02836: \begin{equation*}
L02837: \lim _{x \rightarrow c} \frac{f(x)}{g(x)}=\frac{f(c)}{g(c)} \tag{1}
L02838: \end{equation*}
L02839: $$
L02841: Since $f$ and $g$ are continuous at $c$,
L02843: $$
L02844: \lim _{x \rightarrow c} f(x)=f(c) \quad \text { and } \quad \lim _{x \rightarrow c} g(x)=g(c)
L02845: $$
L02847: Thus, by Theorem 1.2.2(d)
L02849: $$
L02850: \lim _{x \rightarrow c} \frac{f(x)}{g(x)}=\frac{\lim _{x \rightarrow c} f(x)}{\lim _{x \rightarrow c} g(x)}=\frac{f(c)}{g(c)}
L02851: $$
L02853: which proves (1).
L02855: ## CONTINUITY OF POLYNOMIALS AND RATIONAL FUNCTIONS
L02857: The general procedure for showing that a function is continuous everywhere is to show that it is continuous at an arbitrary point. For example, we know from Theorem 1.2.3 that if $p(x)$ is a polynomial and $a$ is any real number, then
L02859: $$
L02860: \lim _{x \rightarrow a} p(x)=p(a)
L02861: $$
L02863: This shows that polynomials are continuous everywhere. Moreover, since rational functions are ratios of polynomials, it follows from part (d) of Theorem 1.5.3 that rational functions are continuous at points other than the zeros of the denominator, and at these zeros they have discontinuities. Thus, we have the following result.
L02865: ### 1.5.4 THEOREM
L02867: (a) A polynomial is continuous everywhere.
L02868: (b) A rational function is continuous at every point where the denominator is nonzero, and has discontinuities at the points where the denominator is zero.
L02870: ## TECHNOLOGY MASTERY
L02872: If you use a graphing utility to generate the graph of the equation in Example 3, there is a good chance you will see the discontinuity at $x=2$ but not at $x=3$. Try it, and explain what you think is happening.
L02874: [FIGURE:489e9c73b7ff2c8e | The graph displays the rational function $y = \frac{x^2 - 9}{x^2 - 5x + 6}$ on a Cartesian coordinate system with $x$ and $y$ axes. The function has a vertical asymptote at $x=2$, indicated by a...]
L02875: △ Figure 1.5.6
L02877: In words, Theorem 1.5.5 states that a limit symbol can be moved through a function sign provided the limit of the expression inside the function sign exists and the function is continuous at this limit.
L02879: Example 3 For what values of $x$ is there a discontinuity in the graph of
L02881: $$
L02882: y=\frac{x^{2}-9}{x^{2}-5 x+6} ?
L02883: $$
L02885: Solution. The function being graphed is a rational function, and hence is continuous at every number where the denominator is nonzero. Solving the equation
L02887: $$
L02888: x^{2}-5 x+6=0
L02889: $$
L02891: yields discontinuities at $x=2$ and at $x=3$ (Figure 1.5.6).
L02893: Example 4 Show that $|x|$ is continuous everywhere (Figure 0.1.9).
L02894: Solution. We can write $|x|$ as
L02896: $$
L02897: |x|=\left\{\begin{array}{rll}
L02898: x & \text { if } & x>0 \\
L02899: 0 & \text { if } & x=0 \\
L02900: -x & \text { if } & x<0
L02901: \end{array}\right.
L02902: $$
L02904: so $|x|$ is the same as the polynomial $x$ on the interval ( $0,+\infty$ ) and is the same as the polynomial $-x$ on the interval $(-\infty, 0)$. But polynomials are continuous everywhere, so $x=0$ is the only possible discontinuity for $|x|$. Since $|0|=0$, to prove the continuity at $x=0$ we must show that
L02906: $$
L02907: \begin{equation*}
L02908: \lim _{x \rightarrow 0}|x|=0 \tag{2}
L02909: \end{equation*}
L02910: $$
L02912: Because the piecewise formula for $|x|$ changes at 0 , it will be helpful to consider the onesided limits at 0 rather than the two-sided limit. We obtain
L02914: $$
L02915: \lim _{x \rightarrow 0^{+}}|x|=\lim _{x \rightarrow 0^{+}} x=0 \quad \text { and } \quad \lim _{x \rightarrow 0^{-}}|x|=\lim _{x \rightarrow 0^{-}}(-x)=0
L02916: $$
L02918: Thus, (2) holds and $|x|$ is continuous at $x=0$.
L02920: ## - CONTINUITY OF COMPOSITIONS
L02922: The following theorem, whose proof is given in Appendix D, will be useful for calculating limits of compositions of functions.
L02924: ### 1.5.5 THEOREM If $\lim _{x \rightarrow c} g(x)=L$ and if the function $f$ is continuous at $L$, then $\lim _{x \rightarrow c} f(g(x))=f(L)$. That is, <br> $$
L02925: \lim _{x \rightarrow c} f(g(x))=f\left(\lim _{x \rightarrow c} g(x)\right)
L02926: $$ <br> This equality remains valid if $\lim _{x \rightarrow c}$ is replaced everywhere by one of $\lim _{x \rightarrow c^{+}}$, $\lim _{x \rightarrow c^{-}}, \lim _{x \rightarrow+\infty}$, or $\lim _{x \rightarrow-\infty}$.
L02928: In the special case of this theorem where $f(x)=|x|$, the fact that $|x|$ is continuous everywhere allows us to write
L02930: $$
L02931: \begin{equation*}
L02932: \lim _{x \rightarrow c}|g(x)|=\left|\lim _{x \rightarrow c} g(x)\right| \tag{3}
L02933: \end{equation*}
L02934: $$
L02936: provided $\lim _{x \rightarrow c} g(x)$ exists. Thus, for example,
L02938: $$
L02939: \lim _{x \rightarrow 3}\left|5-x^{2}\right|=\left|\lim _{x \rightarrow 3}\left(5-x^{2}\right)\right|=|-4|=4
L02940: $$
L02942: Can the absolute value of a function that is not continuous everywhere be continuous everywhere? Justify your answer.
L02944: [FIGURE:fa4fb1afcf2b1634 | The graph displays the function $y = |4 - x^2|$ on a Cartesian coordinate system, showing a "W" shape. The curve is symmetric about the y-axis, with local minima at $(-2, 0)$ and $(2, 0)$, and a...]
L02945: △ Figure 1.5.7
L02947: [FIGURE:130ea6a0f9ac415f | A graph on an $xy$-plane displays a continuous curve $y=f(x)$ over the interval $[a, b)$. The curve connects the point $(a, f(a))$ to $(b, f(b))$. A horizontal line at $y=k$ is drawn such that $f(a)...]
L02948: Figure 1.5.8
L02950: The following theorem is concerned with the continuity of compositions of functions; the first part deals with continuity at a specific number and the second with continuity everywhere.
L02952: ### 1.5.6 THEOREM
L02954: (a) If the function $g$ is continuous at $c$, and the function $f$ is continuous at $g(c)$, then the composition $f \circ g$ is continuous at $c$.
L02955: (b) If the function $g$ is continuous everywhere and the function $f$ is continuous everywhere, then the composition $f \circ g$ is continuous everywhere.
L02957: PROOF We will prove part (a) only; the proof of part (b) can be obtained by applying part (a) at an arbitrary number $c$. To prove that $f \circ g$ is continuous at $c$, we must show that the value of $f \circ g$ and the value of its limit are the same at $x=c$. But this is so, since we can write
L02959: $$
L02960: \begin{gathered}
L02961: \lim _{x \rightarrow c}(f \circ g)(x)=\lim _{x \rightarrow c} f(g(x))=f\left(\lim _{x \rightarrow c} g(x)\right)=f(g(c))=(f \circ g)(c) \\
L02962: \text { Theorem 1.5.5 } g \text { is continuous at } c .
L02963: \end{gathered}
L02964: $$
L02966: We know from Example 4 that the function $|x|$ is continuous everywhere. Thus, if $g(x)$ is continuous at $c$, then by part (a) of Theorem 1.5.6, the function $|g(x)|$ must also be continuous at $c$; and, more generally, if $g(x)$ is continuous everywhere, then so is $|g(x)|$. Stated informally:
L02968: The absolute value of a continuous function is continuous.
L02970: For example, the polynomial $g(x)=4-x^{2}$ is continuous everywhere, so we can conclude that the function $\left|4-x^{2}\right|$ is also continuous everywhere (Figure 1.5.7).
L02972: ## THE INTERMEDIATE-VALUE THEOREM
L02974: Figure 1.5.8 shows the graph of a function that is continuous on the closed interval $[a, b]$. The figure suggests that if we draw any horizontal line $y=k$, where $k$ is between $f(a)$ and $f(b)$, then that line will cross the curve $y=f(x)$ at least once over the interval $[a, b]$. Stated in numerical terms, if $f$ is continuous on $[a, b]$, then the function $f$ must take on every value $k$ between $f(a)$ and $f(b)$ at least once as $x$ varies from $a$ to $b$. For example, the polynomial $p(x)=x^{5}-x+3$ has a value of 3 at $x=1$ and a value of 33 at $x=2$. Thus, it follows from the continuity of $p$ that the equation $x^{5}-x+3=k$ has at least one solution in the interval $[1,2]$ for every value of $k$ between 3 and 33 . This idea is stated more precisely in the following theorem.
L02976: ### 1.5.7 THEOREM (Intermediate-Value Theorem) If $f$ is continuous on a closed interval $[a, b]$ and $k$ is any number between $f(a)$ and $f(b)$, inclusive, then there is at least one number $x$ in the interval $[a, b]$ such that $f(x)=k$.
L02978: Although this theorem is intuitively obvious, its proof depends on a mathematically precise development of the real number system, which is beyond the scope of this text.
L02980: ## APPROXIMATING ROOTS USING THE INTERMEDIATE-VALUE THEOREM
L02982: [FIGURE:5ea34ea08d81bc20 | A graph on an $xy$-plane displays a continuous function $y = f(x)$. At $x=a$, the function value $f(a)$ is positive, and at $x=b$, the function value $f(b)$ is negative. The curve connects these...]
L02983: △ Figure 1.5.9
L02985: [FIGURE:93cbe6836acca3c3 | The graph shows the curve of the function $y = x^3 - x - 1$ on a Cartesian coordinate system. The continuous curve passes through the y-axis at $(0, -1)$, exhibits a local maximum for negative $x$...]
L02986: \$ Figure 1.5.10
L02988: A variety of problems can be reduced to solving an equation $f(x)=0$ for its roots. Sometimes it is possible to solve for the roots exactly using algebra, but often this is not possible and one must settle for decimal approximations of the roots. One procedure for approximating roots is based on the following consequence of the Intermediate-Value Theorem.
L02990: ### 1.5.8 THEOREM If $f$ is continuous on $[a, b]$, and if $f(a)$ and $f(b)$ are nonzero and have opposite signs, then there is at least one solution of the equation $f(x)=0$ in the interval ( $a, b$ ).
L02992: This result, which is illustrated in Figure 1.5.9, can be proved as follows.
L02993: proof Since $f(a)$ and $f(b)$ have opposite signs, 0 is between $f(a)$ and $f(b)$. Thus, by the Intermediate-Value Theorem there is at least one number $x$ in the interval $[a, b]$ such that $f(x)=0$. However, $f(a)$ and $f(b)$ are nonzero, so $x$ must lie in the interval $(a, b)$, which completes the proof.
L02995: Before we illustrate how this theorem can be used to approximate roots, it will be helpful to discuss some standard terminology for describing errors in approximations. If $x$ is an approximation to a quantity $x_{0}$, then we call
L02997: $$
L02998: \epsilon=\left|x-x_{0}\right|
L02999: $$
L03001: the absolute error or (less precisely) the error in the approximation. The terminology in Table 1.5.1 is used to describe the size of such errors.
L03003: Table 1.5.1
L03004: | ERROR | DESCRIPTION |
L03005: | :--- | :--- |
L03006: | $\left\|x-x_{0}\right\| \leq 0.1$ | $x$ approximates $x_{0}$ with an error of at most 0.1 . |
L03007: | $\left\|x-x_{0}\right\| \leq 0.01$ | $x$ approximates $x_{0}$ with an error of at most 0.01 . |
L03008: | $\left\|x-x_{0}\right\| \leq 0.001$ | $x$ approximates $x_{0}$ with an error of at most 0.001 . |
L03009: | $\left\|x-x_{0}\right\| \leq 0.0001$ | $x$ approximates $x_{0}$ with an error of at most 0.0001 . |
L03010: | $\left\|x-x_{0}\right\| \leq 0.5$ | $x$ approximates $x_{0}$ to the nearest integer. |
L03011: | $\left\|x-x_{0}\right\| \leq 0.05$ | $x$ approximates $x_{0}$ to 1 decimal place (i.e., to the nearest tenth). |
L03012: | $\left\|x-x_{0}\right\| \leq 0.005$ | $x$ approximates $x_{0}$ to 2 decimal places (i.e., to the nearest hundredth). |
L03013: | $\left\|x-x_{0}\right\| \leq 0.0005$ | $x$ approximates $x_{0}$ to 3 decimal places (i.e., to the nearest thousandth). |
L03016: Example 5 The equation
L03018: $$
L03019: x^{3}-x-1=0
L03020: $$
L03022: cannot be solved algebraically very easily because the left side has no simple factors. However, if we graph $p(x)=x^{3}-x-1$ with a graphing utility (Figure 1.5.10), then we are led to conjecture that there is one real root and that this root lies inside the interval $[1,2]$. The existence of a root in this interval is also confirmed by Theorem 1.5.8, since $p(1)=-1$ and $p(2)=5$ have opposite signs. Approximate this root to two decimal-place accuracy.
L03024: Solution. Our objective is to approximate the unknown root $x_{0}$ with an error of at most 0.005 . It follows that if we can find an interval of length 0.01 that contains the root, then the midpoint of that interval will approximate the root with an error of at most $\frac{1}{2}(0.01)=0.005$, which will achieve the desired accuracy.
L03026: We know that the root $x_{0}$ lies in the interval $[1,2]$. However, this interval has length 1 , which is too large. We can pinpoint the location of the root more precisely by dividing the interval $[1,2]$ into 10 equal parts and evaluating $p$ at the points of subdivision using a calculating utility (Table 1.5.2). In this table $p(1.3)$ and $p(1.4)$ have opposite signs, so we know that the root lies in the interval [1.3,1.4]. This interval has length 0.1 , which is still too large, so we repeat the process by dividing the interval [1.3,1.4] into 10 parts and evaluating $p$ at the points of subdivision; this yields Table 1.5.3, which tells us that the root is inside the interval [1.32, 1.33] (Figure 1.5.11). Since this interval has length 0.01, its midpoint 1.325 will approximate the root with an error of at most 0.005 . Thus, $x_{0} \approx 1.325$ to two decimal-place accuracy.
L03028: Table 1.5.2
L03029: | $x$ | 1 | 1.1 | 1.2 | 1.3 | 1.4 | 1.5 | 1.6 | 1.7 | 1.8 | 1.9 | 2 |
L03030: | :---: | ---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
L03031: | $p(x)$ | -1 | -0.77 | -0.47 | -0.10 | 0.34 | 0.88 | 1.50 | 2.21 | 3.03 | 3.96 | 5 |
L03034: [FIGURE:19b74244f49fd8fe | A graph shows the function $y = p(x) = x^3 - x - 1$ in a highly zoomed-in view. The x-axis is labeled 'x' and ranges from approximately 1.322 to 1.330, while the y-axis is labeled 'y' and ranges from...]
L03035: △ Figure 1.5.11
L03037: Table 1.5.3
L03038: | $x$ | 1.3 | 1.31 | 1.32 | 1.33 | 1.34 | 1.35 | 1.36 | 1.37 | 1.38 | 1.39 | 1.4 |
L03039: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
L03040: | $p(x)$ | -0.103 | -0.062 | -0.020 | 0.023 | 0.066 | 0.110 | 0.155 | 0.201 | 0.248 | 0.296 | 0.344 |
