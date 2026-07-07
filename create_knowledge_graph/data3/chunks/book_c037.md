L12859: which shows that a relative minimum occurs at $x=2$. Since $x=2$ yields the only relative extremum for $L$, it follows from Theorem 4.4.4 that an absolute minimum value of $L$ also occurs at $x=2$. Thus, the point on the curve $y=x^{2}$ closest to $(18,0)$ is
L12861: $$
L12862: (x, y)=\left(x, x^{2}\right)=(2,4)
L12863: $$
L12865: ## AN APPLICATION TO ECONOMICS
L12867: Three functions of importance to an economist or a manufacturer are
L12868: $C(x)=$ total cost of producing $x$ units of a product during some time period
L12869: $R(x)=$ total revenue from selling $x$ units of the product during the time period
L12870: $P(x)=$ total profit obtained by selling $x$ units of the product during the time period
L12871: These are called, respectively, the cost function, revenue function, and profit function. If all units produced are sold, then these are related by
L12873: $$
L12874: \begin{align*}
L12875: & P(x)=R(x)-C(x)  \tag{23}\\
L12876: & {[\text { profit }]=[\text { revenue }]-[\text { cost }]}
L12877: \end{align*}
L12878: $$
L12880: The total cost $C(x)$ of producing $x$ units can be expressed as a sum
L12882: $$
L12883: \begin{equation*}
L12884: C(x)=a+M(x) \tag{24}
L12885: \end{equation*}
L12886: $$
L12888: where $a$ is a constant, called overhead, and $M(x)$ is a function representing manufacturing cost. The overhead, which includes such fixed costs as rent and insurance, does not depend on $x$; it must be paid even if nothing is produced. On the other hand, the manufacturing cost $M(x)$, which includes such items as cost of materials and labor, depends on the number of items manufactured. It is shown in economics that with suitable simplifying assumptions, $M(x)$ can be expressed in the form
L12890: $$
L12891: M(x)=b x+c x^{2}
L12892: $$
L12894: [FIGURE:a4ebba24ed44a86d | A photograph depicts a manufacturing line where numerous small, clear vials, likely containing pharmaceutical products, are being transported on a conveyor belt. The belt curves in the foreground and...]
L12895: Jim Karageorge/Getty Images
L12896: A pharmaceutical firm's profit is a function of the number of units produced.
L12898: where $b$ and $c$ are constants. Substituting this in (24) yields
L12900: $$
L12901: \begin{equation*}
L12902: C(x)=a+b x+c x^{2} \tag{25}
L12903: \end{equation*}
L12904: $$
L12906: If a manufacturing firm can sell all the items it produces for $p$ dollars apiece, then its total revenue $R(x)$ (in dollars) will be
L12908: $$
L12909: \begin{equation*}
L12910: R(x)=p x \tag{26}
L12911: \end{equation*}
L12912: $$
L12914: and its total profit $P(x)$ (in dollars) will be
L12916: $$
L12917: P(x)=[\text { total revenue }]-[\text { total cost }]=R(x)-C(x)=p x-C(x)
L12918: $$
L12920: Thus, if the cost function is given by (25),
L12922: $$
L12923: \begin{equation*}
L12924: P(x)=p x-\left(a+b x+c x^{2}\right) \tag{27}
L12925: \end{equation*}
L12926: $$
L12928: Depending on such factors as number of employees, amount of machinery available, economic conditions, and competition, there will be some upper limit $l$ on the number of items a manufacturer is capable of producing and selling. Thus, during a fixed time period the variable $x$ in (27) will satisfy
L12930: $$
L12931: 0 \leq x \leq l
L12932: $$
L12934: By determining the value or values of $x$ in $[0, l]$ that maximize (27), the firm can determine how many units of its product must be manufactured and sold to yield the greatest profit. This is illustrated in the following numerical example.
L12936: - Example 7 A liquid form of antibiotic manufactured by a pharmaceutical firm is sold in bulk at a price of $\$ 200$ per unit. If the total production cost (in dollars) for $x$ units is
L12938: $$
L12939: C(x)=500,000+80 x+0.003 x^{2}
L12940: $$
L12942: and if the production capacity of the firm is at most 30,000 units in a specified time, how many units of antibiotic must be manufactured and sold in that time to maximize the profit?
L12944: Solution. Since the total revenue for selling $x$ units is $R(x)=200 x$, the profit $P(x)$ on $x$ units will be
L12946: $$
L12947: \begin{equation*}
L12948: P(x)=R(x)-C(x)=200 x-\left(500,000+80 x+0.003 x^{2}\right) \tag{28}
L12949: \end{equation*}
L12950: $$
L12952: Since the production capacity is at most 30,000 units, $x$ must lie in the interval $[0,30,000]$. From (28)
L12954: $$
L12955: \frac{d P}{d x}=200-(80+0.006 x)=120-0.006 x
L12956: $$
L12958: Setting $d P / d x=0$ gives
L12960: $$
L12961: 120-0.006 x=0 \quad \text { or } \quad x=20,000
L12962: $$
L12964: Since this critical point lies in the interval [ $0,30,000$ ], the maximum profit must occur at one of the values
L12966: $$
L12967: x=0, \quad x=20,000, \quad \text { or } \quad x=30,000
L12968: $$
L12970: Substituting these values in (28) yields Table 4.5.5, which tells us that the maximum profit $P=\$ 700,000$ occurs when $x=20,000$ units are manufactured and sold in the specified time.
L12972: Table 4.5.5
L12973: | $x$ | 0 | 20,000 | 30,000 |
L12974: | :---: | :---: | :---: | :---: |
L12975: | $P(x)$ | $-500,000$ | 700,000 | 400,000 |
L12978: ## MARGINAL ANALYSIS
L12980: Economists call $P^{\prime}(x), R^{\prime}(x)$, and $C^{\prime}(x)$ the marginal profit, marginal revenue, and marginal cost, respectively; and they interpret these quantities as the additional profit, revenue, and cost that result from producing and selling one additional unit of the product when the production and sales levels are at $x$ units. These interpretations follow from the local linear approximations of the profit, revenue, and cost functions. For example, it follows from Formula (2) of Section 3.5 that when the production and sales levels are at $x$ units the local linear approximation of the profit function is
L12982: $$
L12983: P(x+\Delta x) \approx P(x)+P^{\prime}(x) \Delta x
L12984: $$
L12986: Thus, if $\Delta x=1$ (one additional unit produced and sold), this formula implies
L12988: $$
L12989: P(x+1) \approx P(x)+P^{\prime}(x)
L12990: $$
L12992: and hence the additional profit that results from producing and selling one additional unit can be approximated as
L12994: $$
L12995: P(x+1)-P(x) \approx P^{\prime}(x)
L12996: $$
L12998: Similarly, $R(x+1)-R(x) \approx R^{\prime}(x)$ and $C(x+1)-C(x) \approx C^{\prime}(x)$.
L13000: ## - A BASIC PRINCIPLE OF ECONOMICS
L13002: It follows from (23) that $P^{\prime}(x)=0$ has the same solution as $C^{\prime}(x)=R^{\prime}(x)$, and this implies that the maximum profit must occur at a point where the marginal revenue is equal to the marginal cost; that is:
L13004: If profit is maximum, then the cost of manufacturing and selling an additional unit of a product is approximately equal to the revenue generated by the additional unit.
L13006: In Example 7, the maximum profit occurs when $x=20,000$ units. Note that
L13008: $$
L13009: C(20,001)-C(20,000)=\$ 200.003 \quad \text { and } \quad R(20,001)-R(20,000)=\$ 200
L13010: $$
L13012: which is consistent with this basic economic principle.
L13014: ## QUICK CHECK EXERCISES 4.5 (See page 288 for answers.)
L13016: 1. A positive number $x$ and its reciprocal are added together. The smallest possible value of this sum is obtained by minimizing $f(x)=$ $\_\_\_\_$ for $x$ in the interval $\_\_\_\_$ .
L13017: 2. Two nonnegative numbers, $x$ and $y$, have a sum equal to 10. The largest possible product of the two numbers is obtained by maximizing $f(x)=$ $\_\_\_\_$ for $x$ in the interval
L13018: $\_\_\_\_$ .
L13019: 3. A rectangle in the $x y$-plane has one corner at the origin, an adjacent corner at the point ( $x, 0$ ), and a third corner at a
L13020: point on the line segment from $(0,4)$ to $(3,0)$. The largest possible area of the rectangle is obtained by maximizing $A(x)=$ $\_\_\_\_$ for $x$ in the interval $\_\_\_\_$ .
L13021: 4. An open box is to be made from a 20 -inch by 32 -inch piece of cardboard by cutting out $x$-inch by $x$-inch squares from the four corners and bending up the sides. The largest possible volume of the box is obtained by maximizing $V(x)=$
L13022: $\_\_\_\_$ for $x$ in the interval $\_\_\_\_$ .
L13024: ## EXERCISE SET 4.5
L13026: 1. Find a number in the closed interval $\left[\frac{1}{2}, \frac{3}{2}\right]$ such that the sum of the number and its reciprocal is
L13027: (a) as small as possible
L13028: (b) as large as possible.
L13029: 2. How should two nonnegative numbers be chosen so that their sum is 1 and the sum of their squares is
L13030: (a) as large as possible
L13031: (b) as small as possible?
L13032: 3. A rectangular field is to be bounded by a fence on three sides and by a straight stream on the fourth side. Find the dimensions of the field with maximum area that can be enclosed using 1000 ft of fence.
L13033: 4. The boundary of a field is a right triangle with a straight stream along its hypotenuse and with fences along its other two sides. Find the dimensions of the field with maximum area that can be enclosed using 1000 ft of fence.
L13034: 5. A rectangular plot of land is to be fenced in using two kinds of fencing. Two opposite sides will use heavy-duty fencing selling for $\$ 3$ a foot, while the remaining two sides will use standard fencing selling for $\$ 2$ a foot. What are the dimensions of the rectangular plot of greatest area that can be fenced in at a cost of $\$ 6000$ ?
L13035: 6. A rectangle is to be inscribed in a right triangle having sides of length $6 \mathrm{in}, 8 \mathrm{in}$, and 10 in . Find the dimensions of the rectangle with greatest area assuming the rectangle is
L13037: - Figure Ex-6
L13038: positioned as in Figure Ex-6.
L13040: 7. Solve the problem in Exercise 6 assuming the rectangle is positioned as in Figure Ex-7.
L13042: [FIGURE:2ce1d6d805bafc7c | The figure shows a right triangle with legs of length 6 inches and 8 inches, and a hypotenuse of length 10 inches. An opaque, light blue rectangle is inscribed within the triangle, with one vertex at...]
L13043: - Figure Ex-7
L13045: 8. A rectangle has its two lower corners on the $x$-axis and its two upper corners on the curve $y=16-x^{2}$. For all such rectangles, what are the dimensions of the one with largest area?
L13046: 9. Find the dimensions of the rectangle with maximum area that can be inscribed in a circle of radius 10 .
L13047: 10. Find the point $P$ in the first quadrant on the curve $y=x^{-2}$ such that a rectangle with sides on the coordinate axes and a vertex at $P$ has the smallest possible perimeter.
L13048: 11. A rectangular area of $3200 \mathrm{ft}^{2}$ is to be fenced off. Two opposite sides will use fencing costing $\$ 1$ per foot and the remaining sides will use fencing costing $\$ 2$ per foot. Find the dimensions of the rectangle of least cost.
L13049: 12. Show that among all rectangles with perimeter $p$, the square has the maximum area.
L13050: 13. Show that among all rectangles with area $A$, the square has the minimum perimeter.
L13051: 14. A wire of length 12 in can be bent into a circle, bent into a square, or cut into two pieces to make both a circle and a square. How much wire should be used for the circle if the total area enclosed by the figure(s) is to be
L13052: (a) a maximum
L13053: (b) a minimum?
L13054: 15. A rectangle $R$ in the plane has corners at ( $\pm 8, \pm 12$ ), and a 100 by 100 square $S$ is positioned in the plane so that its
L13055: sides are parallel to the coordinate axes and the lower left corner of $S$ is on the line $y=-3 x$. What is the largest possible area of a region in the plane that is contained in both $R$ and $S$ ?
L13056: 16. Solve the problem in Exercise 15 if $S$ is a 16 by 16 square.
L13057: 17. Solve the problem in Exercise 15 if $S$ is positioned with its lower left corner on the line $y=-6 x$.
L13058: 18. A rectangular page is to contain 42 square inches of printable area. The margins at the top and bottom of the page are each 1 inch, one side margin is 1 inch, and the other side margin is 2 inches. What should the dimensions of the page be so that the least amount of paper is used?
L13059: 19. A box with a square base is taller than it is wide. In order to send the box through the U.S. mail, the height of the box and the perimeter of the base can sum to no more than 108 in. What is the maximum volume for such a box?
L13060: 20. A box with a square base is wider than it is tall. In order to send the box through the U.S. mail, the width of the box and the perimeter of one of the (nonsquare) sides of the box can sum to no more than 108 in . What is the maximum volume for such a box?
L13061: 21. An open box is to be made from a 3 ft by 8 ft rectangular piece of sheet metal by cutting out squares of equal size from the four corners and bending up the sides. Find the maximum volume that the box can have.
L13062: 22. A closed rectangular container with a square base is to have a volume of $2250 \mathrm{in}^{3}$. The material for the top and bottom of the container will cost $\$ 2$ per in ${ }^{2}$, and the material for the sides will cost $\$ 3$ per in ${ }^{2}$. Find the dimensions of the container of least cost.
L13063: 23. A closed rectangular container with a square base is to have a volume of $2000 \mathrm{~cm}^{3}$. It costs twice as much per square centimeter for the top and bottom as it does for the sides. Find the dimensions of the container of least cost.
L13064: 24. A container with square base, vertical sides, and open top is to be made from $1000 \mathrm{ft}^{2}$ of material. Find the dimensions of the container with greatest volume.
L13065: 25. A rectangular container with two square sides and an open top is to have a volume of $V$ cubic units. Find the dimensions of the container with minimum surface area.
L13066: 26. A church window consisting of a rectangle topped by a semicircle is to have a perimeter $p$. Find the radius of the semicircle if the area of the window is to be maximum.
L13067: 27. Find the dimensions of the right circular cylinder of largest volume that can be inscribed in a sphere of radius $R$.
L13068: 28. Find the dimensions of the right circular cylinder of greatest surface area that can be inscribed in a sphere of radius $R$.
L13069: 29. A closed, cylindrical can is to have a volume of $V$ cubic units. Show that the can of minimum surface area is achieved when the height is equal to the diameter of the base.
L13070: 30. A closed cylindrical can is to have a surface area of $S$ square units. Show that the can of maximum volume is achieved when the height is equal to the diameter of the base.
L13071: 31. A cylindrical can, open at the top, is to hold $500 \mathrm{~cm}^{3}$ of liquid. Find the height and radius that minimize the amount of material needed to manufacture the can.
L13072: 32. A soup can in the shape of a right circular cylinder of radius $r$ and height $h$ is to have a prescribed volume $V$. The top and bottom are cut from squares as shown in Figure Ex-32. If the shaded corners are wasted, but there is no other waste, find the ratio $r / h$ for the can requiring the least material (including waste).
L13073: 33. A box-shaped wire frame consists of two identical wire squares whose vertices are connected by four straight wires
L13075: [FIGURE:6839d891f7f57bf4 | A diagram shows a circle inscribed within a square. The circle's center is marked by a black dot, and its radius is indicated by an arrow labeled $r$. The four corner regions of the square, which are...]
L13076: - Figure Ex-32
L13078: of equal length (Figure Ex-33). If the frame is to be made from a wire of length $L$, what should the dimensions be to obtain a box of greatest volume?
L13080: [FIGURE:8d3eb457aa098c15 | A wireframe diagram shows a three-dimensional rectangular prism, or cuboid, with all its edges visible. This geometric figure serves as a general representation of a box for problems involving...]
L13081: - Figure Ex-33
L13083: 34. Suppose that the sum of the surface areas of a sphere and a cube is a constant.
L13084: (a) Show that the sum of their volumes is smallest when the diameter of the sphere is equal to the length of an edge of the cube.
L13085: (b) When will the sum of their volumes be greatest?
L13086: 35. Find the height and radius of the cone of slant height $L$ whose volume is as large as possible.
L13087: 36. A cone is made from a circular sheet of radius $R$ by cutting out a sector and gluing the cut edges of the remaining piece together (Figure Ex-36). What is the maximum volume attainable for the cone?
L13089: [FIGURE:f91fdd859c304d0a | The figure shows two geometric shapes. On the left, a light blue circular sector is depicted, with its radius labeled $R$. On the right, a light blue cone is shown, appearing to be formed by joining...]
L13090: - Figure Ex-36
L13092: 37. A cone-shaped paper drinking cup is to hold $100 \mathrm{~cm}^{3}$ of water. Find the height and radius of the cup that will require the least amount of paper.
L13093: 38. Find the dimensions of the isosceles triangle of least area that can be circumscribed about a circle of radius $R$.
L13094: 39. Find the height and radius of the right circular cone with least volume that can be circumscribed about a sphere of radius $R$.
L13095: 40. A commercial cattle ranch currently allows 20 steers per acre of grazing land; on the average its steers weigh 2000 lb at market. Estimates by the Agriculture Department indicate that the average market weight per steer will be reduced by 50 lb for each additional steer added per acre of grazing land. How many steers per acre should be allowed in order for the ranch to get the largest possible total market weight for its cattle?
L13096: 41. A company mines low-grade nickel ore. If the company mines $x$ tons of ore, it can sell the ore for $p=225-0.25 x$ dollars per ton. Find the revenue and marginal revenue functions. At what level of production would the company obtain the maximum revenue?
L13097: 42. A fertilizer producer finds that it can sell its product at a price of $p=300-0.1 x$ dollars per unit when it produces $x$ units of fertilizer. The total production cost (in dollars) for $x$ units is
L13099: $$
L13100: C(x)=15,000+125 x+0.025 x^{2}
L13101: $$
L13103: If the production capacity of the firm is at most 1000 units of fertilizer in a specified time, how many units must be manufactured and sold in that time to maximize the profit?
L13104: 43. (a) A chemical manufacturer sells sulfuric acid in bulk at a price of $\$ 100$ per unit. If the daily total production cost in dollars for $x$ units is
L13106: $$
L13107: C(x)=100,000+50 x+0.0025 x^{2}
L13108: $$
L13110: and if the daily production capacity is at most 7000 units, how many units of sulfuric acid must be manufactured and sold daily to maximize the profit?
L13111: (b) Would it benefit the manufacturer to expand the daily production capacity?
L13112: (c) Use marginal analysis to approximate the effect on profit if daily production could be increased from 7000 to 7001 units.
L13113: 44. A firm determines that $x$ units of its product can be sold daily at $p$ dollars per unit, where
L13115: $$
L13116: x=1000-p
L13117: $$
L13119: The cost of producing $x$ units per day is
L13121: $$
L13122: C(x)=3000+20 x
L13123: $$
L13125: (a) Find the revenue function $R(x)$.
L13126: (b) Find the profit function $P(x)$.
L13127: (c) Assuming that the production capacity is at most 500 units per day, determine how many units the company must produce and sell each day to maximize the profit.
L13128: (d) Find the maximum profit.
L13129: (e) What price per unit must be charged to obtain the maximum profit?
L13130: 45. In a certain chemical manufacturing process, the daily weight $y$ of defective chemical output depends on the total weight $x$ of all output according to the empirical formula
L13132: $$
L13133: y=0.01 x+0.00003 x^{2}
L13134: $$
L13136: where $x$ and $y$ are in pounds. If the profit is $\$ 100$ per pound of nondefective chemical produced and the loss is $\$ 20$ per pound of defective chemical produced, how many pounds of chemical should be produced daily to maximize the total daily profit?
L13137: 46. An independent truck driver charges a client $\$ 15$ for each hour of driving, plus the cost of fuel. At highway speeds of $v$ miles per hour, the trucker's rig gets $10-0.07 v$ miles per gallon of diesel fuel. If diesel fuel costs $\$ 2.50$ per gallon, what speed $v$ will minimize the cost to the client?
L13138: 47. A trapezoid is inscribed in a semicircle of radius 2 so that one side is along the diameter (Figure Ex-47). Find the maximum possible area for the trapezoid. [Hint: Express the area of the trapezoid in terms of $\theta$.]
L13139: 48. A drainage channel is to be made so that its cross section is a trapezoid with equally sloping sides (Figure Ex-48). If
L13141: [FIGURE:ec1ef35e691ef0c4 | A diagram shows a semicircle with its diameter as the horizontal base. An isosceles trapezoid is inscribed within the semicircle, with its longer base coinciding with the diameter. A dashed red line...]
L13142: - Figure Ex-47
L13144: the sides and bottom all have a length of 5 ft , how should the angle $\theta(0 \leq \theta \leq \pi / 2)$ be chosen to yield the greatest cross-sectional area of the channel?
L13146: [FIGURE:014b669b27c3196c | A 3D diagram depicts a trapezoidal channel, filled with blue water, cut into a block of earth. The channel's bottom width is 5 ft, and its slanted side walls are each 5 ft long. An angle $\theta$ is...]
L13147: - Figure Ex-48
L13149: 49. A lamp is suspended above the center of a round table of radius $r$. How high above the table should the lamp be placed to achieve maximum illumination at the edge of the table? [Assume that the illumination $I$ is directly proportional to the cosine of the angle of incidence $\phi$ of the light rays and inversely proportional to the square of the distance $l$ from the light source (Figure Ex-49).]
L13150: 50. A plank is used to reach over a fence 8 ft high to support a wall that is 1 ft behind the fence (Figure Ex-50). What is
L13152: [FIGURE:e587d27c3a78024e | A diagram shows a light source positioned vertically above the center of a red circular area on a flat surface. A right-angled triangle is depicted, with its vertices at the light source, the center...]
L13153: - Figure Ex-49
L13155: the length of the shortest plank that can be used? [Hint: Express the length of the plank in terms of the angle $\theta$ shown in the figure.]
L13157: [FIGURE:43239744c84ac58f | A diagram shows a plank leaning against a vertical brick wall. The plank makes an angle $\theta$ with the horizontal ground. The point where the plank touches the wall is 8 ft above the ground. A...]
L13158: - Figure Ex-50
L13160: 51. Find the coordinates of the point $P$ on the curve
L13162: $$
L13163: y=\frac{1}{x^{2}} \quad(x>0)
L13164: $$
L13166: [FIGURE:07f0624420632ddd | A circular lake is depicted with a diameter of 2 miles. Points E, P, and W are marked on its circumference. An arc from point E to point P, labeled "Jog", indicates a jogging path. A straight line...]
L13167: - Figure Ex-55
L13169: [FIGURE:8246a958372267cb | A diagram shows a rowboat in a lake, 1 mile offshore. A shoreline separates the lake from land where a town is located. The town is 1 mile horizontally from the point on the shoreline closest to the...]
L13170: - Figure Ex-56
L13172: where the segment of the tangent line at $P$ that is cut off by the coordinate axes has its shortest length.
L13173: 52. Find the $x$-coordinate of the point $P$ on the parabola
L13175: $$
L13176: y=1-x^{2} \quad(0<x \leq 1)
L13177: $$
L13179: where the triangle that is enclosed by the tangent line at $P$ and the coordinate axes has the smallest area.
L13180: 53. Where on the curve $y=\left(1+x^{2}\right)^{-1}$ does the tangent line have the greatest slope?
L13181: 54. Suppose that the number of bacteria in a culture at time $t$ is given by $N=5000\left(25+t e^{-t / 20}\right)$.
L13182: (a) Find the largest and smallest number of bacteria in the culture during the time interval $0 \leq t \leq 100$.
L13183: (b) At what time during the time interval in part (a) is the number of bacteria decreasing most rapidly?
L13184: 55. The shoreline of Circle Lake is a circle with diameter 2 mi . Nancy's training routine begins at point $E$ on the eastern shore of the lake. She jogs along the north shore to a point $P$ and then swims the straight line distance, if any, from $P$ to point $W$ diametrically opposite $E$ (Figure Ex-55). Nancy swims at a rate of $2 \mathrm{mi} / \mathrm{h}$ and jogs at $8 \mathrm{mi} / \mathrm{h}$. How far should Nancy jog in order to complete her training routine in
L13185: (a) the least amount of time
L13186: (b) the greatest amount of time?
L13187: 56. A man is floating in a rowboat 1 mile from the (straight) shoreline of a large lake. A town is located on the shoreline 1 mile from the point on the shoreline closest to the man. As suggested in Figure Ex-56, he intends to row in a straight line to some point $P$ on the shoreline and then walk the remaining distance to the town. To what point should he row in order to reach his destination in the least time if
L13188: (a) he can walk $5 \mathrm{mi} / \mathrm{h}$ and row $3 \mathrm{mi} / \mathrm{h}$
L13189: (b) he can walk $5 \mathrm{mi} / \mathrm{h}$ and row $4 \mathrm{mi} / \mathrm{h}$ ?
L13190: 57. A pipe of negligible diameter is to be carried horizontally around a corner from a hallway 8 ft wide into a hallway 4 ft wide (Figure Ex-57 on the next page). What is the maximum length that the pipe can have?
L13191: Source: An interesting discussion of this problem in the case where the diameter of the pipe is not neglected is given by Norman Miller in the American Mathematical Monthly, Vol. 56, 1949, pp. 177-179.
L13192: 58. A concrete barrier whose cross section is an isosceles triangle runs parallel to a wall. The height of the barrier is 3 ft , the width of the base of a cross section is 8 ft , and the barrier is positioned on level ground with its base 1 ft from the wall. A straight, stiff metal rod of negligible diameter
L13194: [FIGURE:eed13f47ff48ee07 | A diagram illustrates an L-shaped corridor or corner, formed by two perpendicular walls. A yellow rectangular beam is shown diagonally within the corner, touching the outer walls and the inner...]
L13195: - Figure Ex-57
L13197: has one end on the ground, the other end against the wall, and touches the top of the barrier (Figure Ex-58). What is the minimum length the rod can have?
L13199: [FIGURE:dc00b374823bde2a | A geometric diagram illustrates a slanted line, such as a ladder, leaning against a vertical wall and horizontal ground. The line passes through a fixed point, which is the apex of a shaded triangle...]
L13200: - Figure Ex-58
L13202: 59. Suppose that the intensity of a point light source is directly proportional to the strength of the source and inversely proportional to the square of the distance from the source. Two point light sources with strengths of $S$ and $8 S$ are separated by a distance of 90 cm . Where on the line segment between the two sources is the total intensity a minimum?
L13203: 60. Given points $A(2,1)$ and $B(5,4)$, find the point $P$ in the interval $[2,5]$ on the $x$-axis that maximizes angle $A P B$.
L13204: 61. The lower edge of a painting, 10 ft in height, is 2 ft above an observer's eye level. Assuming that the best view is obtained when the angle subtended at the observer's eye by the painting is maximum, how far from the wall should the observer stand?
