// queue implementation
#include "queue.h"

#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>

struct Queue {
    int *items;
    size_t capacity;
    size_t count;
    size_t front_index;
    size_t rear_index;
};

Queue *queue_create(size_t capacity) {
    if (capacity == 0) {
        return NULL;
    }

    Queue *queue = malloc(sizeof(*queue));
    if (queue == NULL) {
        return NULL;
    }

    queue->items = malloc(capacity * sizeof(*queue->items));
    if (queue->items == NULL) {
        free(queue);
        return NULL;
    }

    queue->capacity = capacity;
    queue->count = 0;
    queue->front_index = 0;
    queue->rear_index = 0;

    return queue;
}

void queue_destroy(Queue *queue) {
    if (queue == NULL) {
        return;
    }
    
    free(queue->items);
    free(queue);
}

bool queue_enqueue(Queue *queue, int value) {
    if (queue == NULL || queue_is_full(queue)) {
        return false;
    }

    queue->items[queue->rear_index] = value;
    queue->rear_index = (queue->rear_index + 1) % queue->capacity;
    queue->count++;

    return true;
}

bool queue_dequeue(Queue *queue, int *value) {
    if (queue == NULL || value == NULL || queue_is_empty(queue)) {
        return false;
    }

    *value = queue->items[queue->front_index];
    queue->front_index = (queue->front_index + 1) % queue->capacity;
    queue->count--;

    return true;
}

bool queue_front(const Queue *queue, int *value) {
    if (queue == NULL || value == NULL || queue_is_empty(queue)) {
        return false;
    }

    *value = queue->items[queue->front_index];

    return true;
}

bool queue_is_empty(const Queue *queue) {
    return queue == NULL || queue->count == 0; 
}

size_t queue_size(const Queue *queue) { 
    return queue == NULL ? 0 : queue->count; 
}

bool queue_is_full(const Queue *queue) {
    return queue != NULL && queue->count == queue->capacity;
}

void queue_print(const Queue *queue) {
    if (queue == NULL) {
        printf("invalid queue\n");
        return;
    }

    printf("Front -> ");

    if (queue_is_empty(queue)) {
        printf("empty\n");
        return;
    }

    for (size_t i = 0; i < queue->count; i++) {
        size_t index =
            (queue->front_index + i) % queue->capacity;

        printf("%d", queue->items[index]);

        if (i + 1 < queue->count) {
            printf(" -> ");
        }
    }

    printf(" <- Rear\n");
}
