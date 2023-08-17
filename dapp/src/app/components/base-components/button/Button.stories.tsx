import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./Button";

const meta = {
  title: "Gumball Club/Base components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Send to the Radix Wallet",
    disabled: false,
    icon: "external-link",
  },
};

export const Disabled: Story = {
  args: {
    children: "Send to the Radix Wallet",
    disabled: true,
    icon: "external-link",
  },
};

export const WithoutIcon: Story = {
  args: {
    children: "Send to the Radix Wallet",
    disabled: false,
    icon: "none",
  },
};
