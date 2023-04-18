import java.util.*;

public class Blackjack {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Random rand = new Random();

        System.out.println("How many decks of cards do you want to use?");
        int decks = sc.nextInt();
        List<Integer> deck = new ArrayList<>();

        // create deck
        for (int i = 0; i < decks; i++) {
            for (int j = 1; j <= 13; j++) {
                deck.add(j);
                deck.add(j);
                deck.add(j);
                deck.add(j);
            }
        }

        int playerSum = 0;
        int dealerSum = 0;

        // player's turn
        int index = rand.nextInt(deck.size());
        int card1 = deck.get(index);
        deck.remove(index);
        playerSum += card1;

        index = rand.nextInt(deck.size());
        int card2 = deck.get(index);
        deck.remove(index);
        playerSum += card2;

        System.out.println("Your hand: " + playerSum);
        System.out.println("Do you want to double down (y/n)? ");
        sc.nextLine();
        String doubledown = sc.nextLine();

        if (doubledown.equals("y")) {
            playerSum += card2;
            System.out.println("Your new hand: " + playerSum);
            if (playerSum > 21) {
                System.out.println("You busted!");
                System.exit(0);
            }
        } else {
            System.out.println("Do you want to hit (y/n)? ");
            String hit = sc.nextLine();
            while (hit.equals("y")) {
                int index1 = rand.nextInt(deck.size());
                int card = deck.get(index1);
                deck.remove(index1);
                playerSum += card;

                System.out.println("Your new hand: " + playerSum);

                if (playerSum > 21) {
                    System.out.println("You busted!");
                    System.exit(0);
                }

                System.out.println("Do you want to hit (y/n)? ");
                hit = sc.nextLine();
            }
        }

        // dealer's turn
        int index2 = rand.nextInt(deck.size());
        int card3 = deck.get(index2);
        deck.remove(index2);
        dealerSum += card3;

        System.out.println("Dealer's face up card: " + card3);
        while (dealerSum < 17) {
                index2 = rand.nextInt(deck.size());
                card2 = deck.get(index2);
                deck.remove(index2);
                dealerSum += card2;
            }

            System.out.println("Dealer's hand: " + dealerSum);

            if (dealerSum > 21) {
                System.out.println("Dealer busted! You win!");
            } else if (playerSum > dealerSum) {
                System.out.println("You win!");
            } else {
                System.out.println("You lose.");
            }
        }
    }