# Stack and Queue ADT Project in C

This project demonstrates two abstract data types implemented in C:

- A stack using last-in, first-out behavior
- A queue using first-in, first-out behavior

## Design Notes


### Encapsulation 

Encapsulation is achieved in this program by separating the structural definitions from the user. The header files expose only the public function declarations and incomplete type declarations for Stack and Queue, while the actual structure fields are defined inside the .c files. Because C is an imperative language and lacks access specifiers like private or public, this is the only way I can restrict access from variables that the user doesn't need to understand.

### Memory Management

C requires the programmer to manually manage dynamically allocated memory. The stack and queue are created using malloc, so their allocated memory remains in use until it is explicitly released with free. To prevent memory leaks, each ADT provides a destroy function that frees both the internal array and the structure itself when the ADT is no longer needed. These functions are declared in the header files and implemented in the corresponding .c files.
