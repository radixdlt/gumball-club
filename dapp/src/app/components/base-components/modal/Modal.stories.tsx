import type { Meta, StoryObj } from "@storybook/react";

import { Modal } from "./Modal";
import { Text } from "../text";

const meta = {
  title: "Gumball Club/Base components/Modal",
  component: Modal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    show: true,
    children: (
      <>
        <Text variant="header" className="mb-1">
          You bought a GC Member Card!
        </Text>
        <Text variant="paragraph" className="mb-1">
          This gives you a 50% discount when making a purchase at the Gumball
          and Candy machines.
        </Text>
        <Text variant="paragraph">
          The GC Member Card is an NFT - take a look in your Radix Wallet in the
          NFT section of “Main Main Account”.
        </Text>
      </>
    ),
  },
};
