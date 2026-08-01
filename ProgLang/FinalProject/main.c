// ADT implementation in C
// Stack and Queue 
// Progamming Languages CS3003
// By Elijah Heggs

#include "queue.h"
#include "stack.h"

#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>

static void demonstrate_stack(void) {
    printf("\n\n=====Stack=====\n");

    Stack *stack = stack_create(5);
    if (stack == NULL) {
        fprintf(stderr, "failed to create stack\n");
        exit(EXIT_FAILURE);
    }

    int values[] = {10, 20, 30, 40};

    for (size_t i = 0; i < sizeof(values) / sizeof(values[0]); i++) {
        printf("Push %d\n", values[i]);

        if (!stack_push(stack, values[i])) {
            printf("stack full\n");
        }

        stack_print(stack);
    }

    int top_value;
    if (stack_peek(stack, &top_value)) {
        printf("top value: %d\n", top_value);
    }

    printf("stack size: %zu\n", stack_size(stack));

    printf("\npopping all values:\n");
    while (stack_pop(stack, &top_value)) {
        printf("popped %d\n", top_value);
        stack_print(stack);
    }

    printf("stack empty: %s\n",
           stack_is_empty(stack) ? "true" : "false");

    stack_destroy(stack);
}

static void demonstrate_queue(void) {
    printf("=====Queue=====\n");

    Queue *queue = queue_create(5);
    if (queue == NULL) {
        fprintf(stderr, "failed to create queue\n");
        exit(EXIT_FAILURE);
    }

    int values[] = {100, 200, 300, 400};

    for (size_t i = 0; i < sizeof(values) / sizeof(values[0]); i++) {
        printf("Enqueue: %d\n", values[i]);

        if (!queue_enqueue(queue, values[i])) {
            printf("queue is full\n");
        }

        queue_print(queue);
    }

    int front_value;
    if (queue_front(queue, &front_value)) {
        printf("Front value: %d\n", front_value);
    }

    printf("Queue size: %zu\n", queue_size(queue));

    printf("\ndequeue two values:\n");
    for (int i = 0; i < 2; i++) {
        if (queue_dequeue(queue, &front_value)) {
            printf("Dequeued %d\n", front_value);
            queue_print(queue);
        }
    }

    printf("\nenqueue values to demonstrate circular storage:\n");
    queue_enqueue(queue, 500);
    queue_enqueue(queue, 600);
    queue_print(queue);

    printf("\ndequeuing all remaining values:\n");
    while (queue_dequeue(queue, &front_value)) {
        printf("Dequeued %d\n", front_value);
        queue_print(queue);
    }

    printf("Queue empty: %s\n",
           queue_is_empty(queue) ? "true" : "false");

    queue_destroy(queue);


}

int main(void) {
    demonstrate_queue();
    demonstrate_stack();

    return EXIT_SUCCESS;
}