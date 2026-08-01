// queue header

#ifndef QUEUE_H
#define QUEUE_H

#include <stdbool.h>
#include <stddef.h>

typedef struct Queue Queue;

/* create the queue */
Queue *queue_create(size_t capacity);

/* destructor for queue */
void queue_destroy(Queue *queue);

/* adds to back of queue */
bool queue_enqueue(Queue *queue, int value);

/* removes front value and stores in value */
bool queue_dequeue(Queue *queue, int *value);

/* copies front value into *value without removing it */
bool queue_front(const Queue *queue, int *value);

/* returns true when queue is empty */
bool queue_is_empty(const Queue *queue);

/* returns true when the queue is capacity */
bool queue_is_full(const Queue *queue);

/* returns current number of elements */
size_t queue_size(const Queue *queue);

/* prints queue front to back */
void queue_print(const Queue *queue);

#endif