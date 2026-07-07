L05796: $$
L05797: \frac{d}{d x}\left[\frac{1}{x^{m}}\right]=-m x^{m-1} \cdot \frac{1}{x^{2 m}}
L05798: $$
L05800: and conclude that $f^{\prime}(x)=n x^{n-1}$.
L05802: ## QUICK CHECK ANSWERS 2.3
L05804: 1. (a) 0
L05805: (b) $\sqrt{6}$
L05806: (c) $3 / \sqrt{x}$
L05807: (d) $\sqrt{6} /(2 \sqrt{x})$
L05808: 2. (a) $3 x^{2}$
L05809: (b) $5 x^{4}+10 x$
L05810: (c) $\frac{3}{2} x^{2}$
L05811: (d) $1-10 x^{-3}$
L05812: 3. 6
L05813: 4. $18 x-6$
L05815: ### 2.4 THE PRODUCT AND QUOTIENT RULES
L05817: In this section we will develop techniques for differentiating products and quotients of functions whose derivatives are known.
L05819: ## DERIVATIVE OF A PRODUCT
L05821: You might be tempted to conjecture that the derivative of a product of two functions is the product of their derivatives. However, a simple example will show this to be false. Consider the functions
L05823: $$
L05824: f(x)=x \quad \text { and } \quad g(x)=x^{2}
L05825: $$
L05827: The product of their derivatives is
L05829: $$
L05830: f^{\prime}(x) g^{\prime}(x)=(1)(2 x)=2 x
L05831: $$
L05833: Formula (1) can also be expressed as $(f \cdot g)^{\prime}=f \cdot g^{\prime}+g \cdot f^{\prime}$
L05834: but their product is $h(x)=f(x) g(x)=x^{3}$, so the derivative of the product is
L05836: $$
L05837: h^{\prime}(x)=3 x^{2}
L05838: $$
L05840: Thus, the derivative of the product is not equal to the product of the derivatives. The correct relationship, which is credited to Leibniz, is given by the following theorem.
L05841: 2.4.1 THEOREM (The Product Rule) If $f$ and $g$ are differentiable at $x$, then so is the product $f \cdot g$, and
L05843: $$
L05844: \begin{equation*}
L05845: \frac{d}{d x}[f(x) g(x)]=f(x) \frac{d}{d x}[g(x)]+g(x) \frac{d}{d x}[f(x)] \tag{1}
L05846: \end{equation*}
L05847: $$
L05849: PROOF Whereas the proofs of the derivative rules in the last section were straightforward applications of the derivative definition, a key step in this proof involves adding and subtracting the quantity $f(x+h) g(x)$ to the numerator in the derivative definition. This yields
L05851: $$
L05852: \begin{aligned}
L05853: \frac{d}{d x}[f(x) g(x)] & =\lim _{h \rightarrow 0} \frac{f(x+h) \cdot g(x+h)-f(x) \cdot g(x)}{h} \\
L05854: & =\lim _{h \rightarrow 0} \frac{f(x+h) g(x+h)-f(x+h) g(x)+f(x+h) g(x)-f(x) g(x)}{h} \\
L05855: & =\lim _{h \rightarrow 0}\left[f(x+h) \cdot \frac{g(x+h)-g(x)}{h}+g(x) \cdot \frac{f(x+h)-f(x)}{h}\right] \\
L05856: & =\lim _{h \rightarrow 0} f(x+h) \cdot \lim _{h \rightarrow 0} \frac{g(x+h)-g(x)}{h}+\lim _{h \rightarrow 0} g(x) \cdot \lim _{h \rightarrow 0} \frac{f(x+h)-f(x)}{h} \\
L05857: & =\left[\lim _{h \rightarrow 0} f(x+h)\right] \frac{d}{d x}[g(x)]+\left[\lim _{h \rightarrow 0} g(x)\right] \frac{d}{d x}[f(x)] \\
L05858: & =f(x) \frac{d}{d x}[g(x)]+g(x) \frac{d}{d x}[f(x)]
L05859: \end{aligned}
L05860: $$
L05862: [Note: In the last step $f(x+h) \rightarrow f(x)$ as $h \rightarrow 0$ because $f$ is continuous at $x$ by Theorem 2.2.3. Also, $g(x) \rightarrow g(x)$ as $h \rightarrow 0$ because $g(x)$ does not involve $h$ and hence is treated as constant for the limit.]
L05864: In words, the derivative of a product of two functions is the first function times the derivative of the second plus the second function times the derivative of the first.
L05866: Example 1 Find $d y / d x$ if $y=\left(4 x^{2}-1\right)\left(7 x^{3}+x\right)$.
L05867: Solution. There are two methods that can be used to find $d y / d x$. We can either use the product rule or we can multiply out the factors in $y$ and then differentiate. We will give both methods.
L05869: Formula (2) can also be expressed as
L05871: $$
L05872: \left(\frac{f}{g}\right)^{\prime}=\frac{g \cdot f^{\prime}-f \cdot g^{\prime}}{g^{2}}
L05873: $$
L05875: Method 1. (Using the Product Rule)
L05877: $$
L05878: \begin{aligned}
L05879: \frac{d y}{d x} & =\frac{d}{d x}\left[\left(4 x^{2}-1\right)\left(7 x^{3}+x\right)\right] \\
L05880: & =\left(4 x^{2}-1\right) \frac{d}{d x}\left[7 x^{3}+x\right]+\left(7 x^{3}+x\right) \frac{d}{d x}\left[4 x^{2}-1\right] \\
L05881: & =\left(4 x^{2}-1\right)\left(21 x^{2}+1\right)+\left(7 x^{3}+x\right)(8 x)=140 x^{4}-9 x^{2}-1
L05882: \end{aligned}
L05883: $$
L05885: Method 2. (Multiplying First)
L05887: $$
L05888: y=\left(4 x^{2}-1\right)\left(7 x^{3}+x\right)=28 x^{5}-3 x^{3}-x
L05889: $$
L05891: Thus,
L05893: $$
L05894: \frac{d y}{d x}=\frac{d}{d x}\left[28 x^{5}-3 x^{3}-x\right]=140 x^{4}-9 x^{2}-1
L05895: $$
L05897: which agrees with the result obtained using the product rule.
L05899: Example 2 Find $d s / d t$ if $s=(1+t) \sqrt{t}$.
L05900: Solution. Applying the product rule yields
L05902: $$
L05903: \begin{aligned}
L05904: \frac{d s}{d t} & =\frac{d}{d t}[(1+t) \sqrt{t}] \\
L05905: & =(1+t) \frac{d}{d t}[\sqrt{t}]+\sqrt{t} \frac{d}{d t}[1+t] \\
L05906: & =\frac{1+t}{2 \sqrt{t}}+\sqrt{t}=\frac{1+3 t}{2 \sqrt{t}}
L05907: \end{aligned}
L05908: $$
L05910: ## DERIVATIVE OF A QUOTIENT
L05912: Just as the derivative of a product is not generally the product of the derivatives, so the derivative of a quotient is not generally the quotient of the derivatives. The correct relationship is given by the following theorem.
L05913: 2.4.2 THEOREM (The Quotient Rule) If $f$ and $g$ are both differentiable at $x$ and if $g(x) \neq 0$, then $f / g$ is differentiable at $x$ and
L05915: $$
L05916: \begin{equation*}
L05917: \frac{d}{d x}\left[\frac{f(x)}{g(x)}\right]=\frac{g(x) \frac{d}{d x}[f(x)]-f(x) \frac{d}{d x}[g(x)]}{[g(x)]^{2}} \tag{2}
L05918: \end{equation*}
L05919: $$
L05921: PROOF
L05923: $$
L05924: \frac{d}{d x}\left[\frac{f(x)}{g(x)}\right]=\lim _{h \rightarrow 0} \frac{\frac{f(x+h)}{g(x+h)}-\frac{f(x)}{g(x)}}{h}=\lim _{h \rightarrow 0} \frac{f(x+h) \cdot g(x)-f(x) \cdot g(x+h)}{h \cdot g(x) \cdot g(x+h)}
L05925: $$
L05927: Sometimes it is better to simplify a function first than to apply the quotient rule immediately. For example, it is easier to differentiate
L05929: $$
L05930: f(x)=\frac{x^{3 / 2}+x}{\sqrt{x}}
L05931: $$
L05933: by rewriting it as
L05935: $$
L05936: f(x)=x+\sqrt{x}
L05937: $$
L05939: as opposed to using the quotient rule.
L05941: [FIGURE:49eb354c64565f2c | The figure displays the graph of the function $y = \frac{x^2 - 1}{x^4 + 1}$ on a coordinate system with dotted x and y axes. The curve is also dotted, showing a U-shape opening upwards, with a...]
L05942: - Figure 2.4.1
L05944: Adding and subtracting $f(x) \cdot g(x)$ in the numerator yields
L05946: $$
L05947: \begin{aligned}
L05948: \frac{d}{d x}\left[\frac{f(x)}{g(x)}\right] & =\lim _{h \rightarrow 0} \frac{f(x+h) \cdot g(x)-f(x) \cdot g(x)-f(x) \cdot g(x+h)+f(x) \cdot g(x)}{h \cdot g(x) \cdot g(x+h)} \\
L05949: & =\lim _{h \rightarrow 0} \frac{\left[g(x) \cdot \frac{f(x+h)-f(x)}{h}\right]-\left[f(x) \cdot \frac{g(x+h)-g(x)}{h}\right]}{g(x) \cdot g(x+h)} \\
L05950: & =\frac{\lim _{h \rightarrow 0} g(x) \cdot \lim _{h \rightarrow 0} \frac{f(x+h)-f(x)}{h}-\lim _{h \rightarrow 0} f(x) \cdot \lim _{h \rightarrow 0} \frac{g(x+h)-g(x)}{h}}{\lim _{h \rightarrow 0} g(x) \cdot \lim _{h \rightarrow 0} g(x+h)} \\
L05951: & =\frac{\left[\lim _{h \rightarrow 0} g(x)\right] \cdot \frac{d}{d x}[f(x)]-\left[\lim _{h \rightarrow 0} f(x)\right] \cdot \frac{d}{d x}[g(x)]}{\lim _{h \rightarrow 0} g(x) \cdot \lim _{h \rightarrow 0} g(x+h)} \\
L05952: & =\frac{g(x) \frac{d}{d x}[f(x)]-f(x) \frac{d}{d x}[g(x)]}{[g(x)]^{2}}
L05953: \end{aligned}
L05954: $$
L05956: [See the note at the end of the proof of Theorem 2.4.1 for an explanation of the last step.]
L05958: In words, the derivative of a quotient of two functions is the denominator times the derivative of the numerator minus the numerator times the derivative of the denominator, all divided by the denominator squared.
L05960: Example 3 Find $y^{\prime}(x)$ for $y=\frac{x^{3}+2 x^{2}-1}{x+5}$.
L05961: Solution. Applying the quotient rule yields
L05963: $$
L05964: \begin{aligned}
L05965: \frac{d y}{d x}=\frac{d}{d x}\left[\frac{x^{3}+2 x^{2}-1}{x+5}\right] & =\frac{(x+5) \frac{d}{d x}\left[x^{3}+2 x^{2}-1\right]-\left(x^{3}+2 x^{2}-1\right) \frac{d}{d x}[x+5]}{(x+5)^{2}} \\
L05966: & =\frac{(x+5)\left(3 x^{2}+4 x\right)-\left(x^{3}+2 x^{2}-1\right)(1)}{(x+5)^{2}} \\
L05967: & =\frac{\left(3 x^{3}+19 x^{2}+20 x\right)-\left(x^{3}+2 x^{2}-1\right)}{(x+5)^{2}} \\
L05968: & =\frac{2 x^{3}+17 x^{2}+20 x+1}{(x+5)^{2}}
L05969: \end{aligned}
L05970: $$
L05972: - Example 4 Let $f(x)=\frac{x^{2}-1}{x^{4}+1}$.
L05973: (a) Graph $y=f(x)$, and use your graph to make rough estimates of the locations of all horizontal tangent lines.
L05974: (b) By differentiating, find the exact locations of the horizontal tangent lines.
L05976: Solution (a). In Figure 2.4.1 we have shown the graph of the equation $y=f(x)$ in the window $[-2.5,2.5] \times[-1,1]$. This graph suggests that horizontal tangent lines occur at $x=0, x \approx 1.5$, and $x \approx-1.5$.
L05978: Derive the following rule for differentiating a reciprocal:
L05980: $$
L05981: \left(\frac{1}{g}\right)^{\prime}=-\frac{g^{\prime}}{g^{2}}
L05982: $$
L05984: Use it to find the derivative of
L05986: $$
L05987: f(x)=\frac{1}{x^{2}+1}
L05988: $$
L05990: Solution (b). To find the exact locations of the horizontal tangent lines, we must find the points where $d y / d x=0$. We start by finding $d y / d x$ :
L05992: $$
L05993: \begin{aligned}
L05994: \frac{d y}{d x} & =\frac{d}{d x}\left[\frac{x^{2}-1}{x^{4}+1}\right]=\frac{\left(x^{4}+1\right) \frac{d}{d x}\left[x^{2}-1\right]-\left(x^{2}-1\right) \frac{d}{d x}\left[x^{4}+1\right]}{\left(x^{4}+1\right)^{2}} \\
L05995: & =\frac{\left(x^{4}+1\right)(2 x)-\left(x^{2}-1\right)\left(4 x^{3}\right)}{\left(x^{4}+1\right)^{2}} \quad \begin{array}{l}
L05996: \text { The differentiation is complete. } \\
L05997: \text { The rest is simplification. }
L05998: \end{array} \\
L05999: & =\frac{-2 x^{5}+4 x^{3}+2 x}{\left(x^{4}+1\right)^{2}}=-\frac{2 x\left(x^{4}-2 x^{2}-1\right)}{\left(x^{4}+1\right)^{2}}
L06000: \end{aligned}
L06001: $$
L06003: Now we will set $d y / d x=0$ and solve for $x$. We obtain
L06005: $$
L06006: -\frac{2 x\left(x^{4}-2 x^{2}-1\right)}{\left(x^{4}+1\right)^{2}}=0
L06007: $$
L06009: The solutions of this equation are the values of $x$ for which the numerator is 0 , that is,
L06011: $$
L06012: 2 x\left(x^{4}-2 x^{2}-1\right)=0
L06013: $$
L06015: The first factor yields the solution $x=0$. Other solutions can be found by solving the equation
L06017: $$
L06018: x^{4}-2 x^{2}-1=0
L06019: $$
L06021: This can be treated as a quadratic equation in $x^{2}$ and solved by the quadratic formula. This yields
L06023: $$
L06024: x^{2}=\frac{2 \pm \sqrt{8}}{2}=1 \pm \sqrt{2}
L06025: $$
L06027: The minus sign yields imaginary values of $x$, which we ignore since they are not relevant to the problem. The plus sign yields the solutions
L06029: $$
L06030: x= \pm \sqrt{1+\sqrt{2}}
L06031: $$
L06033: In summary, horizontal tangent lines occur at
L06035: $$
L06036: x=0, \quad x=\sqrt{1+\sqrt{2}} \approx 1.55, \quad \text { and } \quad x=-\sqrt{1+\sqrt{2}} \approx-1.55
L06037: $$
L06039: which is consistent with the rough estimates that we obtained graphically in part (a).
L06041: ## SUMMARY OF DIFFERENTIATION RULES
L06043: The following table summarizes the differentiation rules that we have encountered thus far.
L06045: Table 2.4.1
L06046: RULES FOR DIFFERENTIATION
L06047: | $\frac{d}{d x}[c]=0$ | $(f+g)^{\prime}=f^{\prime}+g^{\prime}$ | $(f \cdot g)^{\prime}=f \cdot g^{\prime}+g \cdot f^{\prime}$ | $\left(\frac{1}{g}\right)^{\prime}=-\frac{g^{\prime}}{g^{2}}$ |
L06048: | :---: | :---: | :---: | :---: |
L06049: | $(c f)^{\prime}=c f^{\prime}$ | $(f-g)^{\prime}=f^{\prime}-g^{\prime}$ | $\left(\frac{f}{g}\right)^{\prime}=\frac{g \cdot f^{\prime}-f \cdot g^{\prime}}{g^{2}}$ | $\frac{d}{d x}\left[x^{r}\right]=r x^{r-1}$ |
L06052: ## QUICK CHECK EXERCISES 2.4 (See page 169 for answers.)
L06054: 1. 
L06056: (a) $\frac{d}{d x}\left[x^{2} f(x)\right]=$ $\_\_\_\_$ (b) $\frac{d}{d x}\left[\frac{f(x)}{x^{2}+1}\right]=$
L06057: (c) $\frac{d}{d x}\left[\frac{x^{2}+1}{f(x)}\right]=$ $\_\_\_\_$
L06058: $\_\_\_\_$ 2. Find $F^{\prime}(1)$ given that $f(1)=-1, f^{\prime}(1)=2, g(1)=3$, and $g^{\prime}(1)=-1$.
L06059: (a) $F(x)=2 f(x)-3 g(x)$
L06060: (b) $F(x)=[f(x)]^{2}$
L06061: (c) $F(x)=f(x) g(x)$
L06062: (d) $F(x)=f(x) / g(x)$
L06064: 1-4 Compute the derivative of the given function $f(x)$ by (a) multiplying and then differentiating and (b) using the product rule. Verify that (a) and (b) yield the same result.
L06066: 1. $f(x)=(x+1)(2 x-1)$
L06067: 2. $f(x)=\left(3 x^{2}-1\right)\left(x^{2}+2\right)$
L06068: 3. $f(x)=\left(x^{2}+1\right)\left(x^{2}-1\right)$
L06069: 4. $f(x)=(x+1)\left(x^{2}-x+1\right)$
L06071: 5-20 Find $f^{\prime}(x)$.
L06072: 5. $f(x)=\left(3 x^{2}+6\right)\left(2 x-\frac{1}{4}\right)$
L06073: 6. $f(x)=\left(2-x-3 x^{3}\right)\left(7+x^{5}\right)$
L06074: 7. $f(x)=\left(x^{3}+7 x^{2}-8\right)\left(2 x^{-3}+x^{-4}\right)$
L06075: 8. $f(x)=\left(\frac{1}{x}+\frac{1}{x^{2}}\right)\left(3 x^{3}+27\right)$
L06076: 9. $f(x)=(x-2)\left(x^{2}+2 x+4\right)$
L06077: 10. $f(x)=\left(x^{2}+x\right)\left(x^{2}-x\right)$
L06078: 11. $f(x)=\frac{3 x+4}{x^{2}+1}$
L06079: 12. $f(x)=\frac{x-2}{x^{4}+x+1}$
L06080: 13. $f(x)=\frac{x^{2}}{3 x-4}$
L06081: 14. $f(x)=\frac{2 x^{2}+5}{3 x-4}$
L06082: 15. $f(x)=\frac{(2 \sqrt{x}+1)(x-1)}{x+3}$
L06083: 16. $f(x)=(2 \sqrt{x}+1)\left(\frac{2-x}{x^{2}+3 x}\right)$
L06084: 17. $f(x)=(2 x+1)\left(1+\frac{1}{x}\right)\left(x^{-3}+7\right)$
L06085: 18. $f(x)=x^{-5}\left(x^{2}+2 x\right)(4-3 x)\left(2 x^{9}+1\right)$
L06086: 19. $f(x)=\left(x^{7}+2 x-3\right)^{3}$ 20. $f(x)=\left(x^{2}+1\right)^{4}$
L06088: 21-22 Find $d y /\left.d x\right|_{x=1}$.
L06089: 21. $y=\left(\frac{3 x+2}{x}\right)\left(x^{-5}+1\right)$
L06090: 22. $y=\left(2 x^{7}-x^{2}\right)\left(\frac{x-1}{x+1}\right)$
L06092: 23-24 Use a graphing utility to estimate the value of $f^{\prime}(1)$ by zooming in on the graph of $f$, and then compare your estimate to the exact value obtained by differentiating.
L06093: 23. $f(x)=\frac{x}{x^{2}+1}$
L06094: 24. $f(x)=\frac{x^{2}-1}{x^{2}+1}$
L06095: 25. Find $g^{\prime}(4)$ given that $f(4)=3$ and $f^{\prime}(4)=-5$.
L06096: (a) $g(x)=\sqrt{x} f(x)$
L06097: (b) $g(x)=\frac{f(x)}{x}$
L06098: 26. Find $g^{\prime}(3)$ given that $f(3)=-2$ and $f^{\prime}(3)=4$.
L06099: (a) $g(x)=3 x^{2}-5 f(x)$
L06100: (b) $g(x)=\frac{2 x+1}{f(x)}$
L06101: 27. In parts (a)-(d), $F(x)$ is expressed in terms of $f(x)$ and $g(x)$. Find $F^{\prime}(2)$ given that $f(2)=-1, f^{\prime}(2)=4, g(2)=1$, and $g^{\prime}(2)=-5$.
L06102: (a) $F(x)=5 f(x)+2 g(x)$
L06103: (b) $F(x)=f(x)-3 g(x)$
L06104: (c) $F(x)=f(x) g(x)$
L06105: (d) $F(x)=f(x) / g(x)$
L06106: 28. Find $F^{\prime}(\pi)$ given that $f(\pi)=10, f^{\prime}(\pi)=-1, g(\pi)=-3$, and $g^{\prime}(\pi)=2$.
L06107: (a) $F(x)=6 f(x)-5 g(x)$
L06108: (b) $F(x)=x(f(x)+g(x))$
L06109: (c) $F(x)=2 f(x) g(x)$
L06110: (d) $F(x)=\frac{f(x)}{4+g(x)}$
L06112: 29-34 Find all values of $x$ at which the tangent line to the given curve satisfies the stated property. □
L06113: 29. $y=\frac{x^{2}-1}{x+2}$; horizontal 30. $y=\frac{x^{2}+1}{x-1}$; horizontal
L06114: 31. $y=\frac{x^{2}+1}{x+1}$; parallel to the line $y=x$
L06115: 32. $y=\frac{x+3}{x+2}$; perpendicular to the line $y=x$
L06116: 33. $y=\frac{1}{x+4}$; passes through the origin
L06117: 34. $y=\frac{2 x+5}{x+2} ; y$-intercept 2
L06119: ## FOCUS ON CONCEPTS
L06121: 35. (a) What should it mean to say that two curves intersect at right angles?
L06122: (b) Show that the curves $y=1 / x$ and $y=1 /(2-x)$ intersect at right angles.
L06123: 36. Find all values of $a$ such that the curves $y=a /(x-1)$ and $y=x^{2}-2 x+1$ intersect at right angles.
L06124: 37. Find a general formula for $F^{\prime \prime}(x)$ if $F(x)=x f(x)$ and $f$ and $f^{\prime}$ are differentiable at $x$.
L06125: 38. Suppose that the function $f$ is differentiable everywhere and $F(x)=x f(x)$.
L06126: (a) Express $F^{\prime \prime \prime}(x)$ in terms of $x$ and derivatives of $f$.
L06127: (b) For $n \geq 2$, conjecture a formula for $F^{(n)}(x)$.
L06128: 39. A manufacturer of athletic footwear finds that the sales of their ZipStride brand running shoes is a function $f(p)$ of the selling price $p$ (in dollars) for a pair of shoes. Suppose that $f(120)=9000$ pairs of shoes and $f^{\prime}(120)=-60$ pairs of shoes per dollar. The revenue that the manufacturer will receive for selling $f(p)$ pairs of shoes at $p$ dollars per pair is $R(p)=p \cdot f(p)$. Find $R^{\prime}(120)$. What impact would a small increase in price have on the manufacturer's revenue?
L06129: 40. Solve the problem in Exercise 39 under the assumption that $f(120)=9000$ and $f^{\prime}(120)=-80$.
L06130: 41. Use the quotient rule (Theorem 2.4.2) to derive the formula for the derivative of $f(x)=x^{-n}$, where $n$ is a positive integer.
L06132: ## QUICK CHECK ANSWERS 2.4
L06134: 1. 
L06136: (a) $x^{2} f^{\prime}(x)+2 x f(x)$
L06137: (b) $\frac{\left(x^{2}+1\right) f^{\prime}(x)-2 x f(x)}{\left(x^{2}+1\right)^{2}}$
L06138: (c) $\frac{2 x f(x)-\left(x^{2}+1\right) f^{\prime}(x)}{\left[f(x)^{2}\right]}$
L06139: 2. (a) 7
L06140: (b) -4
L06141: (c) 7
L06142: (d) $\frac{5}{9}$
