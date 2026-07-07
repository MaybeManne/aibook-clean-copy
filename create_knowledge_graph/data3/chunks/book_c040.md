L13629: ## QUICK CHECK ANSWERS 4.6
L13631: 1. $v(t)=s^{\prime}(t) ; a(t)=v^{\prime}(t)$
L13632: 2. $3 ;-5 ; 5 ;-4$
L13633: 3. the same; opposite
L13634: 4. $2<t<2 \sqrt{3}$
L13636: ### 4.7 NEWTON'S METHOD
L13638: In Section 1.5 we showed how to approximate the roots of an equation $f(x)=0$ using the Intermediate-Value Theorem. In this section we will study a technique, called "Newton's Method," that is usually more efficient than that method. Newton's Method is the technique used by many commercial and scientific computer programs for finding roots.
L13640: ## NEWTON'S METHOD
L13642: In beginning algebra one learns that the solution of a first-degree equation $a x+b=0$ is given by the formula $x=-b / a$, and the solutions of a second-degree equation
L13644: $$
L13645: a x^{2}+b x+c=0
L13646: $$
L13648: are given by the quadratic formula. Formulas also exist for the solutions of all third- and fourth-degree equations, although they are too complicated to be of practical use. In 1826 it was shown by the Norwegian mathematician Niels Henrik Abel that it is impossible to construct a similar formula for the solutions of a general fifth-degree equation or higher. Thus, for a specific fifth-degree polynomial equation such as
L13650: $$
L13651: x^{5}-9 x^{4}+2 x^{3}-5 x^{2}+17 x-8=0
L13652: $$
L13654: it may be difficult or impossible to find exact values for all of the solutions. Similar difficulties occur for nonpolynomial equations such as
L13656: $$
L13657: x-\cos x=0
L13658: $$
L13660: For such equations the solutions are generally approximated in some way, often by the method we will now discuss.
L13662: Suppose that we are trying to find a root $r$ of the equation $f(x)=0$, and suppose that by
L13664: [FIGURE:a8b82cf808bcfc69 | The graph illustrates Newton's Method for approximating a root $r$ of a function $y=f(x)$. A blue curve represents $y=f(x)$, intersecting the x-axis at point $r$. Starting with an initial guess $x_1$...]
L13665: Figure 4.7.1
L13667: To implement Newton's Method analytically, we must derive a formula that will tell us how to calculate each improved approximation from the preceding approximation. For this purpose, we note that the point-slope form of the tangent line to $y=f(x)$ at the initial
L13668: [FIGURE:3a476cbadd7ea3af | A black and white portrait depicts Niels Henrik Abel, a Norwegian mathematician, whose work on the insolvability of quintic equations is discussed in the text.]
L13670: Niels Henrik Abel (1802-1829) Norwegian mathematician. Abel was the son of a poor Lutheran minister and a remarkably beautiful mother from whom he inherited strikingly good looks. In his brief life of 26 years Abel lived in virtual poverty and suffered a succession of adversities, yet he managed to prove major results that altered the mathematical landscape forever. At the age of thirteen he was sent away from home to a school whose better days had long passed. By a stroke of luck the school had just hired a teacher named Bernt Michael Holmboe, who quickly discovered that Abel had extraordinary mathematical ability. Together, they studied the calculus texts of Euler and works of Newton and the later French mathematicians. By the time he graduated, Abel was familar with most of the great mathematical literature. In 1820 his father died, leaving the family in dire financial straits. Abel was able to enter the University of Christiania in Oslo only because he was granted a free room and several professors supported him directly from their salaries. The University had no advanced courses in mathematics, so Abel took a preliminary degree in 1822 and then continued to study mathematics on his own. In 1824 he published at his own expense the proof that it is impossible to solve the general fifthdegree polynomial equation algebraically. With the hope that this landmark paper would lead to his recognition and acceptance by the European mathematical community, Abel sent the paper to the
L13671: great German mathematician Gauss, who casually declared it to be a "monstrosity" and tossed it aside. However, in 1826 Abel's paper on the fifth-degree equation and other work was published in the first issue of a new journal, founded by his friend, Leopold Crelle. In the summer of 1826 he completed a landmark work on transcendental functions, which he submitted to the French Academy of Sciences. He hoped to establish himself as a major mathematician, for many young mathematicians had gained quick distinction by having their work accepted by the Academy. However, Abel waited in vain because the paper was either ignored or misplaced by one of the referees, and it did not surface again until two years after his death. That paper was later described by one major mathematician as "...the most important mathematical discovery that has been made in our century...." After submitting his paper, Abel returned to Norway, ill with tuberculosis and in heavy debt. While eking out a meager living as a tutor, he continued to produce great work and his fame spread. Soon great efforts were being made to secure a suitable mathematical position for him. Fearing that his great work had been lost by the Academy, he mailed a proof of the main results to Crelle in January of 1829. In April he suffered a violent hemorrhage and died. Two days later Crelle wrote to inform him that an appointment had been secured for him in Berlin and his days of poverty were over! Abel's great paper was finally published by the Academy twelve years after his death.
L13673: [FIGURE:5debe03b5e9dfcc7 | A graph of the cubic function $y = x^3 - x - 1$ is displayed on a coordinate plane. The viewing window is set from $x=-2$ to $x=4$ and $y=-3$ to $y=3$, with both x and y scales set to 1. The curve...]
L13674: △ Figure 4.7.2
L13676: ## TECHNOLOGY MASTERY
L13678: Many calculators and computer programs calculate internally with more digits than they display. Where possible, you should use stored calculated values rather than values displayed from earlier calculations. Thus, in Example 1 the value of $x_{2}$ used in (7) should be the stored value, not the value in (6).
L13679: approximation $x_{1}$ is
L13681: $$
L13682: \begin{equation*}
L13683: y-f\left(x_{1}\right)=f^{\prime}\left(x_{1}\right)\left(x-x_{1}\right) \tag{1}
L13684: \end{equation*}
L13685: $$
L13687: If $f^{\prime}\left(x_{1}\right) \neq 0$, then this line is not parallel to the $x$-axis and consequently it crosses the $x$-axis at some point $\left(x_{2}, 0\right)$. Substituting the coordinates of this point in (1) yields
L13689: $$
L13690: -f\left(x_{1}\right)=f^{\prime}\left(x_{1}\right)\left(x_{2}-x_{1}\right)
L13691: $$
L13693: Solving for $x_{2}$ we obtain
L13695: $$
L13696: \begin{equation*}
L13697: x_{2}=x_{1}-\frac{f\left(x_{1}\right)}{f^{\prime}\left(x_{1}\right)} \tag{2}
L13698: \end{equation*}
L13699: $$
L13701: The next approximation can be obtained more easily. If we view $x_{2}$ as the starting approximation and $x_{3}$ the new approximation, we can simply apply (2) with $x_{2}$ in place of $x_{1}$ and $x_{3}$ in place of $x_{2}$. This yields
L13703: $$
L13704: \begin{equation*}
L13705: x_{3}=x_{2}-\frac{f\left(x_{2}\right)}{f^{\prime}\left(x_{2}\right)} \tag{3}
L13706: \end{equation*}
L13707: $$
L13709: provided $f^{\prime}\left(x_{2}\right) \neq 0$. In general, if $x_{n}$ is the $n$th approximation, then it is evident from the pattern in (2) and (3) that the improved approximation $x_{n+1}$ is given by
L13711: ## Newton's Method
L13713: $$
L13714: \begin{equation*}
L13715: x_{n+1}=x_{n}-\frac{f\left(x_{n}\right)}{f^{\prime}\left(x_{n}\right)}, \quad n=1,2,3, \ldots \tag{4}
L13716: \end{equation*}
L13717: $$
L13719: Example 1 Use Newton's Method to approximate the real solutions of
L13721: $$
L13722: x^{3}-x-1=0
L13723: $$
L13725: Solution. Let $f(x)=x^{3}-x-1$, so $f^{\prime}(x)=3 x^{2}-1$ and (4) becomes
L13727: $$
L13728: \begin{equation*}
L13729: x_{n+1}=x_{n}-\frac{x_{n}^{3}-x_{n}-1}{3 x_{n}^{2}-1} \tag{5}
L13730: \end{equation*}
L13731: $$
L13733: From the graph of $f$ in Figure 4.7.2, we see that the given equation has only one real solution. This solution lies between 1 and 2 because $f(1)=-1<0$ and $f(2)=5>0$. We will use $x_{1}=1.5$ as our first approximation ( $x_{1}=1$ or $x_{1}=2$ would also be reasonable choices).
L13735: Letting $n=1$ in (5) and substituting $x_{1}=1.5$ yields
L13737: $$
L13738: \begin{equation*}
L13739: x_{2}=1.5-\frac{(1.5)^{3}-1.5-1}{3(1.5)^{2}-1} \approx 1.34782609 \tag{6}
L13740: \end{equation*}
L13741: $$
L13743: (We used a calculator that displays nine digits.) Next, we let $n=2$ in (5) and substitute $x_{2}$ to obtain
L13745: $$
L13746: \begin{equation*}
L13747: x_{3}=x_{2}-\frac{x_{2}^{3}-x_{2}-1}{3 x_{2}^{2}-1} \approx 1.32520040 \tag{7}
L13748: \end{equation*}
L13749: $$
L13751: If we continue this process until two identical approximations are generated in succession, we obtain
L13753: $$
L13754: \begin{aligned}
L13755: & x_{1}=1.5 \\
L13756: & x_{2} \approx 1.34782609 \\
L13757: & x_{3} \approx 1.32520040 \\
L13758: & x_{4} \approx 1.32471817 \\
L13759: & x_{5} \approx 1.32471796 \\
L13760: & x_{6} \approx 1.32471796
L13761: \end{aligned}
L13762: $$
L13764: [FIGURE:f7cd4bbe20b1af83 | A graph displays two dotted curves: the line $y=x$ and the cosine wave $y=\cos x$. The graph is set within a viewing window where $x$ ranges from 0 to 5 and $y$ from -2 to 2, with scales of 1 unit...]
L13765: △ Figure 4.7.3
L13767: [FIGURE:a691ce3522877f8a | A graph illustrating a failure case of Newton's Method. The x and y axes are shown. A blue curve, labeled $y = f(x)$, is plotted. Two points are marked on the x-axis: $x_2$ to the left, and $x_1$ to...]
L13768: △ Figure 4.7.4
L13770: At this stage there is no need to continue further because we have reached the display accuracy limit of our calculator, and all subsequent approximations that the calculator generates will likely be the same. Thus, the solution is approximately $x \approx 1.32471796$.
L13772: Example 2 It is evident from Figure 4.7.3 that if $x$ is in radians, then the equation
L13774: $$
L13775: \cos x=x
L13776: $$
L13778: has a solution between 0 and 1 . Use Newton's Method to approximate it.
L13779: Solution. Rewrite the equation as
L13781: $$
L13782: x-\cos x=0
L13783: $$
L13785: and apply (4) with $f(x)=x-\cos x$. Since $f^{\prime}(x)=1+\sin x$, (4) becomes
L13787: $$
L13788: \begin{equation*}
L13789: x_{n+1}=x_{n}-\frac{x_{n}-\cos x_{n}}{1+\sin x_{n}} \tag{8}
L13790: \end{equation*}
L13791: $$
L13793: From Figure 4.7.3, the solution seems closer to $x=1$ than $x=0$, so we will use $x_{1}=1$ (radian) as our initial approximation. Letting $n=1$ in (8) and substituting $x_{1}=1$ yields
L13795: $$
L13796: x_{2}=1-\frac{1-\cos 1}{1+\sin 1} \approx 0.750363868
L13797: $$
L13799: Next, letting $n=2$ in (8) and substituting this value of $x_{2}$ yields
L13801: $$
L13802: x_{3}=x_{2}-\frac{x_{2}-\cos x_{2}}{1+\sin x_{2}} \approx 0.739112891
L13803: $$
L13805: If we continue this process until two identical approximations are generated in succession, we obtain
L13807: $$
L13808: \begin{aligned}
L13809: & x_{1}=1 \\
L13810: & x_{2} \approx 0.750363868 \\
L13811: & x_{3} \approx 0.739112891 \\
L13812: & x_{4} \approx 0.739085133 \\
L13813: & x_{5} \approx 0.739085133
L13814: \end{aligned}
L13815: $$
L13817: Thus, to the accuracy limit of our calculator, the solution of the equation $\cos x=x$ is $x \approx 0.739085133$.
L13819: ## SOME DIFFICULTIES WITH NEWTON'S METHOD
L13821: When Newton's Method works, the approximations usually converge toward the solution with dramatic speed. However, there are situations in which the method fails. For example, if $f^{\prime}\left(x_{n}\right)=0$ for some $n$, then (4) involves a division by zero, making it impossible to generate $x_{n+1}$. However, this is to be expected because the tangent line to $y=f(x)$ is parallel to the $x$-axis where $f^{\prime}\left(x_{n}\right)=0$, and hence this tangent line does not cross the $x$-axis to generate the next approximation (Figure 4.7.4).
L13823: Newton's Method can fail for other reasons as well; sometimes it may overlook the root you are trying to find and converge to a different root, and sometimes it may fail to converge altogether. For example, consider the equation
L13825: $$
L13826: x^{1 / 3}=0
L13827: $$
L13829: which has $x=0$ as its only solution, and try to approximate this solution by Newton's Method with a starting value of $x_{0}=1$. Letting $f(x)=x^{1 / 3}$, Formula (4) becomes
L13831: $$
L13832: x_{n+1}=x_{n}-\frac{\left(x_{n}\right)^{1 / 3}}{\frac{1}{3}\left(x_{n}\right)^{-2 / 3}}=x_{n}-3 x_{n}=-2 x_{n}
L13833: $$
L13835: Beginning with $x_{1}=1$, the successive values generated by this formula are
L13837: $$
L13838: x_{1}=1, \quad x_{2}=-2, \quad x_{3}=4, \quad x_{4}=-8, \ldots
L13839: $$
L13841: which obviously do not converge to $x=0$. Figure 4.7.5 illustrates what is happening geometrically in this situation.
L13843: Figure 4.7.5
L13844: [FIGURE:638bfe4a801f37f1 | A graph of the function $y = x^{1/3}$ is shown, illustrating the divergence of Newton's Method when approximating the root $x=0$. The sequence of approximations starts at $x_1=1$. A vertical dashed...]
L13846: To learn more about the conditions under which Newton's Method converges and for a discussion of error questions, you should consult a book on numerical analysis. For a more in-depth discussion of Newton's Method and its relationship to contemporary studies of chaos and fractals, you may want to read the article, "Newton's Method and Fractal Patterns," by Philip Straffin, which appears in Applications of Calculus, MAA Notes, Vol. 3, No. 29, 1993, published by the Mathematical Association of America.
L13848: ## QUICK CHECK EXERCISES 4.7 (See page 302 for answers.)
L13850: 1. Use the accompanying graph to estimate $x_{2}$ and $x_{3}$ if Newton's Method is applied to the equation $y=f(x)$ with $x_{1}=8$.
L13851: 2. Suppose that $f(1)=2$ and $f^{\prime}(1)=4$. If Newton's Method is applied to $y=f(x)$ with $x_{1}=1$, then $x_{2}=$ $\_\_\_\_$ .
L13852: 3. Suppose we are given that $f(0)=3$ and that $x_{2}=3$ when Newton's Method is applied to $y=f(x)$ with $x_{1}=0$. Then $f^{\prime}(0)=$ $\_\_\_\_$ .
L13853: 4. If Newton's Method is applied to $y=e^{x}-1$ with $x_{1}=\ln 2$,
L13855: [FIGURE:41b06ff4d78dfa74 | A graph shows a curve $y = f(x)$ in the first quadrant of a Cartesian coordinate system, with the x-axis labeled from 0 to 10 and the y-axis from 0 to 14. A tangent line is drawn to the curve at a...]
L13856: < Figure Ex-1
L13858: EXERCISE SET 4.7 Graphing Utility
L13860: In this exercise set, express your answers with as many decimal digits as your calculating utility can display, but use the procedure in the Technology Mastery on p. 298. $\square$
L13862: 1. Approximate $\sqrt{2}$ by applying Newton's Method to the equation $x^{2}-2=0$.
L13863: 2. Approximate $\sqrt{5}$ by applying Newton's Method to the equation $x^{2}-5=0$.
L13864: 3. Approximate $\sqrt[3]{6}$ by applying Newton's Method to the equation $x^{3}-6=0$.
L13865: 4. To what equation would you apply Newton's Method to approximate the $n$th root of $a$ ?
L13867: 5-8 The given equation has one real solution. Approximate it by Newton's Method. $\square$
L13868: 5. $x^{3}-2 x-2=0$
L13869: 6. $x^{3}+x-1=0$
L13870: 7. $x^{5}+x^{4}-5=0$
L13871: 8. $x^{5}-3 x+3=0$
L13873: 9-14 Use a graphing utility to determine how many solutions the equation has, and then use Newton's Method to approximate the solution that satisfies the stated condition.
L13874: 9. $x^{4}+x^{2}-4=0 ; x<0$
L13875: 10. $x^{5}-5 x^{3}-2=0 ; x>0$
L13876: 11. $2 \cos x=x ; x>0$
L13877: 12. $\sin x=x^{2} ; x>0$
L13878: 13. $x-\tan x=0 ; \pi / 2<x<3 \pi / 2$
L13879: 14. $1+e^{x} \sin x=0 ; \pi / 2<x<3 \pi / 2$
L13881: 15-20 Use a graphing utility to determine the number of times the curves intersect and then apply Newton's Method, where needed, to approximate the $x$-coordinates of all intersections.
L13882: 15. $y=x^{3}$ and $y=1-x$
L13883: 16. $y=\sin x$ and $y=x^{3}-2 x^{2}+1$
L13884: 17. $y=x^{2}$ and $y=\sqrt{2 x+1}$
L13885: 18. $y=\frac{1}{8} x^{3}-1$ and $y=\cos x-2$
L13886: 19. $y=1$ and $y=e^{x} \sin x ; 0<x<\pi$
L13887: 20. $y=e^{-x}$ and $y=\ln x$
L13889: 21-24 True-False Determine whether the statement is true or false. Explain your answer.
L13890: 21. Newton's Method uses the tangent line to $y=f(x)$ at $x=x_{n}$ to compute $x_{n+1}$.
L13891: 22. Newton's Method is a process to find exact solutions to $f(x)=0$.
L13892: 23. If $f(x)=0$ has a root, then Newton's Method starting at $x=x_{1}$ will approximate the root nearest $x_{1}$.
L13893: 24. Newton's Method can be used to appoximate a point of intersection of two curves.
L13894: 25. The mechanic's rule for approximating square roots states that $\sqrt{a} \approx x_{n+1}$, where
L13896: $$
L13897: x_{n+1}=\frac{1}{2}\left(x_{n}+\frac{a}{x_{n}}\right), \quad n=1,2,3, \ldots
L13898: $$
L13900: and $x_{1}$ is any positive approximation to $\sqrt{a}$.
L13901: (a) Apply Newton's Method to
L13903: $$
L13904: f(x)=x^{2}-a
L13905: $$
L13907: to derive the mechanic's rule.
L13908: (b) Use the mechanic's rule to approximate $\sqrt{10}$.
L13909: 26. Many calculators compute reciprocals using the approximation $1 / a \approx x_{n+1}$, where
L13911: $$
L13912: x_{n+1}=x_{n}\left(2-a x_{n}\right), \quad n=1,2,3, \ldots
L13913: $$
L13915: and $x_{1}$ is an initial approximation to $1 / a$. This formula makes it possible to perform divisions using multiplications and subtractions, which is a faster procedure than dividing directly.
L13916: (a) Apply Newton's Method to
L13918: $$
L13919: f(x)=\frac{1}{x}-a
L13920: $$
L13922: to derive this approximation.
L13923: (b) Use the formula to approximate $\frac{1}{17}$.
L13924: 27. Use Newton's Method to approximate the absolute minimum of $f(x)=\frac{1}{4} x^{4}+x^{2}-5 x$.
L13925: 28. Use Newton's Method to approximate the absolute maximum of $f(x)=x \sin x$ on the interval $[0, \pi]$.
L13927: [FIGURE:d2afcd7b09e273bf | A graph displays the curve $y = \cos x$ in a Cartesian coordinate system with labeled x and y axes. The curve starts high on the left, passes through $(0, 1)$, and descends to cross the x-axis at $x...]
L13928: - Figure Ex-32
L13930: [FIGURE:f6db4777191fdab7 | A circle is shown with its center marked. Two radii extend from the center to points on the circumference, forming an isosceles triangle with a chord connecting those two points. The chord is labeled...]
L13931: - Figure Ex-33
L13933: 29. For the function
L13935: $$
L13936: f(x)=\frac{e^{-x}}{1+x^{2}}
L13937: $$
L13939: use Newton's Method to approximate the $x$-coordinates of the inflection points to two decimal places.
L13940: 30. Use Newton's Method to approximate the absolute maximum of $f(x)=(1-2 x) \tan ^{-1} x$.
L13941: 31. Use Newton's Method to approximate the coordinates of the point on the parabola $y=x^{2}$ that is closest to the point $(1,0)$.
L13942: 32. Use Newton's Method to approximate the dimensions of the rectangle of largest area that can be inscribed under the curve $y=\cos x$ for $0 \leq x \leq \pi / 2$ (Figure Ex-32).
L13943: 33. (a) Show that on a circle of radius $r$, the central angle $\theta$ that subtends an arc whose length is 1.5 times the length $L$ of its chord satisfies the equation $\theta=3 \sin (\theta / 2)$ (Figure Ex-33).
L13944: (b) Use Newton's Method to approximate $\theta$.
L13945: 34. Asegment of a circle is the region enclosed by an arc and its chord (Figure Ex-34). If $r$ is the radius of the circle and $\theta$ the angle subtended at the center of the circle, then it can be shown that the area $A$ of the segment is $A=\frac{1}{2} r^{2}(\theta-\sin \theta)$, where $\theta$ is in radians. Find the value of $\theta$ for which the area of the segment is one-fourth the area of the circle. Give $\theta$ to the nearest degree.
L13947: [FIGURE:26972b2737fe7302 | A circle is shown with its center marked. A horizontal chord divides the circle into two segments, with the upper segment shaded blue. Two radii extend from the center to the endpoints of the chord...]
L13948: -Figure Ex-34
L13950: 35-36 Use Newton's Method to approximate all real values of $y$ satisfying the given equation for the indicated value of $x$.
L13951: 35. $x y^{4}+x^{3} y=1 ; x=1$
L13952: 36. $x y-\cos \left(\frac{1}{2} x y\right)=0 ; x=2$
L13953: 37. An annuity is a sequence of equal payments that are paid or received at regular time intervals. For example, you may want to deposit equal amounts at the end of each year into an interest-bearing account for the purpose of accumulating a lump sum at some future time. If, at the end of each year, interest of $i \times 100 \%$ on the account balance for that year is added to the account, then the account is said to pay $i \times 100 \%$ interest, compounded annually. It can be shown
L13954: that if payments of $Q$ dollars are deposited at the end of each year into an account that pays $i \times 100 \%$ compounded annually, then at the time when the $n$th payment and the accrued interest for the past year are deposited, the amount $S(n)$ in the account is given by the formula
L13956: $$
L13957: S(n)=\frac{Q}{i}\left[(1+i)^{n}-1\right]
L13958: $$
L13960: Suppose that you can invest $\$ 5000$ in an interest-bearing account at the end of each year, and your objective is to have $\$ 250,000$ on the 25 th payment. Approximately what annual compound interest rate must the account pay for you to achieve your goal? [Hint: Show that the interest rate $i$ satisfies the equation $50 i=(1+i)^{25}-1$, and solve it using Newton's Method.]
L13962: ## FOCUS ON CONCEPTS
L13964: 38. (a) Use a graphing utility to generate the graph of
L13966: $$
L13967: f(x)=\frac{x}{x^{2}+1}
L13968: $$
L13970: and use it to explain what happens if you apply Newton's Method with a starting value of $x_{1}=2$. Check your conclusion by computing $x_{2}, x_{3}, x_{4}$ and $x_{5}$.
L13971: (b) Use the graph generated in part (a) to explain what happens if you apply Newton's Method with a start-
L13972: ing value of $x_{1}=0.5$. Check your conclusion by computing $x_{2}, x_{3}, x_{4}$, and $x_{5}$.
L13973: 39. (a) Apply Newton's Method to $f(x)=x^{2}+1$ with a starting value of $x_{1}=0.5$, and determine if the values of $x_{2}, \ldots, x_{10}$ appear to converge.
L13974: (b) Explain what is happening.
L13975: 40. In each part, explain what happens if you apply Newton's Method to a function $f$ when the given condition is satisfied for some value of $n$.
L13976: (a) $f\left(x_{n}\right)=0$
L13977: (b) $x_{n+1}=x_{n}$
L13978: (c) $x_{n+2}=x_{n} \neq x_{n+1}$
L13979: 41. Writing Compare Newton's Method and the IntermediateValue Theorem (1.5.7; see Example 5 in Section 1.5) as methods to locate solutions to $f(x)=0$.
L13980: 42. Writing Newton's Method uses a local linear approximation to $y=f(x)$ at $x=x_{n}$ to find an "improved" approximation $x_{n+1}$ to a zero of $f$. Your friend proposes a process that uses a local quadratic approximation to $y=f(x)$ at $x=x_{n}$ (that is, matching values for the function and its first two derivatives) to obtain $x_{n+1}$. Discuss the pros and cons of this proposal. Support your statements with some examples.
L13982: ## QUICK CHECK ANSWERS 4.7
L13984: 1. $x_{2} \approx 4, x_{3} \approx 2$
L13985: 2. $\frac{1}{2}$
L13986: 3. -1
L13987: 4. $\ln 2-\frac{1}{2} \approx 0.193147$
