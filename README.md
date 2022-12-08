# Overview
This interactive tool allows students to develop an intuition about electrostatics and dynamics of point charges. By opening the menu, many different visualization tools become available. These tools can be used to demonstrate interactions between collections of point charges as would be discussed in an introductory Physics course: electric field vectors, force vectors, and the electric potential resulting from the sum of all charges. Some of these visualization tools are more computationally expensive than others (electric potential, in particular), and may result in a significant slowdown if implemented in full screen mode.

[**Try it out!**](https://hartery5.github.io/CoulombsLaw)

## Basics of Coulombs Law
While more complicated formulations of Coulombs Law exist, what follows is a basic description of Coulombs Law intended for an algebra-based introduction to electrostatics. Some basic understanding of Newton's Laws, atomic structure, and chemistry will be taken for granted.

Let's start with a definition of charge.

### Electric Charge, q (C): 
A discrete, intrinsic variable of fundamental particles. May be positive or negative. Commonly appears as the symbol, $q$, with units of Coulombs, C, in the SI system.

One of the crowning achievements of modern Physics was the discovery that the smallest amount of charge that any object can possess<sup>[1](#myfootnote1)</sup> is:
$q_e =  1.602176634×10^{-19} C$

Thus, the value $q_e$ is often referred to as the "elementary charge". 

### Interactions Between Charges
To understand how charged particles interact and influence each other, it is common to reflect on the basic model of an atom. The basic structure of an atom consists of a nucleus comprised of protons and neutrons, with exterior electron "shells". Each fundamental particle possesses a unique charge: the electron has a charge of -1 $q_e$, while protons possess a charge of 1 $q_e$, and neutrons have a charge of 0. With some exceptions, atoms on the periodic table are stable over long periods of time. This means that their structure is essentially preserved throughout time. As a result, there must exist some forces which are keeping these particles bound together as a composite system.

Though the fundamental particles possess mass, the miniscule amount of mass each particle possesses means that it is not their mutual gravitational attraction that keeps an atom intact. Instead, there must be other (stronger) forces of attraction which preserve the basic atomic structure. In particular, Coulomb's Law describes a force of attraction between charges of opposite sign. Thus, the electrons and protons are said to mutually attract one another, while pairs of electrons or pairs of protons mutually repel each other<sup>[2](#myfootnote2)</sup>.

Since electrons mutually repel each other, they can only occupy certain orbital locations outside of the nucleus to minimize their mutual repulsive forces (Pauli Exclusion Principle). While electrons close to the nucleus have little surface area to separate from each other, electrons further away have more area to separate amongst themselves. So, electron shells have greater occupancy further from the nucleus. However, we also know that the electrons in these outer shells must be less tightly bound to the nucleus: after all, these electrons can participate in the formation of "chemical bonds" between atoms to form molecules. Such is the basics of chemistry. For these statements to be true, we should expect that **the Coulomb Force depends not only on the magnitude and sign of the charges, but on the distance between charges, too.**

To encapsulate the effects above, we should desire an expression of the force between charges to depend on the separation distance, sign, and magnitude of the charges. Coulomb's Law satisfies these three necessities and is commonly presented as follows:

$|\vec{F}_{1\rightarrow2}| = k \frac{|q_1||q_2|}{r^2}$

$|\vec{F}_{1\rightarrow2}|$: Magnitude of force exerted on particle 1 by particle 2 (N)

$k$: Coulomb's Constant,  8.99×10^9 (N⋅m$^2$/C$^2$)

$|q_1|$: Magnitude of charge contained by particle 1 (C)

$|q_2|$: Magnitude of charge contained by particle 2 (C)

$r$: Distance between particle 1 and particle 2 (m)

Notice that the above is formulated in terms of magnitude. While Coulomb's Law can be expressed in a vector form, it is often desirable in an algebra-based setting to have separate rules for calculating magnitude the magnitude of the force and direction.


# References

# Footnotes
<a name="myfootnote1"><sup>[1]</sup></a> Strictly speaking, the quarks that make up the proton neutron posess fractional charge, e.g. an "up" quark has a charge of $\pm2/3q_e$, but quarks have never been observed in isolation (at least not since the Big Bang), while it quite common to see electrons or protons on their own. Thus, on matter of practicality, scientists typically stick to the definition of the elementary charge given above.

<a name="myfootnote2"><sup>[2]</sup></a> What keeps the neutrons bound to the nucleus, and what prevents protons from repelling each other??? I hear you screaming. This is... quit a bit more complicated. At "large" distances, models of the nucleus predict a much stronger "Coulomb-like" force of attraction exists between neutrons and protons. By necessity, however, there must also be a force of repulsion that prevents the nucleus from collapsing into itself. The force which exhibits this duality is often called the "Nuclear force" and is modelled via various potentials such as the Yukawa potential. Diving deeper, however, one may recall from Footnote 1 that protons and neutrons are composed of quarks. The so-called "Nuclear Force" is really just a residual force that arises from a Strong Interaction between these particles. As far as we know, this is the end of the rabbit-hole (so to speak). Modern Physics formulates the Strong Interaction felt between quarks as arising from the fundamental property of "color charge". Quarks are said to come in 6 distinct colors, where quantum chromodynamics (QCD) predicts the mutual influence of pairs of quarks on each other owing to their color charge.
