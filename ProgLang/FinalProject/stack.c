// stack implementation

#include "stack.h"

#include <stdio.h>
#include <stdlib.h>

struct Stack {
    int *items;
    size_t capacity;
    size_t count;
};

Stack *stack_create(size_t capacity) {
    if (capacity == 0) {
        return NULL;
    }

    Stack *stack = malloc(sizeof(*stack));
    if (stack == NULL) {
        return NULL;
    }

    stack->items = malloc(capacity * sizeof(*stack->items));
    if (stack->items == NULL) {
        free(stack);
        return NULL;
    }

    stack->capacity = capacity;
    stack->count = 0;

    return stack;
}

void stack_destroy(Stack *stack) {
    if (stack == NULL) {
        return;
    }

    free(stack->items);
    free(stack);
}

bool stack_push(Stack *stack, int value) {
    if (stack == NULL || stack_is_full(stack)) {
        return false;
    }

    stack->items[stack->count] = value;
    stack->count++;

    return true;
}

bool stack_pop(Stack *stack, int *value) {
    if (stack == NULL || value == NULL || stack_is_empty(stack)) {
        return false;
    }

    stack->count--;
    *value = stack->items[stack->count];

    return true;
}

bool stack_peek(const Stack *stack, int *value) {
    if (stack == NULL || value == NULL || stack_is_empty(stack)) {
        return false;
    }

    *value = stack->items[stack->count - 1];

    return true;
}

bool stack_is_empty(const Stack *stack) {
    return stack == NULL || stack->count == 0;
}

bool stack_is_full(const Stack *stack) {
    return stack != NULL && stack->count == stack->capacity;
}

size_t stack_size(const Stack *stack) {
    return stack == NULL ? 0 : stack->count;
}

void stack_print(const Stack *stack) {
    if (stack == NULL) {
        printf("invalid stack\n");
        return;
    }

    printf("top -> ");

    if (stack_is_empty(stack)) {
        printf("empty\n");
        return;
    }

    for (size_t i = stack->count; i > 0; i--) {
        printf("%d", stack->items[i - 1]);

        if (i > 1) {
            printf(" -> ");
        }
    }

    printf("\n");
}
