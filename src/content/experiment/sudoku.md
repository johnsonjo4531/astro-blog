---
title: Sudoku Solver
contentSlug: /sudoku-solver/
href: /sudoku/
timetext: During my CS education at USU
description: >
  I used Knuth's algorithm X with Dancing Links. Algorithm X with Dancing Links is a fairly efficient educated brute forcing back-tracking algorithm
  that would let you solve a more general problem called the exact cover problem (other examples besides soduku include tiling a space with polionimoes ). Dancing Links is the name of the data structure used, because what happens
  is you use a quadruply linked-list (think like a doubly-linked list forward and backwards that make a grid) and are able to hide and show nodes in the list 
  as you traverse the exact-cover problem search space. The main benefit of creating and hiding nodes is saving memory operations like creation and deletion.
  The reason for the quadruply linked list is, if your search space (usually visualized by a matrix) is fairly sparse then the doubly linked list can save alot of space
  and also a lot of time taking them both from space and time per row from O(n) to O(k).
  Algorithm X is the algorithm that has to do with using dancing links to solve the exact cover problem.
  
  It took me several reads of Knuth's paper, and finally 
  with much help which largely came from other sources I was able to understand it (Knuth uses some strange syntax for linked-list setting and lookup in my opinion). I finished each implementation in about
  two weeks total. One week was spent for the initial implementation and one week for the UI using things I was learning
  in Object Oriented (it was for an assignment in that class).
---
