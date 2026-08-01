// stack header

#ifndef STACK_H
#define STACK_H

#include <stdbool.h>
#include <stddef.h>

typedef struct Stack Stack;

/* create stack */
Stack *stack_create(size_t capacity);

/* destroys all memory */
void stack_destroy(Stack *stack);

/* adds value to top of stack */
bool stack_push(Stack *stack, int value);

/* removes the top value and stores it in *value */
bool stack_pop(Stack *stack, int *value);

/* copies the top value into *value without removing it */
bool stack_peek(const Stack *stack, int *value);

/* returns true when the stack contains nothing */
bool stack_is_empty(const Stack *stack);

/* returns true when the stack is capacity */
bool stack_is_full(const Stack *stack);

/* returns the current number of elements */
size_t stack_size(const Stack *stack);

/* prints the stack from top to bottom */
void stack_print(const Stack *stack);

#endif
