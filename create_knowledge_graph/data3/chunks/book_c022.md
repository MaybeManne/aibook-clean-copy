L07580: 33-34 These exercises deal with the rotated ellipse $C$ whose equation is $x^{2}-x y+y^{2}=4$.
L07581: 33. Show that the line $y=x$ intersects $C$ at two points $P$ and $Q$ and that the tangent lines to $C$ at $P$ and $Q$ are parallel.
L07582: 34. Prove that if $P(a, b)$ is a point on $C$, then so is $Q(-a,-b)$ and that the tangent lines to $C$ through $P$ and through $Q$ are parallel.
L07583: 35. Find the values of $a$ and $b$ for the curve $x^{2} y+a y^{2}=b$ if the point ( 1,1 ) is on its graph and the tangent line at ( 1,1 ) has the equation $4 x+3 y=7$.
L07584: 36. At what point(s) is the tangent line to the curve $y^{3}=2 x^{2}$ perpendicular to the line $x+2 y-2=0$ ?
L07586: 37-38 Two curves are said to be orthogonal if their tangent lines are perpendicular at each point of intersection, and two families of curves are said to be orthogonal trajectories of one another if each member of one family is orthogonal to each member of the other family. This terminology is used in these exercises.
L07587: 37. The accompanying figure shows some typical members of the families of circles $x^{2}+(y-c)^{2}=c^{2}$ (black curves) and $(x-k)^{2}+y^{2}=k^{2}$ (gray curves). Show that these families are orthogonal trajectories of one another. [Hint: For the tangent lines to be perpendicular at a point of intersection, the slopes of those tangent lines must be negative reciprocals of one another.]
L07588: 38. The accompanying figure shows some typical members of the families of hyperbolas $x y=c$ (black curves) and $x^{2}-y^{2}=k$ (gray curves), where $c \neq 0$ and $k \neq 0$. Use the hint in Exercise 37 to show that these families are orthogonal trajectories of one another.
L07589: c 39. (a) Use the implicit plotting capability of a CAS to graph the curve $C$ whose equation is $x^{3}-2 x y+y^{3}=0$.
L07590: (b) Use the graph in part (a) to estimate the $x$-coordinates of a point in the first quadrant that is on $C$ and at which the tangent line to $C$ is parallel to the $x$-axis.
L07591: (c) Find the exact value of the $x$-coordinate in part (b).
L07592: c 40. (a) Use the implicit plotting capability of a CAS to graph the curve $C$ whose equation is $x^{3}-2 x y+y^{3}=0$.
L07593: (b) Use the graph to guess the coordinates of a point in the first quadrant that is on $C$ and at which the tangent line to $C$ is parallel to the line $y=-x$.
L07594: (cont.)
L07595: (c) Use implicit differentiation to verify your conjecture in part (b).
L07596: 41. Prove that for every nonzero rational number $r$, the tangent line to the graph of $x^{r}+y^{r}=2$ at the point $(1,1)$ has slope -1 .
L07597: 42. Find equations for two lines through the origin that are tangent to the ellipse $2 x^{2}-4 x+y^{2}+1=0$.
L07598: 43. Writing Write a paragraph that compares the concept of an explicit definition of a function with that of an implicit definition of a function.
L07599: 44. Writing A student asks: "Suppose implicit differentiation yields an undefined expression at a point. Does this mean that $d y / d x$ is undefined at that point?" Using the equation $x^{2}-2 x y+y^{2}=0$ as a basis for your discussion, write a paragraph that answers the student's question.
L07601: ## QUICK CHECK ANSWERS 3.1
L07603: 1. $\frac{1}{x+2}$
L07604: 2. $\frac{d y}{d x}=\frac{2 x-y}{x+3 y^{2}}$
L07605: 3. -1
L07606: 4. $\frac{d^{2} y}{d x^{2}}=\sec ^{2} y \tan y$
L07608: ### 3.2 DERIVATIVES OF LOGARITHMIC FUNCTIONS
L07610: In this section we will obtain derivative formulas for logarithmic functions, and we will explain why the natural logarithm function is preferred over logarithms with other bases in calculus.
L07612: ## DERIVATIVES OF LOGARITHMIC FUNCTIONS
L07614: We will establish that $f(x)=\ln x$ is differentiable for $x>0$ by applying the derivative definition to $f(x)$. To evaluate the resulting limit, we will need the fact that $\ln x$ is continuous for $x>0$ (Theorem 1.6.3), and we will need the limit
L07616: $$
L07617: \begin{equation*}
L07618: \lim _{v \rightarrow 0}(1+v)^{1 / v}=e \tag{1}
L07619: \end{equation*}
L07620: $$
L07622: This limit can be obtained from limits (7) and (8) of Section 1.3 by making the substitution $v=1 / x$ and using the fact that $v \rightarrow 0^{+}$as $x \rightarrow+\infty$ and $v \rightarrow 0^{-}$as $x \rightarrow-\infty$. This produces two equal one-sided limits that together imply (1) (see Exercise 64 of Section 1.3).
L07624: $$
L07625: \begin{array}{rlr}
L07626: \frac{d}{d x}[\ln x] & =\lim _{h \rightarrow 0} \frac{\ln (x+h)-\ln x}{h} & \\
L07627: & =\lim _{h \rightarrow 0} \frac{1}{h} \ln \left(\frac{x+h}{x}\right) & \begin{array}{l}
L07628: \text { The quotient property of } \\
L07629: \text { logarithms in Theorem 0.5.2 }
L07630: \end{array} \\
L07631: & =\lim _{h \rightarrow 0} \frac{1}{h} \ln \left(1+\frac{h}{x}\right) \\
L07632: & =\lim _{v \rightarrow 0} \frac{1}{v x} \ln (1+v) & \\
L07633: & =\frac{1}{x} \lim _{v \rightarrow 0} \frac{1}{v} \ln (1+v) & \begin{array}{l}
L07634: \text { Let } v=h / x \text { and note that } \\
L07635: v \rightarrow 0 \text { if and only if } h \rightarrow 0 .
L07636: \end{array} \\
L07637: & =\frac{1}{x} \lim _{v \rightarrow 0} \ln (1+v)^{1 / v} & \begin{array}{l}
L07638: x \text { is fixed in this limit computation, so } 1 / x \\
L07639: \text { can be moved through the limit sign. }
L07640: \end{array} \\
L07641: & =\frac{1}{x} \ln \left[\lim _{v \rightarrow 0}(1+v)^{1 / v}\right] & \begin{array}{l}
L07642: \text { The power property of } \\
L07643: \text { logarithms in Theorem 0.5.2 }
L07644: \end{array} \\
L07645: & =\frac{1}{x} \ln e & \begin{array}{l}
L07646: \ln x \text { is continuous on }(0,+\infty) \text { so we can } \\
L07647: \text { move the limit through the function symbol. }
L07648: \end{array} \\
L07649: & =\frac{1}{x} & \\
L07650: \text { Since ln } e=1
L07651: \end{array}
L07652: $$
L07654: Note that, among all possible bases, the base $b=e$ produces the simplest formula for the derivative of $\log _{b} x$. This is one of the reasons why the natural logarithm function is preferred over other logarithms in calculus.
L07656: Thus,
L07658: $$
L07659: \begin{equation*}
L07660: \frac{d}{d x}[\ln x]=\frac{1}{x}, \quad x>0 \tag{2}
L07661: \end{equation*}
L07662: $$
L07664: A derivative formula for the general logarithmic function $\log _{b} x$ can be obtained from (2) by using Formula (6) of Section 0.5 to write
L07666: $$
L07667: \frac{d}{d x}\left[\log _{b} x\right]=\frac{d}{d x}\left[\frac{\ln x}{\ln b}\right]=\frac{1}{\ln b} \frac{d}{d x}[\ln x]
L07668: $$
L07670: It follows from this that
L07672: $$
L07673: \begin{equation*}
L07674: \frac{d}{d x}\left[\log _{b} x\right]=\frac{1}{x \ln b}, \quad x>0 \tag{3}
L07675: \end{equation*}
L07676: $$
L07678: ## Example 1
L07680: (a) Figure 3.2.1 shows the graph of $y=\ln x$ and its tangent lines at the points $x=\frac{1}{2}, 1,3$, and 5 . Find the slopes of those tangent lines.
L07681: (b) Does the graph of $y=\ln x$ have any horizontal tangent lines? Use the derivative of $\ln x$ to justify your answer.
L07683: Solution (a). From (2), the slopes of the tangent lines at the points $x=\frac{1}{2}, 1,3$, and 5 are $1 / x=2,1, \frac{1}{3}$, and $\frac{1}{5}$, respectively, which is consistent with Figure 3.2.1.
L07685: Solution (b). It does not appear from the graph of $y=\ln x$ that there are any horizontal tangent lines. This is confirmed by the fact that $d y / d x=1 / x$ is not equal to zero for any real value of $x$.
L07687: If $u$ is a differentiable function of $x$, and if $u(x)>0$, then applying the chain rule to (2) and (3) produces the following generalized derivative formulas:
L07689: $$
L07690: \begin{equation*}
L07691: \frac{d}{d x}[\ln u]=\frac{1}{u} \cdot \frac{d u}{d x} \quad \text { and } \quad \frac{d}{d x}\left[\log _{b} u\right]=\frac{1}{u \ln b} \cdot \frac{d u}{d x} \tag{4-5}
L07692: \end{equation*}
L07693: $$
L07695: - Example 2 Find $\frac{d}{d x}\left[\ln \left(x^{2}+1\right)\right]$.
L07697: Solution. Using (4) with $u=x^{2}+1$ we obtain
L07699: $$
L07700: \frac{d}{d x}\left[\ln \left(x^{2}+1\right)\right]=\frac{1}{x^{2}+1} \cdot \frac{d}{d x}\left[x^{2}+1\right]=\frac{1}{x^{2}+1} \cdot 2 x=\frac{2 x}{x^{2}+1}
L07701: $$
L07703: When possible, the properties of logarithms in Theorem 0.5.2 should be used to convert products, quotients, and exponents into sums, differences, and constant multiples before differentiating a function involving logarithms.
L07705: ## - Example 3
L07707: $$
L07708: \begin{aligned}
L07709: \frac{d}{d x}\left[\ln \left(\frac{x^{2} \sin x}{\sqrt{1+x}}\right)\right] & =\frac{d}{d x}\left[2 \ln x+\ln (\sin x)-\frac{1}{2} \ln (1+x)\right] \\
L07710: & =\frac{2}{x}+\frac{\cos x}{\sin x}-\frac{1}{2(1+x)} \\
L07711: & =\frac{2}{x}+\cot x-\frac{1}{2+2 x}
L07712: \end{aligned}
L07713: $$
L07715: Figure 3.2.2 shows the graph of $f(x)=\ln |x|$. This function is important because it "extends" the domain of the natural logarithm function in the sense that the values of $\ln |x|$ and $\ln x$ are the same for $x>0$, but $\ln |x|$ is defined for all nonzero values of $x$, and $\ln x$ is only defined for positive values of $x$.
L07717: Figure 3.2.2
L07718: [FIGURE:596733232031b01d | A Cartesian coordinate system shows the graph of the function $y = \ln |x|$. The graph consists of two branches, symmetric with respect to the y-axis. The left branch, colored purple, is in the...]
L07720: The derivative of $\ln |x|$ for $x \neq 0$ can be obtained by considering the cases $x>0$ and $x<0$ separately:
L07722: Case $\boldsymbol{x}>\mathbf{0}$. In this case $|x|=x$, so
L07724: $$
L07725: \frac{d}{d x}[\ln |x|]=\frac{d}{d x}[\ln x]=\frac{1}{x}
L07726: $$
L07728: Case $\boldsymbol{x}<\mathbf{0}$. In this case $|x|=-x$, so it follows from (4) that
L07730: $$
L07731: \frac{d}{d x}[\ln |x|]=\frac{d}{d x}[\ln (-x)]=\frac{1}{(-x)} \cdot \frac{d}{d x}[-x]=\frac{1}{x}
L07732: $$
L07734: Since the same formula results in both cases, we have shown that
L07736: $$
L07737: \begin{equation*}
L07738: \frac{d}{d x}[\ln |x|]=\frac{1}{x} \quad \text { if } x \neq 0 \tag{6}
L07739: \end{equation*}
L07740: $$
L07742: Example 4 From (6) and the chain rule,
L07744: $$
L07745: \frac{d}{d x}[\ln |\sin x|]=\frac{1}{\sin x} \cdot \frac{d}{d x}[\sin x]=\frac{\cos x}{\sin x}=\cot x
L07746: $$
L07748: ## LOGARITHMIC DIFFERENTIATION
L07750: We now consider a technique called logarithmic differentiation that is useful for differentiating functions that are composed of products, quotients, and powers.
L07752: Example 5 The derivative of
L07754: $$
L07755: \begin{equation*}
L07756: y=\frac{x^{2} \sqrt[3]{7 x-14}}{\left(1+x^{2}\right)^{4}} \tag{7}
L07757: \end{equation*}
L07758: $$
L07760: is messy to calculate directly. However, if we first take the natural logarithm of both sides and then use its properties, we can write
L07762: $$
L07763: \ln y=2 \ln x+\frac{1}{3} \ln (7 x-14)-4 \ln \left(1+x^{2}\right)
L07764: $$
L07766: Differentiating both sides with respect to $x$ yields
L07768: $$
L07769: \frac{1}{y} \frac{d y}{d x}=\frac{2}{x}+\frac{7 / 3}{7 x-14}-\frac{8 x}{1+x^{2}}
L07770: $$
L07772: In the next section we will discuss differentiating functions that have exponents which are not constant.
L07774: Thus, on solving for $d y / d x$ and using (7) we obtain
L07776: $$
L07777: \frac{d y}{d x}=\frac{x^{2} \sqrt[3]{7 x-14}}{\left(1+x^{2}\right)^{4}}\left[\frac{2}{x}+\frac{1}{3 x-6}-\frac{8 x}{1+x^{2}}\right]
L07778: $$
L07780: ## REMARK
L07782: Since $\ln y$ is only defined for $y>0$, the computations in Example 5 are only valid for $x>2$ (verify). However, because the derivative of $\ln y$ is the same as the derivative of $\ln |y|$, and because $\ln |y|$ is defined for $y<0$ as well as $y>0$, it follows that the formula obtained for $d y / d x$ is valid for $x<2$ as well as $x>2$. In general, whenever a derivative $d y / d x$ is obtained by logarithmic differentiation, the resulting derivative formula will be valid for all values of $x$ for which $y \neq 0$. It may be valid at those points as well, but it is not guaranteed.
L07784: ## DERIVATIVES OF REAL POWERS OF $\boldsymbol{x}$
L07786: We know from Theorem 2.3.2 and Exercise 82 in Section 2.3 that the differentiation formula
L07788: $$
L07789: \begin{equation*}
L07790: \frac{d}{d x}\left[x^{r}\right]=r x^{r-1} \tag{8}
L07791: \end{equation*}
L07792: $$
L07794: holds for constant integer values of $r$. We will now use logarithmic differentiation to show that this formula holds if $r$ is any real number (rational or irrational). In our computations we will assume that $x^{r}$ is a differentiable function and that the familiar laws of exponents hold for real exponents.
L07796: Let $y=x^{r}$, where $r$ is a real number. The derivative $d y / d x$ can be obtained by logarithmic differentiation as follows:
L07798: $$
L07799: \begin{aligned}
L07800: & \ln |y|=\ln \left|x^{r}\right|=r \ln |x| \\
L07801: & \frac{d}{d x}[\ln |y|]=\frac{d}{d x}[r \ln |x|] \\
L07802: & \frac{1}{y} \frac{d y}{d x}=\frac{r}{x} \\
L07803: & \frac{d y}{d x}=\frac{r}{x} y=\frac{r}{x} x^{r}=r x^{r-1}
L07804: \end{aligned}
L07805: $$
L07807: ## QUICK CHECK EXERCISES 3.2 (See page 196 for answers.)
L07809: 1. The equation of the tangent line to the graph of $y=\ln x$ at $x=e^{2}$ is $\_\_\_\_$ .
L07810: 2. Find $d y / d x$.
L07811: (a) $y=\ln 3 x$
L07812: (b) $y=\ln \sqrt{x}$
L07813: (c) $y=\log (1 /|x|)$
L07814: 3. $\lim _{h \rightarrow 0} \frac{\ln (1+h)}{h}=$ $\_\_\_\_$
L07815: 4. Use logarithmic differentiation to find the derivative of
L07817: $$
L07818: f(x)=\frac{\sqrt{x+1}}{\sqrt[3]{x-1}}
L07819: $$
L07821: $\_\_\_\_$
L07823: ## EXERCISE SET 3.2
L07825: 1-26 Find $d y / d x$.
L07827: 1. $y=\ln 5 x$
L07828: 2. $y=\ln \frac{x}{3}$
L07829: 3. $y=\ln |1+x|$
L07830: 4. $y=\ln (2+\sqrt{x})$
L07831: 5. $y=\ln \left|x^{2}-1\right|$
L07832: 6. $y=\ln \left|x^{3}-7 x^{2}-3\right|$
L07833: 7. $y=\ln \left(\frac{x}{1+x^{2}}\right)$
L07834: 8. $y=\ln \left|\frac{1+x}{1-x}\right|$
L07835: 9. $y=\ln x^{2}$
L07836: 10. $y=(\ln x)^{3}$
L07837: 11. $y=\sqrt{\ln x}$
L07838: 12. $y=\ln \sqrt{x}$
L07839: 13. $y=x \ln x$
L07840: 14. $y=x^{3} \ln x$
L07841: 15. $y=x^{2} \log _{2}(3-2 x)$
L07842: 16. $y=x\left[\log _{2}\left(x^{2}-2 x\right)\right]^{3}$
L07843: 17. $y=\frac{x^{2}}{1+\log x}$
L07844: 18. $y=\frac{\log x}{1+\log x}$
L07845: 19. $y=\ln (\ln x)$
L07846: 20. $y=\ln (\ln (\ln x))$
L07847: 21. $y=\ln (\tan x)$
L07848: 22. $y=\ln (\cos x)$
L07849: 23. $y=\cos (\ln x)$
L07850: 24. $y=\sin ^{2}(\ln x)$
L07851: 25. $y=\log \left(\sin ^{2} x\right)$
L07852: 26. $y=\log \left(1-\sin ^{2} x\right)$
L07854: 27-30 Use the method of Example 3 to help perform the indicated differentiation.
L07855: 27. $\frac{d}{d x}\left[\ln \left((x-1)^{3}\left(x^{2}+1\right)^{4}\right)\right]$
L07856: 28. $\frac{d}{d x}\left[\ln \left(\left(\cos ^{2} x\right) \sqrt{1+x^{4}}\right)\right]$
L07857: 29. $\frac{d}{d x}\left[\ln \frac{\cos x}{\sqrt{4-3 x^{2}}}\right]$
L07858: 30. $\frac{d}{d x}\left[\ln \sqrt{\frac{x-1}{x+1}}\right]$
L07860: 31-34 True-False Determine whether the statement is true or false. Explain your answer.
L07861: 31. The slope of the tangent line to the graph of $y=\ln x$ at $x=a$ approaches infinity as $a \rightarrow 0^{+}$.
L07862: 32. If $\lim _{x \rightarrow+\infty} f^{\prime}(x)=0$, then the graph of $y=f(x)$ has a horizontal asymptote.
L07863: 33. The derivative of $\ln |x|$ is an odd function.
L07864: 34. We have
L07866: $$
L07867: \frac{d}{d x}\left((\ln x)^{2}\right)=\frac{d}{d x}(2(\ln x))=\frac{2}{x}
L07868: $$
L07870: 35-38 Find $d y / d x$ using logarithmic differentiation.
L07871: 35. $y=x \sqrt[3]{1+x^{2}}$
L07872: 36. $y=\sqrt[5]{\frac{x-1}{x+1}}$
L07873: 37. $y=\frac{\left(x^{2}-8\right)^{1 / 3} \sqrt{x^{3}+1}}{x^{6}-7 x+5}$
L07874: 38. $y=\frac{\sin x \cos x \tan ^{3} x}{\sqrt{x}}$
L07875: 39. Find
L07876: (a) $\frac{d}{d x}\left[\log _{x} e\right]$
L07877: (b) $\frac{d}{d x}\left[\log _{x} 2\right]$.
L07878: 40. Find
L07879: (a) $\frac{d}{d x}\left[\log _{(1 / x)} e\right]$
L07880: (b) $\frac{d}{d x}\left[\log _{(\ln x)} e\right]$.
L07882: 41-44 Find the equation of the tangent line to the graph of $y=f(x)$ at $x=x_{0}$.
L07883: 41. $f(x)=\ln x ; x_{0}=e^{-1}$
L07884: 42. $f(x)=\log x ; x_{0}=10$
L07885: 43. $f(x)=\ln (-x) ; x_{0}=-e$
L07886: 44. $f(x)=\ln |x| ; x_{0}=-2$
L07888: ## FOCUS ON CONCEPTS
L07890: 45. (a) Find the equation of a line through the origin that is tangent to the graph of $y=\ln x$.
L07891: (b) Explain why the $y$-intercept of a tangent line to the curve $y=\ln x$ must be 1 unit less than the $y$-coordinate of the point of tangency.
L07892: 46. Use logarithmic differentiation to verify the product and quotient rules. Explain what properties of $\ln x$ are important for this verification.
L07893: 47. Find a formula for the area $A(w)$ of the triangle bounded by the tangent line to the graph of $y=\ln x$ at $P(w, \ln w)$, the horizontal line through $P$, and the $y$-axis.
L07894: 48. Find a formula for the area $A(w)$ of the triangle bounded by the tangent line to the graph of $y=\ln x^{2}$ at $P\left(w, \ln w^{2}\right)$, the horizontal line through $P$, and the $y$-axis.
L07895: 49. Verify that $y=\ln (x+e)$ satisfies $d y / d x=e^{-y}$, with $y=1$ when $x=0$.
L07896: 50. Verify that $y=-\ln \left(e^{2}-x\right)$ satisfies $d y / d x=e^{y}$, with $y=-2$ when $x=0$.
L07897: 51. Find a function $f$ such that $y=f(x)$ satisfies $d y / d x=e^{-y}$, with $y=0$ when $x=0$.
L07898: 52. Find a function $f$ such that $y=f(x)$ satisfies $d y / d x=e^{y}$, with $y=-\ln 2$ when $x=0$.
L07900: 53-55 Find the limit by interpreting the expression as an appropriate derivative.
L07901: 53. (a) $\lim _{x \rightarrow 0} \frac{\ln (1+3 x)}{x} \quad$ (b) $\lim _{x \rightarrow 0} \frac{\ln (1-5 x)}{x}$
L07902: 54. (a) $\lim _{\Delta x \rightarrow 0} \frac{\ln \left(e^{2}+\Delta x\right)-2}{\Delta x}$ (b) $\lim _{w \rightarrow 1} \frac{\ln w}{w-1}$
L07903: 55. (a) $\lim _{x \rightarrow 0} \frac{\ln (\cos x)}{x} \quad$ (b) $\lim _{h \rightarrow 0} \frac{(1+h)^{\sqrt{2}}-1}{h}$
L07904: 56. Modify the derivation of Equation (2) to give another proof of Equation (3).
L07905: 57. Writing Review the derivation of the formula
L07907: $$
L07908: \frac{d}{d x}[\ln x]=\frac{1}{x}
L07909: $$
L07911: and then write a paragraph that discusses all the ingredients (theorems, limit properties, etc.) that are needed for this derivation.
L07912: 58. Writing Write a paragraph that explains how logarithmic differentiation can replace a difficult differentiation computation with a simpler computation.
L07914: ## QUICK CHECK ANSWERS 3.2
L07916: 1. $y=\frac{x}{e^{2}}+1$
L07917: 2. (a) $\frac{d y}{d x}=\frac{1}{x}$
L07918: (b) $\frac{d y}{d x}=\frac{1}{2 x}$
L07919: (c) $\frac{d y}{d x}=-\frac{1}{x \ln 10}$
L07920: 3. $\frac{\sqrt{x+1}}{\sqrt[3]{x-1}}\left[\frac{1}{2(x+1)}-\frac{1}{3(x-1)}\right]$
L07921: 4. 1
