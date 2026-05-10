#include <stdio.h>
#include <string.h>

struct marks {
    float sub[5];
};

struct student {
    char usn[20];
    char name[50];
    struct marks m;
};

void readData(struct student *s);
float calcAvg(struct marks m);
void updateMarks(struct student *s);
void display(struct student s, float avg);

int main() {
    struct student s[50];
    float avg;
    int n, i, choice;
    int usn_idx;
    char search_usn[20];
    
    printf("Enter number of students: ");
    scanf("%d", &n);
    
    for(i = 0; i < n; i++) {
        printf("\n Student %d \n", i + 1);
        readData(&s[i]);
    }
    
    printf("\nEnter USN of student to update marks: ");
    scanf("%s", search_usn);
    
    usn_idx = -1;
    for(i = 0; i < n; i++) {
        if(strcmp(s[i].usn, search_usn) == 0) {
            usn_idx = i;
            break;
        }
    }
    
    if(usn_idx != -1) {
        updateMarks(&s[usn_idx]);
        avg = calcAvg(s[usn_idx].m);
        display(s[usn_idx], avg);
    } else {
        printf("Student not found!\n");
    }
    
    return 0;
}

void readData(struct student *s) {
    int i;
    
    printf("Enter USN: ");
    scanf("%s", s->usn);
    
    printf("Enter Name: ");
    scanf(" %[^\n]", s->name);
    
    printf("Enter marks for 5 subjects:\n");
    for(i = 0; i < 5; i++) {
        printf("Subject %d: ", i + 1);
        scanf("%f", &s->m.sub[i]);
    }
}

float calcAvg(struct marks m) {
    int i;
    float sum = 0;
    
    for(i = 0; i < 5; i++) {
        sum += m.sub[i];
    }
    return sum / 5.0;
}

void display(struct student s, float avg) {
    int i;
    
    printf("\n Student Details \n");
    printf("USN: %s\n", s.usn);
    printf("Name: %s\n", s.name);
    printf("Marks: ");
    for(i = 0; i < 5; i++) {
        printf("%.2f", s.m.sub[i]);
        if(i < 4) printf(", ");
    }
    printf("\nAverage: %.2f\n", avg);
}

void updateMarks(struct student *s) {
    int sub_num, i;
    
    printf("\nEnter subject number to update (1-5): ");
    scanf("%d", &sub_num);
    
    if(sub_num >= 1 && sub_num <= 5) {
        printf("Enter new marks for subject %d: ", sub_num);
        scanf("%f", &s->m.sub[sub_num - 1]);
        printf("Marks updated successfully!\n");
    } else {
        printf("Invalid subject number!\n");
    }
}
